<template>
  <div class="return-scan">
    <!-- Header Section -->
    <div class="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold">Pointage Retour</h2>
        <p class="text-orange-100 text-sm">Enregistrez les colis retournés</p>
      </div>

      <!-- Scanner Button -->
      <div class="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
        <button
          @click="openScanner"
          class="w-full bg-white text-orange-600 rounded-xl py-4 px-6 font-semibold flex items-center justify-center space-x-3 shadow-lg"
        >
          <ScanLine class="w-6 h-6" />
          <span>Scanner un colis retour</span>
        </button>

        <!-- Manual Entry -->
        <div class="mt-4">
          <div class="flex space-x-2">
            <input
              v-model="manualCode"
              type="text"
              placeholder="Entrer le code manuellement..."
              class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              @click="findPackage"
              class="px-4 py-3 bg-white text-orange-600 rounded-xl font-medium"
            >
              <Search class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-around mt-6">
        <div class="text-center">
          <p class="text-3xl font-bold">{{ processedReturns.length }}</p>
          <p class="text-orange-100 text-sm">Traités</p>
        </div>
        <div class="w-px h-10 bg-white/30"></div>
        <div class="text-center">
          <p class="text-3xl font-bold">{{ pendingReturns.length }}</p>
          <p class="text-orange-100 text-sm">En attente</p>
        </div>
      </div>
    </div>

    <!-- Pending Returns List -->
    <div class="p-4">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
        Retours en attente ({{ pendingReturns.length }})
      </h3>
      <div class="space-y-3">
        <div
          v-for="pkg in pendingReturns"
          :key="pkg.id"
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                pkg.attempts >= 3 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
              ]">
                <RotateCcw :class="[
                  'w-5 h-5',
                  pkg.attempts >= 3 ? 'text-red-600' : 'text-orange-600'
                ]" />
              </div>
              <div>
                <p class="text-sm font-mono font-medium text-gray-900 dark:text-white">{{ pkg.tracking }}</p>
                <p class="text-xs text-gray-500">{{ pkg.client }}</p>
                <p class="text-xs text-gray-400">{{ pkg.address }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                    {{ pkg.attempts }} tentative(s)
                  </span>
                  <span v-if="pkg.attempts >= 3" class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    Urgent
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="selectForReturn(pkg)"
              class="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium"
            >
              Traiter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Processed Returns -->
    <div v-if="processedReturns.length > 0" class="p-4 pt-0">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
        Retours traités aujourd'hui
      </h3>
      <div class="space-y-2">
        <div
          v-for="pkg in processedReturns"
          :key="pkg.id"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <CheckCircle class="w-5 h-5 text-green-600" />
              <div>
                <p class="text-sm font-mono font-medium text-gray-900 dark:text-white">{{ pkg.tracking }}</p>
                <p class="text-xs text-gray-500">{{ pkg.reason }}</p>
              </div>
            </div>
            <span class="text-xs text-gray-400">{{ pkg.processedAt }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Form Modal -->
    <Transition name="slide-up">
      <div v-if="selectedPackage" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/50" @click="closeReturnForm"></div>
        <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[85vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Enregistrer le retour</h3>
              <p class="text-sm text-gray-500 font-mono">{{ selectedPackage.tracking }}</p>
            </div>
            <button @click="closeReturnForm" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-4 overflow-y-auto max-h-[60vh]">
            <!-- Package Info -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <Package class="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ selectedPackage.client }}</p>
                  <p class="text-sm text-gray-500">{{ selectedPackage.address }}</p>
                  <p class="text-sm text-orange-600 font-semibold">{{ selectedPackage.cod }} TND COD</p>
                </div>
              </div>
            </div>

            <!-- Return Reason -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Motif du retour *
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="reason in returnReasons"
                  :key="reason.id"
                  @click="returnForm.reason = reason.id"
                  :class="[
                    'p-3 rounded-xl border-2 text-left transition-colors',
                    returnForm.reason === reason.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  ]"
                >
                  <component :is="reason.icon" :class="[
                    'w-5 h-5 mb-1',
                    returnForm.reason === reason.id ? 'text-orange-600' : 'text-gray-400'
                  ]" />
                  <p class="text-sm font-medium" :class="returnForm.reason === reason.id ? 'text-orange-600' : 'text-gray-700 dark:text-gray-300'">
                    {{ reason.label }}
                  </p>
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes additionnelles
              </label>
              <textarea
                v-model="returnForm.notes"
                rows="2"
                placeholder="Ajouter des détails..."
                class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <!-- Photo Proof -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photo preuve (optionnel)
              </label>
              <div v-if="!returnForm.photo" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <button @click="takePhoto" class="w-full flex flex-col items-center text-gray-500">
                  <Camera class="w-8 h-8 mb-2" />
                  <span class="text-sm">Prendre une photo</span>
                </button>
              </div>
              <div v-else class="relative">
                <img :src="returnForm.photo" alt="Photo preuve" class="w-full h-40 object-cover rounded-xl" />
                <button @click="returnForm.photo = ''" class="absolute top-2 right-2 p-2 bg-black/50 rounded-full">
                  <X class="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <!-- Signature -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Signature client (si présent)
              </label>
              <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                <div class="h-24 flex items-center justify-center text-gray-400 text-sm">
                  <Pencil class="w-5 h-5 mr-2" />
                  Zone de signature
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-800 flex space-x-3">
            <button
              @click="closeReturnForm"
              class="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
            >
              Annuler
            </button>
            <button
              @click="confirmReturn"
              :disabled="!returnForm.reason"
              :class="[
                'flex-1 px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2',
                returnForm.reason
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              <CheckCircle class="w-5 h-5" />
              <span>Confirmer retour</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Scanner Modal -->
    <Transition name="fade">
      <div v-if="showScanner" class="fixed inset-0 z-50 bg-black">
        <div class="relative h-full flex flex-col">
          <div class="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
            <button @click="closeScanner" class="p-2 bg-white/20 backdrop-blur rounded-full">
              <X class="w-6 h-6 text-white" />
            </button>
            <span class="text-white font-medium">Scanner le colis retour</span>
            <div class="w-10"></div>
          </div>
          <div class="flex-1 flex items-center justify-center">
            <div class="relative w-64 h-64">
              <div class="absolute inset-0 border-2 border-white/50 rounded-2xl"></div>
              <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl"></div>
              <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl"></div>
              <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl"></div>
              <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl"></div>
              <div class="absolute left-2 right-2 h-0.5 bg-orange-500 animate-scan"></div>
            </div>
          </div>
          <div class="p-6">
            <button @click="simulateScan" class="w-full py-3 bg-orange-500 text-white rounded-xl font-medium">
              Simuler un scan (démo)
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, markRaw } from 'vue'
import {
  ScanLine,
  Search,
  RotateCcw,
  CheckCircle,
  X,
  Package,
  Camera,
  Pencil,
  UserX,
  MapPinOff,
  PackageX,
  Phone,
  Ban
} from 'lucide-vue-next'

