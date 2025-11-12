<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Détails du Colis</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ colis.tracking_number }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <XIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <div class="flex items-center justify-center">
          <span :class="[
            'px-6 py-2 text-sm font-semibold rounded-full',
            getStatusColor(colis.status)
          ]">
            {{ getStatusLabel(colis.status) }}
          </span>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <UserIcon class="w-5 h-5" />
            Informations Client
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Nom:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ colis.client_name }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Téléphone:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ colis.client_phone }}</p>
            </div>
            <div class="sm:col-span-2">
              <span class="text-gray-600 dark:text-gray-400">Adresse:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">
                {{ colis.client_address }}<br>
                {{ colis.client_city }}, {{ colis.client_postal_code }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PackageIcon class="w-5 h-5" />
            Informations Colis
          </h3>
          <div class="space-y-3 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Description:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ colis.product_description }}</p>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <span class="text-gray-600 dark:text-gray-400">Valeur:</span>
                <p class="font-semibold text-gray-900 dark:text-white mt-1">{{ colis.product_value }} DT</p>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">COD:</span>
                <p class="font-semibold text-gray-900 dark:text-white mt-1">{{ colis.cod_amount }} DT</p>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Poids:</span>
                <p class="font-semibold text-gray-900 dark:text-white mt-1">{{ colis.weight }} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="colis.notes" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileTextIcon class="w-5 h-5" />
            Notes
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 italic">{{ colis.notes }}</p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div class="text-xs text-gray-500 dark:text-gray-500">
            <p>Créé le {{ new Date(colis.created_at).toLocaleString('fr-FR') }}</p>
            <p v-if="colis.updated_at !== colis.created_at" class="mt-1">
              Modifié le {{ new Date(colis.updated_at).toLocaleString('fr-FR') }}
            </p>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex gap-3 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition border border-gray-300 dark:border-gray-600"
        >
          Fermer
        </button>
        <button
          v-if="colis.status === 'delivered' && isBookOrder"
          @click="$emit('request-exchange')"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          <RefreshCwIcon class="w-4 h-4" />
          Demander un Échange
        </button>
        <button
          v-else-if="colis.status === 'delivered' && !isBookOrder"
          @click="$emit('request-return')"
          class="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          <RotateCcwIcon class="w-4 h-4" />
          Demander un Retour
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X as XIcon, User as UserIcon, Package as PackageIcon, FileText as FileTextIcon, RotateCcw as RotateCcwIcon, RefreshCw as RefreshCwIcon } from 'lucide-vue-next'

interface Colis {
  id: string
  tracking_number: string
  client_name: string
  client_phone: string
  client_address: string
  client_city: string
  client_postal_code: string
  product_description: string
  product_value: number
  cod_amount: number
  weight: number
  status: string
  notes: string
  created_at: string
  updated_at: string
}

const props = defineProps<{
  colis: Colis
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'request-return'): void
  (e: 'request-exchange'): void
}>()

const isBookOrder = computed(() => {
  const description = props.colis.product_description.toLowerCase()
  return description.includes('livre') || description.includes('book') || description.includes('livr2')
})

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    collected: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_transit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    out_for_delivery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed_delivery: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    collected: 'Collecté',
    in_transit: 'En transit',
    out_for_delivery: 'En cours de livraison',
    delivered: 'Livré',
    failed_delivery: 'Échec de livraison',
    cancelled: 'Annulé',
    returned: 'Retourné'
  }
  return labels[status] || status
}
</script>
