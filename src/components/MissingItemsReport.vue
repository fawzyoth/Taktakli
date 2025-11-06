<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border-2 border-orange-300 dark:border-orange-700 shadow-lg p-6">
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
        <AlertTriangleIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Articles Manquants
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ missingItems.length }} article{{ missingItems.length > 1 ? 's' : '' }} non vérifié{{ missingItems.length > 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <div class="space-y-4 mb-6">
      <div
        v-for="item in missingItems"
        :key="item.id"
        class="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div
              v-if="item.item_image_url"
              class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-orange-300 dark:border-orange-700"
            >
              <img
                :src="item.item_image_url"
                :alt="item.item_name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div
              v-else
              class="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-orange-300 dark:border-orange-700"
            >
              <PackageIcon class="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <XCircleIcon class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              {{ item.item_name }}
            </h4>
            <div class="space-y-1 text-sm">
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 dark:text-gray-400">SKU:</span>
                <code class="font-mono font-semibold text-gray-900 dark:text-white">
                  {{ item.item_sku }}
                </code>
              </div>
              <div class="flex items-center space-x-2">
                <BarcodeIcon class="w-4 h-4 text-gray-400" />
                <code class="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {{ item.item_barcode }}
                </code>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 dark:text-gray-400">Quantité attendue:</span>
                <span class="font-bold text-orange-600 dark:text-orange-400">
                  {{ item.item_quantity }}
                </span>
              </div>
              <p v-if="item.item_notes" class="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                Note: {{ item.item_notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-4">
      <div class="flex items-start space-x-3">
        <InfoIcon class="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
        <div class="text-sm">
          <p class="font-semibold text-orange-900 dark:text-orange-300 mb-1">
            Action Requise
          </p>
          <p class="text-orange-800 dark:text-orange-400">
            Ces articles n'ont pas été détectés lors de la vérification. Veuillez vérifier physiquement
            le colis et contacter le client si nécessaire.
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <button
        @click="printReport"
        class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
      >
        <PrinterIcon class="w-5 h-5" />
        <span>Imprimer le Rapport</span>
      </button>

      <button
        @click="contactClient"
        class="w-full px-4 py-3 border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 font-semibold rounded-lg transition flex items-center justify-center space-x-2"
      >
        <PhoneIcon class="w-5 h-5" />
        <span>Contacter le Client</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertTriangle as AlertTriangleIcon,
  XCircle as XCircleIcon,
  Package as PackageIcon,
  Barcode as BarcodeIcon,
  Info as InfoIcon,
  Printer as PrinterIcon,
  Phone as PhoneIcon
} from 'lucide-vue-next'

interface ColisItem {
  id: string
  colis_id: string
  item_name: string
  item_sku: string
  item_barcode: string
  item_quantity: number
  item_image_url: string
  item_notes: string
}

defineProps<{
  missingItems: ColisItem[]
  sessionId: string
}>()

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

function printReport() {
  window.print()
}

function contactClient() {
  alert('Fonctionnalité de contact client à venir')
}
</script>
