<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div v-if="!sessionStarted" class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <PackagesIcon class="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Vérification Multi-Colis
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Scannez rapidement plusieurs colis retournés en une seule session
            </p>
          </div>

          <div v-if="loading" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <ZapIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div class="text-sm text-blue-800 dark:text-blue-300">
                  <p class="font-semibold mb-1">Mode Scan Rapide</p>
                  <p>Sélectionnez tous les colis à vérifier, puis scannez tous les articles d'un coup. Le système reconnaîtra automatiquement à quel colis appartient chaque article.</p>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-4">
                <label class="block text-lg font-bold text-gray-900 dark:text-white">
                  Colis à Vérifier ({{ selectedColisIds.length }})
                </label>
                <button
                  @click="selectAllColis"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ selectedColisIds.length === returnedColis.length ? 'Tout désélectionner' : 'Tout sélectionner' }}
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                <div
                  v-for="colis in returnedColis"
                  :key="colis.id"
                  @click="toggleColisSelection(colis.id)"
                  :class="[
                    'border-2 rounded-lg p-4 cursor-pointer transition-all',
                    selectedColisIds.includes(colis.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          :checked="selectedColisIds.includes(colis.id)"
                          @click.stop
                          class="w-5 h-5 text-blue-600 rounded"
                        />
                        <span class="font-bold text-gray-900 dark:text-white">
                          {{ colis.tracking_number }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ colis.client_name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {{ getItemCount(colis.id) }} articles
                      </p>
                    </div>
                    <PackageIcon class="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Colis Sélectionnés</p>
                  <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {{ selectedColisIds.length }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Articles</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ totalItemsToScan }}
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="startBatchSession"
              :disabled="selectedColisIds.length === 0"
              class="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <ScanIcon class="w-6 h-6" />
              <span>Commencer le Scan Rapide</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="max-w-7xl mx-auto">
        <div class="mb-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Scan en Cours
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                {{ selectedColisIds.length }} colis • {{ totalItemsToScan }} articles
              </p>
            </div>
            <button
              @click="completeSession"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
            >
              <CheckCircleIcon class="w-5 h-5" />
              <span>Terminer</span>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalItemsToScan }}</p>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
              <p class="text-sm text-green-600 dark:text-green-400 mb-1">Scannés</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ totalScanned }}</p>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <p class="text-sm text-orange-600 dark:text-orange-400 mb-1">Restants</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ totalItemsToScan - totalScanned }}</p>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p class="text-sm text-blue-600 dark:text-blue-400 mb-1">Progression</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ progressPercentage }}%</p>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1 mb-6">
            <div class="bg-white dark:bg-gray-900 rounded-xl p-6">
              <BarcodeScanner
                :is-active="scannerActive"
                @scanned="handleScan"
                @toggle="scannerActive = !scannerActive"
              />
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div
              v-for="colis in selectedColisList"
              :key="colis.id"
              class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              <div
                @click="expandedColisId = expandedColisId === colis.id ? null : colis.id"
                class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 flex-1">
                    <div :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      getColisProgress(colis.id) === 100
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    ]">
                      <component
                        :is="getColisProgress(colis.id) === 100 ? CheckCircle2Icon : PackageIcon"
                        :class="[
                          'w-6 h-6',
                          getColisProgress(colis.id) === 100
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                        ]"
                      />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900 dark:text-white">
                        {{ colis.tracking_number }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ colis.client_name }} • {{ getColisScannedCount(colis.id) }}/{{ getItemCount(colis.id) }} articles
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="text-right">
                      <div class="w-16 h-16 relative">
                        <svg class="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            stroke-width="6"
                            fill="none"
                            class="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            stroke-width="6"
                            fill="none"
                            :stroke-dasharray="`${getColisProgress(colis.id) * 1.76} 176`"
                            :class="[
                              getColisProgress(colis.id) === 100
                                ? 'text-green-500'
                                : 'text-blue-500'
                            ]"
                          />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <span class="text-xs font-bold text-gray-900 dark:text-white">
                            {{ Math.round(getColisProgress(colis.id)) }}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon
                      :class="[
                        'w-5 h-5 text-gray-400 transition-transform',
                        expandedColisId === colis.id ? 'transform rotate-180' : ''
                      ]"
                    />
                  </div>
                </div>
              </div>

              <div
                v-show="expandedColisId === colis.id"
                class="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50"
              >
                <ItemChecklist
                  :items="getColisItems(colis.id)"
                  :verified-items="verifiedItemsByColisId[colis.id] || new Set()"
                  :current-scan="lastScannedCode"
                />
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <ActivityIcon class="w-5 h-5" />
                <span>Activité Récente</span>
              </h3>
              <div class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="(activity, index) in recentActivity"
                  :key="index"
                  class="flex items-start space-x-3 text-sm"
                >
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div class="flex-1">
                    <p class="text-gray-900 dark:text-white font-medium">
                      {{ activity.item_name }}
                    </p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      {{ activity.tracking_number }} • {{ activity.time }}
                    </p>
                  </div>
                </div>
                <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-400">
                  Aucune activité
                </div>
              </div>
            </div>

            <MissingItemsReport
              v-if="totalMissingItems > 0"
              :missing-items="allMissingItems"
              :session-id="currentSessionId"
            />
          </div>
        </div>
      </div>

      <VerificationCompleteModal
        v-if="showCompleteModal"
        :session-data="sessionSummary"
        :missing-items="allMissingItems"
        @close="handleCompleteClose"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import BarcodeScanner from '@/components/BarcodeScanner.vue'
