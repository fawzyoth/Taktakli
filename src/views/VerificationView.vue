<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div v-if="!sessionStarted" class="max-w-2xl mx-auto">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <ScanBarcodeIcon class="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Vérification de Retour
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Scannez les articles pour vérifier le contenu du colis
            </p>
          </div>

          <div v-if="loading" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>

          <div v-else-if="!selectedColis" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sélectionnez un Colis à Vérifier
            </label>
            <select
              v-model="selectedColisId"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Choisir un colis...</option>
              <option v-for="colis in returnedColis" :key="colis.id" :value="colis.id">
                {{ colis.tracking_number }} - {{ colis.client_name }}
              </option>
            </select>

            <button
              v-if="selectedColisId"
              @click="startVerification"
              class="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
            >
              <PlayIcon class="w-5 h-5" />
              <span>Commencer la Vérification</span>
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p class="text-sm font-medium text-blue-800 dark:text-blue-300">
                Colis: {{ selectedColis.tracking_number }}
              </p>
              <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">
                Articles attendus: {{ expectedItems.length }}
              </p>
            </div>

            <button
              @click="startSession"
              :disabled="expectedItems.length === 0"
              class="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
            >
              <ScanIcon class="w-5 h-5" />
              <span>Lancer le Scan</span>
            </button>

            <p v-if="expectedItems.length === 0" class="text-sm text-orange-600 dark:text-orange-400 text-center">
              Aucun article configuré pour ce colis. Ajoutez des articles d'abord.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="max-w-6xl mx-auto">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Vérification en Cours
            </h1>
            <button
              @click="completeSession"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
            >
              <CheckCircleIcon class="w-5 h-5" />
              <span>Terminer</span>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ sessionData.total_items }}</p>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <p class="text-sm text-green-600 dark:text-green-400 mb-1">Vérifiés</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ sessionData.verified_items }}</p>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <p class="text-sm text-orange-600 dark:text-orange-400 mb-1">Manquants</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ sessionData.missing_items }}</p>
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

        <div class="grid lg:grid-cols-2 gap-6">
          <ItemChecklist
            :items="expectedItems"
            :verified-items="verifiedItemIds"
            :current-scan="lastScannedCode"
          />

          <MissingItemsReport
            v-if="sessionData.missing_items > 0"
            :missing-items="missingItems"
            :session-id="currentSessionId"
          />
        </div>
      </div>

      <VerificationCompleteModal
        v-if="showCompleteModal"
        :session-data="sessionData"
        :missing-items="missingItems"
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
  ScanBarcode as ScanBarcodeIcon,
  Play as PlayIcon,
  Scan as ScanIcon,
  CheckCircle as CheckCircleIcon
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

interface VerificationSession {
  id: string
  total_items: number
  verified_items: number
  missing_items: number
  session_status: string
}

const loading = ref(true)
const sessionStarted = ref(false)
const scannerActive = ref(false)
const selectedColisId = ref('')
const returnedColis = ref<Colis[]>([])
const expectedItems = ref<ColisItem[]>([])
const verifiedItemIds = ref<Set<string>>(new Set())
const lastScannedCode = ref('')
const currentSessionId = ref('')
const showCompleteModal = ref(false)

const sessionData = ref<VerificationSession>({
  id: '',
  total_items: 0,
  verified_items: 0,
  missing_items: 0,
  session_status: 'in_progress'
})

const selectedColis = computed(() => {
  return returnedColis.value.find(c => c.id === selectedColisId.value)
})

const missingItems = computed(() => {
  return expectedItems.value.filter(item => !verifiedItemIds.value.has(item.id))
})

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
      }
    ]
  } catch (error) {
    console.error('Error loading colis:', error)
  } finally {
    loading.value = false
  }
}

async function startVerification() {
  if (!selectedColisId.value) return

  loading.value = true
  try {
    expectedItems.value = [
      {
        id: '1',
        colis_id: selectedColisId.value,
        item_name: 'Smartphone Samsung Galaxy A54',
        item_sku: 'SAM-A54-BLK',
        item_barcode: '8806094935912',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: ''
      },
      {
        id: '2',
        colis_id: selectedColisId.value,
        item_name: 'Coque de Protection',
        item_sku: 'CASE-A54-CLR',
        item_barcode: '1234567890123',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: 'Coque transparente'
      },
      {
        id: '3',
        colis_id: selectedColisId.value,
        item_name: 'Chargeur Rapide USB-C',
        item_sku: 'CHG-USBC-25W',
        item_barcode: '9876543210987',
        item_quantity: 1,
        item_image_url: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=200',
        item_notes: '25W Fast Charging'
      }
    ]
  } catch (error) {
    console.error('Error loading items:', error)
  } finally {
    loading.value = false
  }
}

async function startSession() {
  sessionStarted.value = true
  scannerActive.value = true

  const newSession = {
    id: 'session-' + Date.now(),
    total_items: expectedItems.value.length,
    verified_items: 0,
    missing_items: expectedItems.value.length,
    session_status: 'in_progress'
  }

  sessionData.value = newSession
  currentSessionId.value = newSession.id
}

function handleScan(code: string) {
  lastScannedCode.value = code

  const matchedItem = expectedItems.value.find(item => item.item_barcode === code)

  if (matchedItem && !verifiedItemIds.value.has(matchedItem.id)) {
    verifiedItemIds.value.add(matchedItem.id)
    sessionData.value.verified_items = verifiedItemIds.value.size
    sessionData.value.missing_items = sessionData.value.total_items - verifiedItemIds.value.size

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIHGvz6dWmUhUPUqvn77RgHAU7k9jyzHksBSd5x+/glEUMF2K37u+rWRQLSqLh8sbgKwUneMjv5JFBCRlhtO3vp1UVC0+p5O+1YxwGOpPY8sx6LQUoecju4pdIDRthue7uqVkVDU6o5fC2ZB0GO5PY88x6LQUoecnw');
    audio.play().catch(() => {});
  } else if (matchedItem) {
    alert('Article déjà scanné!')
  } else {
    alert('Code non reconnu: ' + code)
  }

  setTimeout(() => {
    lastScannedCode.value = ''
  }, 2000)
}

function completeSession() {
  scannerActive.value = false
  sessionData.value.session_status = 'completed'
  showCompleteModal.value = true
}

function handleCompleteClose() {
  showCompleteModal.value = false
  sessionStarted.value = false
  selectedColisId.value = ''
  expectedItems.value = []
  verifiedItemIds.value.clear()
  lastScannedCode.value = ''
  loadReturnedColis()
}

onMounted(() => {
  loadReturnedColis()
})
</script>