const manualCode = ref('')
const showScanner = ref(false)
const selectedPackage = ref<any>(null)

const returnForm = reactive({
  reason: '',
  notes: '',
  photo: ''
})

const returnReasons = [
  { id: 'absent', label: 'Client absent', icon: markRaw(UserX) },
  { id: 'refused', label: 'Refusé', icon: markRaw(Ban) },
  { id: 'wrong_address', label: 'Mauvaise adresse', icon: markRaw(MapPinOff) },
  { id: 'no_answer', label: 'Injoignable', icon: markRaw(Phone) },
  { id: 'damaged', label: 'Colis endommagé', icon: markRaw(PackageX) },
  { id: 'other', label: 'Autre', icon: markRaw(Package) }
]

const pendingReturns = ref([
  { id: 1, tracking: 'YAL-2026-001111', client: 'Hichem Mansour', address: 'La Marsa, Tunis', attempts: 3, cod: 189 },
  { id: 2, tracking: 'ZR-2026-002222', client: 'Salma Trabelsi', address: 'Ariana, Tunis', attempts: 2, cod: 245 },
  { id: 3, tracking: 'MAY-2026-003333', client: 'Karim Bouaziz', address: 'Sfax Centre', attempts: 1, cod: 120 },
  { id: 4, tracking: 'ECO-2026-004444', client: 'Leila Mrad', address: 'Sousse Nord', attempts: 2, cod: 89 }
])

const processedReturns = ref<any[]>([])

const openScanner = () => {
  showScanner.value = true
}

const closeScanner = () => {
  showScanner.value = false
}

const simulateScan = () => {
  const randomPkg = pendingReturns.value[0]
  if (randomPkg) {
    selectForReturn(randomPkg)
  }
  closeScanner()
}

const findPackage = () => {
  const pkg = pendingReturns.value.find(p =>
    p.tracking.toLowerCase() === manualCode.value.trim().toLowerCase()
  )
  if (pkg) {
    selectForReturn(pkg)
    manualCode.value = ''
  }
}

const selectForReturn = (pkg: any) => {
  selectedPackage.value = pkg
  returnForm.reason = ''
  returnForm.notes = ''
  returnForm.photo = ''
}

const closeReturnForm = () => {
  selectedPackage.value = null
}

const takePhoto = () => {
  // Simulate photo capture
  returnForm.photo = 'https://via.placeholder.com/300x200?text=Photo+Preuve'
}

const confirmReturn = () => {
  if (!returnForm.reason || !selectedPackage.value) return

  const reasonLabel = returnReasons.find(r => r.id === returnForm.reason)?.label || returnForm.reason

  processedReturns.value.unshift({
    ...selectedPackage.value,
    reason: reasonLabel,
    processedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  })

  pendingReturns.value = pendingReturns.value.filter(p => p.id !== selectedPackage.value.id)
  closeReturnForm()
}
</script>

<style scoped>
@keyframes scan {
  0%, 100% { top: 10%; }
  50% { top: 90%; }
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

.slide-up-enter-from > div:last-child,
.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
