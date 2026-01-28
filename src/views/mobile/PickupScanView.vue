<template>
  <div class="pickup-scan">
    <!-- Scanner Section -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold">Pointage Pick up</h2>
        <p class="text-blue-100 text-sm">Scannez les colis à récupérer</p>
      </div>

      <!-- Scanner Button -->
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
        <button
          @click="openScanner"
          class="w-full bg-white text-blue-600 rounded-xl py-4 px-6 font-semibold flex items-center justify-center space-x-3 shadow-lg"
        >
          <ScanLine class="w-6 h-6" />
          <span>Scanner un code-barres</span>
        </button>

        <!-- Manual Entry -->
        <div class="mt-4">
          <div class="flex space-x-2">
            <input
              v-model="manualCode"
              type="text"
              placeholder="Ou entrer le code manuellement..."
              class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              @click="addByCode"
              class="px-4 py-3 bg-white text-blue-600 rounded-xl font-medium"
            >
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-around mt-6">
        <div class="text-center">
          <p class="text-3xl font-bold">{{ scannedPackages.length }}</p>
          <p class="text-blue-100 text-sm">Scannés</p>
        </div>
        <div class="w-px h-10 bg-white/30"></div>
        <div class="text-center">
          <p class="text-3xl font-bold">{{ pendingPickups.length }}</p>
          <p class="text-blue-100 text-sm">En attente</p>
        </div>
      </div>
    </div>

    <!-- Seller Filter -->
    <div class="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <select
        v-model="selectedSeller"
        class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm font-medium"
      >
        <option value="all">Tous les vendeurs</option>
        <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
          {{ seller.name }} ({{ seller.count }} colis)
        </option>
      </select>
    </div>

    <!-- Scanned Packages List -->
    <div v-if="scannedPackages.length > 0" class="p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-900 dark:text-white">Colis scannés</h3>
        <button
          @click="confirmPickup"
          class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <CheckCircle class="w-4 h-4" />
          <span>Confirmer tout</span>
        </button>
      </div>
      <div class="space-y-2">
        <div
          v-for="pkg in scannedPackages"
          :key="pkg.id"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm font-mono font-medium text-gray-900 dark:text-white">{{ pkg.tracking }}</p>
                <p class="text-xs text-gray-500">{{ pkg.seller }}</p>
              </div>
            </div>
            <button @click="removeScanned(pkg.id)" class="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg">
              <X class="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Pickups -->
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
        Colis en attente ({{ filteredPendingPickups.length }})
      </h3>
      <div class="space-y-3">
        <div
          v-for="pkg in filteredPendingPickups"
          :key="pkg.id"
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Package class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-mono font-medium text-gray-900 dark:text-white">{{ pkg.tracking }}</p>
                <p class="text-xs text-gray-500">{{ pkg.seller }}</p>
                <p class="text-xs text-gray-400">{{ pkg.destination }}</p>
              </div>
            </div>
            <button
              @click="quickScan(pkg)"
              class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
            >
              Scanner
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Scanner Modal -->
    <Transition name="fade">
      <div v-if="showScanner" class="fixed inset-0 z-50 bg-black">
        <div class="relative h-full flex flex-col">
          <!-- Scanner Header -->
          <div class="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
            <button @click="closeScanner" class="p-2 bg-white/20 backdrop-blur rounded-full">
              <X class="w-6 h-6 text-white" />
            </button>
            <span class="text-white font-medium">Pointez vers le code-barres</span>
            <button class="p-2 bg-white/20 backdrop-blur rounded-full">
              <Flashlight class="w-6 h-6 text-white" />
            </button>
          </div>

          <!-- Scanner View -->
          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-64 h-64">
              <!-- Scanner Frame -->
              <div class="absolute inset-0 border-2 border-white/50 rounded-2xl"></div>
              <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
              <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
              <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
              <!-- Scan Line Animation -->
              <div class="absolute left-2 right-2 h-0.5 bg-blue-500 animate-scan"></div>
            </div>
          </div>

          <!-- Scanner Info -->
          <div class="p-6 bg-gradient-to-t from-black/80 to-transparent">
            <p class="text-center text-white/80 text-sm">
              Placez le code-barres dans le cadre pour scanner automatiquement
            </p>
            <!-- Simulate scan result -->
            <button
              @click="simulateScan"
              class="mt-4 w-full py-3 bg-blue-500 text-white rounded-xl font-medium"
            >
              Simuler un scan (démo)
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition name="slide-up">
      <div
        v-if="showSuccessToast"
        class="fixed bottom-24 left-4 right-4 bg-green-500 text-white rounded-xl p-4 shadow-lg flex items-center space-x-3"
      >
        <CheckCircle class="w-6 h-6" />
        <div>
          <p class="font-medium">Colis scanné avec succès</p>
          <p class="text-sm text-green-100">{{ lastScannedCode }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ScanLine,
  Plus,
  Package,
  CheckCircle,
  X,
  Flashlight
} from 'lucide-vue-next'