import ItemChecklist from '@/components/ItemChecklist.vue'
import MissingItemsReport from '@/components/MissingItemsReport.vue'
import VerificationCompleteModal from '@/components/VerificationCompleteModal.vue'
import {
  Package as PackageIcon,
  Scan as ScanIcon,
  CheckCircle as CheckCircleIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronDown as ChevronDownIcon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Layers as PackagesIcon
} from 'lucide-vue-next'

interface Colis {
  id: string
  tracking_number: string
  client_name: string
  status: string
}

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

interface Activity {
  item_name: string
  tracking_number: string
  time: string
}

const loading = ref(true)
const sessionStarted = ref(false)
const scannerActive = ref(false)
const selectedColisIds = ref<string[]>([])
const returnedColis = ref<Colis[]>([])
const allItems = ref<ColisItem[]>([])
const verifiedItemsByColisId = ref<Record<string, Set<string>>>({})
const lastScannedCode = ref('')
const currentSessionId = ref('')
const showCompleteModal = ref(false)
const expandedColisId = ref<string | null>(null)
const recentActivity = ref<Activity[]>([])

const selectedColisList = computed(() => {
  return returnedColis.value.filter(c => selectedColisIds.value.includes(c.id))
})

const totalItemsToScan = computed(() => {
  return allItems.value.filter(item => selectedColisIds.value.includes(item.colis_id)).length
})

const totalScanned = computed(() => {
  let count = 0
  for (const colisId of selectedColisIds.value) {
    count += (verifiedItemsByColisId.value[colisId]?.size || 0)
  }
  return count
})

const progressPercentage = computed(() => {
  if (totalItemsToScan.value === 0) return 0
  return Math.round((totalScanned.value / totalItemsToScan.value) * 100)
})

const allMissingItems = computed(() => {
  const missing: ColisItem[] = []
  for (const colisId of selectedColisIds.value) {
    const items = getColisItems(colisId)
    const verified = verifiedItemsByColisId.value[colisId] || new Set()
    missing.push(...items.filter(item => !verified.has(item.id)))
  }
  return missing
})

const totalMissingItems = computed(() => {
  return allMissingItems.value.length
})

const sessionSummary = computed(() => ({
  id: currentSessionId.value,
  total_items: totalItemsToScan.value,
  verified_items: totalScanned.value,
  missing_items: totalMissingItems.value,
  session_status: 'completed'
}))

function getItemCount(colisId: string): number {
  return allItems.value.filter(item => item.colis_id === colisId).length
}

function getColisItems(colisId: string): ColisItem[] {
  return allItems.value.filter(item => item.colis_id === colisId)
}

function getColisScannedCount(colisId: string): number {
  return verifiedItemsByColisId.value[colisId]?.size || 0
}

function getColisProgress(colisId: string): number {
  const total = getItemCount(colisId)
  const scanned = getColisScannedCount(colisId)
  if (total === 0) return 0
  return (scanned / total) * 100
}

function toggleColisSelection(colisId: string) {
  const index = selectedColisIds.value.indexOf(colisId)
  if (index > -1) {
    selectedColisIds.value.splice(index, 1)
  } else {
    selectedColisIds.value.push(colisId)
  }
}

function selectAllColis() {
  if (selectedColisIds.value.length === returnedColis.value.length) {
    selectedColisIds.value = []
  } else {
    selectedColisIds.value = returnedColis.value.map(c => c.id)
  }
}

