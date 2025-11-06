<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Livraison</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gérez vos colis et retours</p>
        </div>
        <button
          @click="$router.push('/verification')"
          class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition shadow-lg"
        >
          <ScanBarcodeIcon class="w-5 h-5" />
          <span>Vérifier un Retour</span>
        </button>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-800">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="activeTab = 'colis'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'colis'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <PackageIcon class="w-5 h-5" />
                <span>Mes Colis</span>
                <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {{ colisList.length }}
                </span>
              </div>
            </button>
            <button
              @click="activeTab = 'retours'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'retours'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <div class="flex items-center space-x-2">
                <RotateCcwIcon class="w-5 h-5" />
                <span>Retours</span>
                <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  {{ retoursList.length }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div v-if="activeTab === 'colis'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Mes Colis</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">Créez et suivez vos colis</p>
            </div>
            <button
              @click="showCreateColisModal = true"
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Nouveau Colis</span>
            </button>
          </div>

          <div v-if="loading" class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>

          <div v-else-if="colisList.length === 0" class="text-center py-16">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <PackageIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun colis</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Créez votre premier colis pour commencer</p>
            <button
              @click="showCreateColisModal = true"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Créer un Colis
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="colis in colisList"
              :key="colis.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ colis.tracking_number }}
                    </span>
                    <span :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      getStatusColor(colis.status)
                    ]">
                      {{ getStatusLabel(colis.status) }}
                    </span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">Client:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ colis.client_name }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">Téléphone:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ colis.client_phone }}</span>
                    </div>
                    <div class="sm:col-span-2">
                      <span class="text-gray-600 dark:text-gray-400">Adresse:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">
                        {{ colis.client_address }}, {{ colis.client_city }} {{ colis.client_postal_code }}
                      </span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">Valeur:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ colis.product_value }} DT</span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">COD:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ colis.cod_amount }} DT</span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-3">
                    Créé le {{ new Date(colis.created_at).toLocaleString('fr-FR') }}
                  </p>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    v-if="colis.status === 'delivered'"
                    @click="requestReturn(colis.id)"
                    class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    <RotateCcwIcon class="w-4 h-4" />
                    <span>Demander un Retour</span>
                  </button>
                  <button
                    v-if="colis.status === 'pending'"
                    @click="deleteColis(colis.id)"
                    class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Retours</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Vérifiez et gérez les retours</p>
          </div>

          <div v-if="loading" class="text-center py-12">
            <p class="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>

          <div v-else-if="retoursList.length === 0" class="text-center py-16">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <RotateCcwIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun retour</h3>
            <p class="text-gray-600 dark:text-gray-400">Les demandes de retour apparaîtront ici</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="retour in retoursList"
              :key="retour.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
            >
              <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      Retour #{{ retour.id.substring(0, 8) }}
                    </span>
                    <span :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      getRetourStatusColor(retour.return_status)
                    ]">
                      {{ getRetourStatusLabel(retour.return_status) }}
                    </span>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">Colis:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">
                        {{ getColisTrackingNumber(retour.colis_id) }}
                      </span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">Raison:</span>
                      <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ retour.return_reason }}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-3">
                      Demandé le {{ new Date(retour.created_at).toLocaleString('fr-FR') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateColisModal
      v-if="showCreateColisModal"
      @close="showCreateColisModal = false"
      @created="handleColisCreated"
    />

    <ReturnRequestModal
      v-if="showReturnModal"
      :colis-id="selectedColisId"
      @close="showReturnModal = false"
      @created="handleReturnCreated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import CreateColisModal from '@/components/CreateColisModal.vue'
import ReturnRequestModal from '@/components/ReturnRequestModal.vue'
import { Package as PackageIcon, RotateCcw as RotateCcwIcon, Plus as PlusIcon, ScanBarcode as ScanBarcodeIcon } from 'lucide-vue-next'

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

interface Retour {
  id: string
  colis_id: string
  return_reason: string
  return_status: string
  verification_notes: string
  created_at: string
  verified_at: string | null
}

const activeTab = ref<'colis' | 'retours'>('colis')
const loading = ref(true)
const colisList = ref<Colis[]>([])
const retoursList = ref<Retour[]>([])
const showCreateColisModal = ref(false)
const showReturnModal = ref(false)
const selectedColisId = ref<string>('')

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    picked_up: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_transit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    returned: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    picked_up: 'Ramassé',
    in_transit: 'En transit',
    delivered: 'Livré',
    returned: 'Retourné'
  }
  return labels[status] || status
}

function getRetourStatusColor(status: string) {
  const colors: Record<string, string> = {
    requested: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getRetourStatusLabel(status: string) {
  const labels: Record<string, string> = {
    requested: 'Demandé',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    completed: 'Complété'
  }
  return labels[status] || status
}

function getColisTrackingNumber(colisId: string) {
  const colis = colisList.value.find(c => c.id === colisId)
  return colis?.tracking_number || 'N/A'
}

async function fetchColis() {
  loading.value = true
  try {
    colisList.value = []
  } catch (error) {
    console.error('Error fetching colis:', error)
  } finally {
    loading.value = false
  }
}

async function fetchRetours() {
  loading.value = true
  try {
    retoursList.value = []
  } catch (error) {
    console.error('Error fetching retours:', error)
  } finally {
    loading.value = false
  }
}

function requestReturn(colisId: string) {
  selectedColisId.value = colisId
  showReturnModal.value = true
}

async function deleteColis(colisId: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce colis?')) {
    console.log('Deleting colis:', colisId)
    await fetchColis()
  }
}

function handleColisCreated() {
  showCreateColisModal.value = false
  fetchColis()
}

function handleReturnCreated() {
  showReturnModal.value = false
  fetchRetours()
}

onMounted(async () => {
  await fetchColis()
  await fetchRetours()
})
</script>
