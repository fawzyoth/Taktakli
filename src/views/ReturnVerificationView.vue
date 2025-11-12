<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Vérification des Retours
        </h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Inspectez et vérifiez les colis retournés
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">En Attente</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ pendingCount }}
              </p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ClockIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">En Cours</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ inProgressCount }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PackageCheckIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Terminées</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ completedCount }}
              </p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Retours à Vérifier</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ filteredVerifications.length }} vérification(s)
              </p>
            </div>
            <select
              v-model="statusFilter"
              class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
        </div>

        <div v-else-if="filteredVerifications.length === 0" class="text-center py-16">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <PackageCheckIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune vérification
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Aucun retour à vérifier pour le moment
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="verification in filteredVerifications"
            :key="verification.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <PackageIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Retour #{{ verification.retour_id.substring(0, 8) }}
                      </h3>
                      <span :class="[
                        'px-2.5 py-1 rounded-full text-xs font-semibold',
                        getStatusColor(verification.verification_status)
                      ]">
                        {{ getStatusLabel(verification.verification_status) }}
                      </span>
                    </div>
                    <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p><strong>Colis:</strong> {{ verification.colis_id.substring(0, 8) }}</p>
                      <p><strong>Date de demande:</strong> {{ new Date(verification.created_at).toLocaleDateString('fr-FR') }}</p>
                      <p v-if="verification.package_condition">
                        <strong>État:</strong> {{ verification.package_condition }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  v-if="verification.verification_status === 'pending'"
                  @click="startVerification(verification.id)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <PlayIcon class="w-4 h-4" />
                  Démarrer
                </button>
                <button
                  @click="openVerificationDetail(verification)"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <EyeIcon class="w-4 h-4" />
                  Voir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReturnVerificationDetailModal
      v-if="showDetailModal && selectedVerification"
      :verification="selectedVerification"
      @close="closeDetailModal"
      @updated="handleVerificationUpdated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import ReturnVerificationDetailModal from '@/components/ReturnVerificationDetailModal.vue'
import {
  Package as PackageIcon,
  PackageCheck as PackageCheckIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Eye as EyeIcon,
  Play as PlayIcon
} from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

interface ReturnVerification {
  id: string
  retour_id: string
  colis_id: string
  verification_status: string
  package_condition: string | null
  items_complete: boolean
  items_damaged: boolean
  damage_description: string | null
  approval_status: string
  created_at: string
  completed_at: string | null
}

const loading = ref(true)
const verifications = ref<ReturnVerification[]>([])
const statusFilter = ref('')
const showDetailModal = ref(false)
const selectedVerification = ref<ReturnVerification | null>(null)

const filteredVerifications = computed(() => {
  if (!statusFilter.value) return verifications.value
  return verifications.value.filter(v => v.verification_status === statusFilter.value)
})

const pendingCount = computed(() =>
  verifications.value.filter(v => v.verification_status === 'pending').length
)

const inProgressCount = computed(() =>
  verifications.value.filter(v => v.verification_status === 'in_progress').length
)

const completedCount = computed(() =>
  verifications.value.filter(v => v.verification_status === 'completed').length
)

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

async function fetchVerifications() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('return_verifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    verifications.value = data || []
  } catch (error) {
    console.error('Error fetching verifications:', error)
  } finally {
    loading.value = false
  }
}

async function startVerification(id: string) {
  try {
    const { error } = await supabase
      .from('return_verifications')
      .update({
        verification_status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error

    await fetchVerifications()
  } catch (error) {
    console.error('Error starting verification:', error)
    alert('Erreur lors du démarrage de la vérification')
  }
}

function openVerificationDetail(verification: ReturnVerification) {
  selectedVerification.value = verification
  showDetailModal.value = true
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedVerification.value = null
}

function handleVerificationUpdated() {
  fetchVerifications()
  closeDetailModal()
}

onMounted(() => {
  fetchVerifications()
})
</script>
