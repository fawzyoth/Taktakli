<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div v-if="!hasSession" class="flex items-center justify-center min-h-[80vh]">
          <div class="text-center bg-white dark:bg-gray-900 rounded-2xl p-12 border-2 border-gray-200 dark:border-gray-800 shadow-xl max-w-md">
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <CodeIcon class="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Active Session</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Start a new code-based capture session</p>
            <button
              @click="startNewSession"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <PlayIcon class="w-5 h-5" />
              Start Session
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div class="absolute inset-0 bg-red-500 rounded-xl animate-pulse opacity-50"></div>
                    <VideoIcon class="w-8 h-8 text-white relative z-10" />
                  </div>
                  <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h1 class="text-2xl font-bold text-white">Live Capture Active</h1>
                    <span class="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse flex items-center gap-1">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                      RECORDING
                    </span>
                  </div>
                  <p class="text-blue-100">Session started {{ formatTime(sessionStartTime) }}</p>
                </div>
              </div>

              <button
                @click="showSessionSummary"
                class="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                <ClipboardCheckIcon class="w-5 h-5" />
                End Session
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p class="text-3xl font-bold text-white">{{ codes.length }}</p>
                <p class="text-blue-100 text-sm">Total Codes</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p class="text-3xl font-bold text-white">{{ totalNumbers }}</p>
                <p class="text-blue-100 text-sm">Total Numbers</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p class="text-3xl font-bold text-white">{{ activeCode?.numbers.length || 0 }}</p>
                <p class="text-blue-100 text-sm">Current Code</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p class="text-3xl font-bold text-white">{{ formatDuration(captureTimer) }}</p>
                <p class="text-blue-100 text-sm">Duration</p>
              </div>
            </div>
          </div>

          <div v-if="!activeCode" class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                <PlusIcon class="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Create Your First Code</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Start capturing numbers by creating a product code</p>
            <button
              @click="openCreateCodeModal"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition shadow-lg inline-flex items-center gap-2"
            >
              <PlusIcon class="w-5 h-5" />
              Create First Code
            </button>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl text-white sticky top-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold flex items-center gap-2">
                    <TargetIcon class="w-6 h-6" />
                    Active Code
                  </h3>
                  <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                    CAPTURING
                  </span>
                </div>

                <div v-if="activeCode.photo" class="w-full h-48 rounded-xl overflow-hidden border-2 border-white/30 mb-4">
                  <img :src="activeCode.photo" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-full h-48 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border-2 border-white/20">
                  <PackageIcon class="w-16 h-16 text-white/50" />
                </div>

                <h4 class="text-2xl font-bold mb-2">{{ activeCode.name }}</h4>
                <div class="flex items-center justify-between py-3 px-4 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
                  <span class="text-sm font-medium">Numbers Captured</span>
                  <span class="text-2xl font-bold">{{ activeCode.numbers.length }}</span>
                </div>

                <div class="space-y-3">
                  <button
                    @click="stopCurrentCode"
                    class="w-full px-6 py-4 bg-white hover:bg-gray-100 text-orange-600 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <StopCircleIcon class="w-5 h-5" />
                    Stop & Create New Code
                  </button>

                  <button
                    @click="simulateCaptureNumber"
                    class="w-full px-6 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 border-2 border-white/30"
                  >
                    <ZapIcon class="w-5 h-5" />
                    Simulate Capture
                  </button>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2">
              <div class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                      <PhoneIcon class="w-6 h-6" />
                      Captured Numbers
                    </h3>
                    <p class="text-blue-100 text-sm">Real-time number assignment</p>
                  </div>
                  <div class="text-right">
                    <p class="text-3xl font-bold text-white">{{ activeCode.numbers.length }}</p>
                    <p class="text-blue-100 text-xs">Total</p>
                  </div>
                </div>

                <div class="p-6">
                  <div v-if="activeCode.numbers.length === 0" class="text-center py-16">
                    <div class="flex justify-center mb-4">
                      <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full animate-pulse">
                        <PhoneIcon class="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Waiting for Numbers...</h4>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Numbers will appear here as they are captured</p>
                  </div>

                  <div v-else class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    <TransitionGroup name="number-slide">
                      <div
                        v-for="(number, index) in activeCode.numbers.slice().reverse()"
                        :key="number.id"
                        class="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                        :style="{ animationDelay: `${index * 50}ms` }"
                      >
                        <div class="flex items-center gap-4 flex-1">
                          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {{ activeCode.numbers.length - index }}
                          </div>
                          <div class="flex-1">
                            <p class="font-mono font-bold text-xl text-gray-900 dark:text-white">{{ number.phoneNumber }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <UserIcon class="w-3 h-3" />
                              @{{ number.username }}
                            </p>
                          </div>
                          <div class="text-right">
                            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <ClockIcon class="w-3 h-3" />
                              {{ formatTime(number.capturedAt) }}
                            </div>
                            <span v-if="index === 0" class="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                              NEW
                            </span>
                          </div>
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="codes.length > 0 && activeCode" class="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HistoryIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Previous Codes in This Session
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="code in codes.filter(c => !c.isActive)"
                :key="code.id"
                class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div v-if="code.photo" class="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img :src="code.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                    <PackageIcon class="w-6 h-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900 dark:text-white">{{ code.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ code.numbers.length }} numbers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CodeBasedCaptureModal
      v-if="showCreateModal"
      :is-open="showCreateModal"
      :step="'create'"
      :active-code="null"
      @close="showCreateModal = false"
      @create-code="handleCreateCode"
      @capture-number="() => {}"
      @finish-code="() => {}"
      @finish-session="() => {}"
    />

    <CaptureSummaryModal
      v-if="showSummary"
      :is-open="showSummary"
      :session="currentSession"
      @close="handleCloseSummary"
      @toggle-purchase="togglePurchase"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import CodeBasedCaptureModal from '@/components/CodeBasedCaptureModal.vue'
import CaptureSummaryModal from '@/components/CaptureSummaryModal.vue'
import { Code as CodeIcon, Play as PlayIcon, Video as VideoIcon, ClipboardCheck as ClipboardCheckIcon, Plus as PlusIcon, Target as TargetIcon, Package as PackageIcon, StopCircle as StopCircleIcon, Zap as ZapIcon, Phone as PhoneIcon, User as UserIcon, Clock as ClockIcon, History as HistoryIcon } from 'lucide-vue-next'
import { codeCaptureService } from '@/lib/codeCapture'
import type { CaptureSession, CapturedCode } from '@/lib/codeCapture'

const router = useRouter()
const hasSession = ref(false)
const currentSession = ref<CaptureSession | null>(null)
const codes = ref<CapturedCode[]>([])
const showCreateModal = ref(false)
const showSummary = ref(false)
const sessionStartTime = ref<string>('')
const captureTimer = ref(0)
let timerInterval: number | null = null

const activeCode = computed(() => {
  return codes.value.find(c => c.isActive) || null
})

const totalNumbers = computed(() => {
  return codes.value.reduce((sum, code) => sum + code.numbers.length, 0)
})

function startNewSession() {
  currentSession.value = codeCaptureService.createSession('code-based')
  hasSession.value = true
  sessionStartTime.value = new Date().toISOString()
  codes.value = []
  captureTimer.value = 0
  startTimer()
  openCreateCodeModal()
}

function openCreateCodeModal() {
  showCreateModal.value = true
}

function handleCreateCode(name: string, photo?: string) {
  const newCode = codeCaptureService.createCode(name, photo)
  currentSession.value = codeCaptureService.getSession()

  if (currentSession.value) {
    codes.value = [...currentSession.value.codes]
  }

  showCreateModal.value = false
}

function stopCurrentCode() {
  if (!activeCode.value) return

  activeCode.value.isActive = false
  openCreateCodeModal()
}

function simulateCaptureNumber() {
  if (!activeCode.value) return

  const mockUsernames = ['ahmed_tech', 'sarah_shop', 'ali_store', 'fatma_buy', 'mohamed_sales', 'yasmine_market', 'karim_shop', 'marwa_tech', 'walid_store', 'amina_deals']
  const mockPhones = [
    '+216 98 765 432',
    '+216 22 345 678',
    '+216 55 123 456',
    '+216 20 987 654',
    '+216 54 321 987',
    '+216 28 456 789',
    '+216 99 111 222',
    '+216 26 333 444',
    '+216 51 555 666',
    '+216 95 777 888'
  ]

  const randomUsername = mockUsernames[Math.floor(Math.random() * mockUsernames.length)]
  const randomPhone = mockPhones[Math.floor(Math.random() * mockPhones.length)]

  codeCaptureService.captureNumber(randomPhone, randomUsername)
  currentSession.value = codeCaptureService.getSession()

  if (currentSession.value) {
    codes.value = [...currentSession.value.codes]
  }
}

function showSessionSummary() {
  if (activeCode.value) {
    activeCode.value.isActive = false
  }
  showSummary.value = true
}

function handleCloseSummary() {
  showSummary.value = false
  stopTimer()

  setTimeout(() => {
    hasSession.value = false
    currentSession.value = null
    codes.value = []
    captureTimer.value = 0
    router.push('/code-capture')
  }, 300)
}

function togglePurchase(codeId: string) {
  codeCaptureService.togglePurchaseDecision(codeId)
  currentSession.value = codeCaptureService.getSession()
  if (currentSession.value) {
    codes.value = [...currentSession.value.codes]
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  return `${hours}h ago`
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

function startTimer() {
  timerInterval = window.setInterval(() => {
    captureTimer.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onMounted(() => {
  const session = codeCaptureService.getSession()
  if (session) {
    currentSession.value = session
    hasSession.value = true
    sessionStartTime.value = session.startedAt
    codes.value = [...session.codes]

    const startTime = new Date(session.startedAt).getTime()
    const now = new Date().getTime()
    captureTimer.value = Math.floor((now - startTime) / 1000)

    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.number-slide-enter-active {
  transition: all 0.4s ease-out;
}

.number-slide-leave-active {
  transition: all 0.3s ease-in;
}

.number-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.number-slide-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.number-slide-move {
  transition: transform 0.4s ease;
}
</style>