async function loadReturnedColis() {
  loading.value = true
  try {
    returnedColis.value = [
      {
        id: '1',
        tracking_number: 'SHOPA-ABC123',
        client_name: 'Ahmed Ben Ali',
        status: 'returned'
      },
      {
        id: '2',
        tracking_number: 'SHOPA-DEF456',
        client_name: 'Fatima Zohra',
        status: 'returned'
      },
      {
        id: '3',
        tracking_number: 'SHOPA-GHI789',
        client_name: 'Mohamed Salah',
        status: 'returned'
      },
      {
        id: '4',
        tracking_number: 'SHOPA-JKL012',
        client_name: 'Leila Mansour',
        status: 'returned'
      }
    ]

    allItems.value = [
      {
        id: '1-1',
        colis_id: '1',
        item_name: 'Smartphone Samsung Galaxy A54',
        item_sku: 'SAM-A54-BLK',
        item_barcode: '8806094935912',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '1-2',
        colis_id: '1',
        item_name: 'Coque de Protection',
        item_sku: 'CASE-A54-CLR',
        item_barcode: '1234567890123',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: 'Coque transparente'
      },
      {
        id: '2-1',
        colis_id: '2',
        item_name: 'Écouteurs Bluetooth',
        item_sku: 'EAR-BT-500',
        item_barcode: '5551234567890',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '2-2',
        colis_id: '2',
        item_name: 'Câble USB-C',
        item_sku: 'CABLE-USBC-2M',
        item_barcode: '6661234567890',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/163114/power-cable-electricity-technology-163114.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '3-1',
        colis_id: '3',
        item_name: 'Montre Connectée',
        item_sku: 'WATCH-SM-BLK',
        item_barcode: '7771234567890',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '4-1',
        colis_id: '4',
        item_name: 'Power Bank 10000mAh',
        item_sku: 'PWR-10K-WHT',
        item_barcode: '8881234567890',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '4-2',
        colis_id: '4',
        item_name: 'Support Téléphone Voiture',
        item_sku: 'MOUNT-CAR-360',
        item_barcode: '9991234567890',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      }
    ]
  } catch (error) {
    console.error('Error loading colis:', error)
  } finally {
    loading.value = false
  }
}

async function startBatchSession() {
  if (selectedColisIds.value.length === 0) return

  for (const colisId of selectedColisIds.value) {
    verifiedItemsByColisId.value[colisId] = new Set()
  }

  sessionStarted.value = true
  scannerActive.value = true
  currentSessionId.value = 'batch-session-' + Date.now()
  expandedColisId.value = selectedColisIds.value[0]
}

function handleScan(code: string) {
  lastScannedCode.value = code

  const matchedItem = allItems.value.find(
    item => item.item_barcode === code && selectedColisIds.value.includes(item.colis_id)
  )

  if (matchedItem) {
    const colisVerified = verifiedItemsByColisId.value[matchedItem.colis_id] || new Set()

    if (!colisVerified.has(matchedItem.id)) {
      colisVerified.add(matchedItem.id)
      verifiedItemsByColisId.value[matchedItem.colis_id] = colisVerified

      const colis = returnedColis.value.find(c => c.id === matchedItem.colis_id)
      recentActivity.value.unshift({
        item_name: matchedItem.item_name,
        tracking_number: colis?.tracking_number || '',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      })

      if (recentActivity.value.length > 10) {
        recentActivity.value.pop()
      }

      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHGvz6dWmUhUPUqvn77RgHAU7k9jyzHksBSd5x+/glEUMF2K37u+rWRQLSqLh8sbgKwUneMjv5JFBCRlhtO3vp1UVC0+p5O+1YxwGOpPY8sx6LQUoecju4pdIDRthue7uqVkVDU6o5fC2ZB0GO5PY88x6LQUoecnw')
      audio.play().catch(() => {})
    } else {
      alert('Article déjà scanné!')
    }
  } else {
    alert('Code non reconnu ou ne correspond à aucun colis sélectionné: ' + code)
  }

  setTimeout(() => {
    lastScannedCode.value = ''
  }, 2000)
}

function completeSession() {
  scannerActive.value = false
  showCompleteModal.value = true
}

function handleCompleteClose() {
  showCompleteModal.value = false
  sessionStarted.value = false
  selectedColisIds.value = []
  verifiedItemsByColisId.value = {}
  recentActivity.value = []
  expandedColisId.value = null
  loadReturnedColis()
}

onMounted(() => {
  loadReturnedColis()
})
</script>
