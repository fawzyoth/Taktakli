<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestion des Colis</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Suivez et gérez vos livraisons en temps réel</p>
      </div>

      <div class="bg-white dark:text-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom de client ou téléphone..."
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="flex gap-3">
              <select
                v-model="statusFilter"
                class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="collected">Collecté</option>
                <option value="in_transit">En transit</option>
                <option value="out_for_delivery">En cours de livraison</option>
                <option value="delivered">Livré</option>
                <option value="failed_delivery">Échec de livraison</option>
                <option value="cancelled">Annulé</option>
                <option value="returned">Retourné</option>
              </select>
              <select
                v-model="recommendationFilter"
                class="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les clients</option>
                <option value="good">Bons clients</option>
                <option value="not_good">Mauvais clients</option>
                <option value="unrated">Non évalués</option>
              </select>
              <button
                @click="showCreateColisModal = true"
                class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                <PlusIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Nouveau</span>
              </button>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Affichage de <span class="font-semibold text-gray-900 dark:text-white">{{ filteredColis.length }}</span> colis
              <span v-if="searchQuery || statusFilter || recommendationFilter"> (filtré sur {{ colisList.length }} total)</span>
            </div>
            <button
              v-if="searchQuery || statusFilter || recommendationFilter"
              @click="clearFilters"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        <div v-if="selectedPackages.size > 0" class="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ selectedPackages.size }} colis sélectionné(s)
              </span>
              <button
                @click="selectedPackages.clear()"
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                Tout désélectionner
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="printSelected"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                <PrinterIcon class="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
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

        <div v-else-if="filteredColis.length === 0" class="text-center py-16">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <SearchIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun résultat</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Aucun colis ne correspond à vos critères de recherche</p>
          <button
            @click="clearFilters"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="isAllFilteredSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Téléphone
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Valeur
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Évaluation
                </th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="colis in filteredColis"
                :key="colis.id"
                :class="[
                  'transition-colors',
                  selectedPackages.has(colis.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                ]"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :checked="selectedPackages.has(colis.id)"
                    @change="togglePackageSelection(colis.id)"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="openDetails(colis)">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <UserIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ colis.client_name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ colis.tracking_number }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="openDetails(colis)">
                  <div class="flex items-center text-sm text-gray-900 dark:text-white">
                    <PhoneIcon class="w-4 h-4 text-gray-400 mr-2" />
                    {{ colis.client_phone }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell cursor-pointer" @click="openDetails(colis)">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ colis.product_value }} DT
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    COD: {{ colis.cod_amount }} DT
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap cursor-pointer" @click="openDetails(colis)">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                    getStatusColor(colis.status)
                  ]">
                    {{ getStatusLabel(colis.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="colis.client_recommendation || ''"
                    @change="updateRecommendation(colis.id, ($event.target as HTMLSelectElement).value)"
                    @click.stop
                    :class="[
                      'px-3 py-1.5 text-xs font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      getRecommendationClass(colis.client_recommendation)
                    ]"
                  >
                    <option value="">Non évalué</option>
                    <option value="good">Bon client</option>
                    <option value="not_good">Mauvais client</option>
                  </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click.stop="openDetails(colis)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium"
                  >
                    <EyeIcon class="w-4 h-4" />
                    <span class="hidden sm:inline">Voir</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PrintPackages :packages="selectedPackagesForPrint" ref="printComponent" />

    <CreateColisModal
      v-if="showCreateColisModal"
      @close="showCreateColisModal = false"
      @created="handleColisCreated"
    />

    <PackageDetailsModal
      v-if="showDetailsModal && selectedColis"
      :colis="selectedColis"
      @close="showDetailsModal = false"
      @request-return="handleRequestReturn"
    />

    <ReturnRequestModal
      v-if="showReturnModal && selectedColis"
      :colis-id="selectedColis.id"
      @close="showReturnModal = false"
      @created="handleReturnCreated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import CreateColisModal from '@/components/CreateColisModal.vue'
import PackageDetailsModal from '@/components/PackageDetailsModal.vue'
import ReturnRequestModal from '@/components/ReturnRequestModal.vue'
import PrintPackages from '@/components/PrintPackages.vue'
import { Package as PackageIcon, Plus as PlusIcon, Search as SearchIcon, Eye as EyeIcon, User as UserIcon, Phone as PhoneIcon, Printer as PrinterIcon } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

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
  client_recommendation: string | null
  created_at: string
  updated_at: string
}

const loading = ref(true)
const colisList = ref<Colis[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const recommendationFilter = ref('')
const selectedPackages = ref<Set<string>>(new Set())
const showCreateColisModal = ref(false)
const showDetailsModal = ref(false)
const showReturnModal = ref(false)
const selectedColis = ref<Colis | null>(null)

const filteredColis = computed(() => {
  let filtered = colisList.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(colis =>
      colis.client_name.toLowerCase().includes(query) ||
      colis.client_phone.includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(colis => colis.status === statusFilter.value)
  }

  if (recommendationFilter.value) {
    if (recommendationFilter.value === 'unrated') {
      filtered = filtered.filter(colis => !colis.client_recommendation)
    } else {
      filtered = filtered.filter(colis => colis.client_recommendation === recommendationFilter.value)
    }
  }

  return filtered
})

const isAllFilteredSelected = computed(() => {
  if (filteredColis.value.length === 0) return false
  return filteredColis.value.every(colis => selectedPackages.value.has(colis.id))
})

const selectedPackagesForPrint = computed(() => {
  return colisList.value.filter(colis => selectedPackages.value.has(colis.id))
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
    out_for_delivery: 'En livraison',
    delivered: 'Livré',
    failed_delivery: 'Échec',
    cancelled: 'Annulé',
    returned: 'Retourné'
  }
  return labels[status] || status
}

function getRecommendationClass(recommendation: string | null) {
  if (recommendation === 'good') {
    return 'bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
  } else if (recommendation === 'not_good') {
    return 'bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
  } else {
    return 'bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  }
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  recommendationFilter.value = ''
}

function togglePackageSelection(id: string) {
  if (selectedPackages.value.has(id)) {
    selectedPackages.value.delete(id)
  } else {
    selectedPackages.value.add(id)
  }
}

function toggleSelectAll() {
  if (isAllFilteredSelected.value) {
    filteredColis.value.forEach(colis => selectedPackages.value.delete(colis.id))
  } else {
    filteredColis.value.forEach(colis => selectedPackages.value.add(colis.id))
  }
}

function printSelected() {
  window.print()
}

function openDetails(colis: Colis) {
  selectedColis.value = colis
  showDetailsModal.value = true
}

function handleRequestReturn() {
  showDetailsModal.value = false
  showReturnModal.value = true
}

async function updateRecommendation(colisId: string, recommendation: string) {
  try {
    const { error } = await supabase
      .from('colis')
      .update({ client_recommendation: recommendation || null })
      .eq('id', colisId)

    if (error) throw error

    const colisIndex = colisList.value.findIndex(c => c.id === colisId)
    if (colisIndex !== -1) {
      colisList.value[colisIndex].client_recommendation = recommendation || null
    }
  } catch (error) {
    console.error('Error updating recommendation:', error)
    alert('Erreur lors de la mise à jour de l\'évaluation')
  }
}

async function fetchColis() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('colis')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    colisList.value = data || []
  } catch (error) {
    console.error('Error fetching colis:', error)
  } finally {
    loading.value = false
  }
}

function handleColisCreated() {
  showCreateColisModal.value = false
  fetchColis()
}

function handleReturnCreated() {
  showReturnModal.value = false
  fetchColis()
}

onMounted(async () => {
  await fetchColis()
})
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .print\:block,
  .print\:block * {
    visibility: visible;
  }
  .print\:block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>
