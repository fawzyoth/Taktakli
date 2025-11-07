<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div class="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        <div v-if="!hasSession" class="flex items-center justify-center min-h-[80vh] px-4">
          <div class="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-12 border-2 border-gray-200 dark:border-gray-800 shadow-xl max-w-md w-full">
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CodeIcon class="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Start Capturing</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">Begin a new code-based capture session to organize and track numbers by product</p>
            <button
              @click="startNewSession"
              class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <PlayIcon class="w-5 h-5" />
              Start New Session
            </button>
          </div>
        </div>

        <div v-else class="space-y-4 sm:space-y-6">
          <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="relative flex-shrink-0">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div class="absolute inset-0 bg-red-500 rounded-xl animate-pulse opacity-50"></div>
                    <VideoIcon class="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" />
                  </div>
                  <div class="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h1 class="text-xl sm:text-2xl font-bold text-white">Live Capture</h1>
                    <span class="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse flex items-center gap-1">
                      <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      REC
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-blue-100">Started {{ formatTime(sessionStartTime) }}</p>
                </div>
              </div>

              <button
                @click="showSessionSummary"
                class="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg sm:rounded-xl transition flex items-center justify-center gap-2"
              >
                <ClipboardCheckIcon class="w-5 h-5" />
                End Session
              </button>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <p class="text-2xl sm:text-3xl font-bold text-white">{{ codes.length }}</p>
                <p class="text-blue-100 text-xs sm:text-sm">Codes</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <p class="text-2xl sm:text-3xl font-bold text-white">{{ totalNumbers }}</p>
                <p class="text-blue-100 text-xs sm:text-sm">Numbers</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <p class="text-2xl sm:text-3xl font-bold text-white">{{ activeCode?.numbers.length || 0 }}</p>
                <p class="text-blue-100 text-xs sm:text-sm">Current</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <p class="text-2xl sm:text-3xl font-bold text-white">{{ formatDuration(captureTimer) }}</p>
                <p class="text-blue-100 text-xs sm:text-sm">Time</p>
              </div>
            </div>
          </div>

          <div v-if="!activeCode" class="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 p-8 sm:p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <PlusIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Create Your First Code</h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Give your product a name and start capturing numbers</p>
            <button
              @click="openCreateCodeModal"
              class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg sm:rounded-xl transition shadow-lg inline-flex items-center justify-center gap-2"
            >
              <PlusIcon class="w-5 h-5" />
              Create Code
            </button>
          </div>

          <div v-else class="space-y-4 sm:space-y-6">
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl text-white">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div class="flex items-center gap-3 w-full sm:w-auto">
                  <div class="flex-shrink-0">
                    <TargetIcon class="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg sm:text-xl font-bold">Active Product</h3>
                    <p class="text-orange-100 text-xs sm:text-sm">Capturing numbers now</p>
                  </div>
                </div>
                <span class="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  ACTIVE
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
                <div v-if="activeCode.photo" class="sm:col-span-2 lg:col-span-1 w-full h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/30">
                  <img :src="activeCode.photo" class="w-full h-full object-cover" />
                </div>
                <div v-else class="sm:col-span-2 lg:col-span-1 w-full h-40 sm:h-48 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-white/20">
                  <PackageIcon class="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
                </div>

                <div class="sm:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
                  <div>
                    <h4 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{{ activeCode.name }}</h4>
                    <p class="text-orange-100 text-sm">Created {{ formatTime(activeCode.createdAt) }}</p>
                  </div>
                  <div class="flex items-center justify-between py-3 sm:py-4 px-4 sm:px-5 bg-white/10 backdrop-blur-sm rounded-lg">
                    <span class="text-sm sm:text-base font-medium">Numbers Captured</span>
                    <span class="text-3xl sm:text-4xl font-bold">{{ activeCode.numbers.length }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  @click="stopCurrentCode"
                  class="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white hover:bg-gray-100 text-orange-600 font-bold rounded-lg sm:rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircleIcon class="w-5 h-5" />
                  <span class="text-sm sm:text-base">Finish & New Code</span>
                </button>

                <button
                  @click="simulateCaptureNumber"
                  class="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-lg sm:rounded-xl transition flex items-center justify-center gap-2 border-2 border-white/30"
                >
                  <ZapIcon class="w-5 h-5" />
                  <span class="text-sm sm:text-base">Test Capture</span>
                </button>
              </div>
            </div>

            <div>
              <div class="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <PhoneIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                        Captured Numbers
                      </h3>
                      <p class="text-blue-100 text-xs sm:text-sm">Live feed of incoming numbers</p>
                    </div>
                    <div class="text-left sm:text-right">
                      <p class="text-2xl sm:text-3xl font-bold text-white">{{ activeCode.numbers.length }}</p>
                      <p class="text-blue-100 text-xs">Total</p>
                    </div>
                  </div>
                </div>

                <div class="p-4 sm:p-6">
                  <div v-if="activeCode.numbers.length === 0" class="text-center py-12 sm:py-16">
                    <div class="flex justify-center mb-4">
                      <div class="bg-gray-100 dark:bg-gray-800 p-5 sm:p-6 rounded-full animate-pulse">
                        <PhoneIcon class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    </div>
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Waiting for Numbers...</h4>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">Numbers will appear here automatically</p>
                    <button
                      @click="simulateCaptureNumber"
                      class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                    >
                      Simulate Capture
                    </button>
                  </div>

                  <div v-else class="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                    <TransitionGroup name="number-slide">
                      <div
                        v-for="(number, index) in activeCode.numbers.slice().reverse()"
                        :key="number.id"
                        class="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                        :style="{ animationDelay: `${index * 50}ms` }"
                      >
                        <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                            {{ activeCode.numbers.length - index }}
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="font-mono font-bold text-base sm:text-xl text-gray-900 dark:text-white truncate">{{ number.phoneNumber }}</p>
                            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate">
                              <UserIcon class="w-3 h-3 flex-shrink-0" />
                              @{{ number.username }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right flex-shrink-0 ml-2">
                          <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <ClockIcon class="w-3 h-3" />
                            <span class="hidden sm:inline">{{ formatTime(number.capturedAt) }}</span>
                          </div>
                          <span v-if="index === 0" class="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                            NEW
                          </span>
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="codes.length > 1 && activeCode" class="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HistoryIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              Completed Codes ({{ codes.filter(c => !c.isActive).length }})
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div
                v-for="code in codes.filter(c => !c.isActive)"
                :key="code.id"
                class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div v-if="code.photo" class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
                    <img :src="code.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PackageIcon class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">{{ code.name }}</h4>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ code.numbers.length }} numbers</p>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <CheckCircleIcon class="w-3 h-3 text-green-500" />
                    Complete
                  </span>
                  <span>{{ formatTime(code.createdAt) }}</span>
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
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.number-slide-leave-active {
  transition: all 0.3s ease-in;
}

.number-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.number-slide-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.number-slide-move {
  transition: transform 0.5s ease;
}
</style>