const manualCode = ref('')
const selectedSeller = ref('all')
const showScanner = ref(false)
const showSuccessToast = ref(false)
const lastScannedCode = ref('')

const sellers = ref([
  { id: 'seller1', name: 'Boutique Électronique Plus', count: 8 },
  { id: 'seller2', name: 'Fashion Store', count: 5 },
  { id: 'seller3', name: 'Cosmétique Beauty', count: 3 }
])

const scannedPackages = ref<any[]>([])

const pendingPickups = ref([
  { id: 1, tracking: 'YAL-2026-001234', seller: 'Boutique Électronique Plus', sellerId: 'seller1', destination: 'Tunis Centre' },
  { id: 2, tracking: 'YAL-2026-001235', seller: 'Boutique Électronique Plus', sellerId: 'seller1', destination: 'Ariana' },
  { id: 3, tracking: 'YAL-2026-001236', seller: 'Boutique Électronique Plus', sellerId: 'seller1', destination: 'La Marsa' },
  { id: 4, tracking: 'ZR-2026-005678', seller: 'Fashion Store', sellerId: 'seller2', destination: 'Sfax' },
  { id: 5, tracking: 'ZR-2026-005679', seller: 'Fashion Store', sellerId: 'seller2', destination: 'Sousse' },
  { id: 6, tracking: 'MAY-2026-009012', seller: 'Cosmétique Beauty', sellerId: 'seller3', destination: 'Nabeul' }
])

const filteredPendingPickups = computed(() => {
  if (selectedSeller.value === 'all') return pendingPickups.value
  return pendingPickups.value.filter(p => p.sellerId === selectedSeller.value)
})

const openScanner = () => {
  showScanner.value = true
}

const closeScanner = () => {
  showScanner.value = false
}

const simulateScan = () => {
  const randomPkg = pendingPickups.value[Math.floor(Math.random() * pendingPickups.value.length)]
  if (randomPkg && !scannedPackages.value.find(p => p.id === randomPkg.id)) {
    addToScanned(randomPkg)
  }
  closeScanner()
}

const addToScanned = (pkg: any) => {
  scannedPackages.value.push(pkg)
  pendingPickups.value = pendingPickups.value.filter(p => p.id !== pkg.id)

  lastScannedCode.value = pkg.tracking
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 2000)
}

const quickScan = (pkg: any) => {
  addToScanned(pkg)
}

const removeScanned = (id: number) => {
  const pkg = scannedPackages.value.find(p => p.id === id)
  if (pkg) {
    pendingPickups.value.push(pkg)
    scannedPackages.value = scannedPackages.value.filter(p => p.id !== id)
  }
}

const addByCode = () => {
  if (!manualCode.value.trim()) return

  const pkg = pendingPickups.value.find(p =>
    p.tracking.toLowerCase() === manualCode.value.trim().toLowerCase()
  )

  if (pkg) {
    addToScanned(pkg)
    manualCode.value = ''
  }
}

const confirmPickup = () => {
  // In real app, this would send to API
  alert(`${scannedPackages.value.length} colis confirmés pour le pick up!`)
  scannedPackages.value = []
}
</script>

<style scoped>
@keyframes scan {
  0%, 100% {
    top: 10%;
  }
  50% {
    top: 90%;
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
