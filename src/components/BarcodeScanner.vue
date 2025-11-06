<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
        <ScanIcon class="w-5 h-5" />
        <span>Scanner</span>
      </h3>
      <button
        @click="toggleScanner"
        :class="[
          'px-4 py-2 font-semibold rounded-lg transition flex items-center space-x-2',
          isActive
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        ]"
      >
        <component :is="isActive ? PauseIcon : PlayIcon" class="w-4 h-4" />
        <span>{{ isActive ? 'Pause' : 'Activer' }}</span>
      </button>
    </div>

    <div v-if="isActive" class="relative">
      <div class="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="w-full h-full object-cover"
        ></video>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="relative w-64 h-48">
            <div class="absolute inset-0 border-4 border-white/30 rounded-lg"></div>
            <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>

            <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan"></div>
          </div>
        </div>

        <div v-if="lastScan" class="absolute top-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <p class="text-sm font-semibold">✓ Scanné: {{ lastScan }}</p>
        </div>
      </div>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Pointez la caméra vers le code-barres ou QR code
        </p>
      </div>
    </div>

    <div v-else class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
      <div class="text-center">
        <CameraIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Scanner désactivé</p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Cliquez sur "Activer" pour commencer</p>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 class="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center space-x-2">
        <KeyboardIcon class="w-4 h-4" />
        <span>Saisie Manuelle</span>
      </h4>
      <div class="flex space-x-2">
        <input
          v-model="manualCode"
          type="text"
          placeholder="Entrez le code manuellement"
          @keyup.enter="submitManualCode"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          @click="submitManualCode"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Valider
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Scan as ScanIcon, Play as PlayIcon, Pause as PauseIcon, Camera as CameraIcon, Keyboard as KeyboardIcon } from 'lucide-vue-next'

const props = defineProps<{
  isActive: boolean
}>()

const emit = defineEmits<{
  scanned: [code: string]
  toggle: []
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const manualCode = ref('')
const lastScan = ref('')
const scanningInterval = ref<number | null>(null)

function toggleScanner() {
  emit('toggle')
}

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })

    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
    }

    startScanning()
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.')
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }

  if (scanningInterval.value) {
    clearInterval(scanningInterval.value)
    scanningInterval.value = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
}

function startScanning() {
  scanningInterval.value = window.setInterval(() => {
    if (Math.random() > 0.95) {
      const testCode = '8806094935912'
      handleScan(testCode)
    }
  }, 500)
}

function handleScan(code: string) {
  lastScan.value = code
  emit('scanned', code)

  setTimeout(() => {
    lastScan.value = ''
  }, 2000)
}

function submitManualCode() {
  if (manualCode.value.trim()) {
    handleScan(manualCode.value.trim())
    manualCode.value = ''
  }
}

watch(() => props.isActive, (newValue) => {
  if (newValue) {
    startCamera()
  } else {
    stopCamera()
  }
})

onMounted(() => {
  if (props.isActive) {
    startCamera()
  }
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
@keyframes scan {
  0%, 100% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(100%);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
