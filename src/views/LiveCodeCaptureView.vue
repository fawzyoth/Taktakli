<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div v-if="!hasSession" class="flex items-center justify-center min-h-[70vh]">
        <div class="text-center max-w-md">
          <div class="flex justify-center mb-6">
            <div class="bg-gray-100 dark:bg-gray-800 p-8 rounded-full">
              <CodeIcon class="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Start Code Capture</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Begin organizing and tracking numbers by product codes</p>
          <button
            @click="startNewSession"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 mx-auto"
          >
            <PlayIcon class="w-5 h-5" />
            Start New Session
          </button>
        </div>
      </div>

      <div v-else>
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Code Capture Session</h1>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Recording
              </span>
            </div>
            <button
              @click="showSessionSummary"
              class="hidden sm:flex px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition items-center gap-2"
            >
              <StopCircleIcon class="w-4 h-4" />
              End Session
            </button>
          </div>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Started {{ formatTime(sessionStartTime) }} • {{ formatDuration(captureTimer) }}</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Codes</span>
              <CodeIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ codes.length }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Numbers</span>
              <PhoneIcon class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ totalNumbers }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Current Code</span>
              <TargetIcon class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ activeCode?.numbers.length || 0 }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Duration</span>
              <ClockIcon class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ formatDuration(captureTimer) }}</p>
          </div>
        </div>

        <button
          @click="showSessionSummary"
          class="sm:hidden w-full mb-6 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <StopCircleIcon class="w-5 h-5" />
          End Session
        </button>

        <div v-if="!activeCode" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-12 sm:p-16 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <PlusIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Your First Code</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Start capturing numbers by creating a product code</p>
          <button
            @click="openCreateCodeModal"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition inline-flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Create Code
          </button>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-start gap-4 flex-1">
                  <div v-if="activeCode.photo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <img :src="activeCode.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PackageIcon class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">{{ activeCode.name }}</h3>
                      <span class="inline-flex items-center px-2.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full flex-shrink-0">
                        Active
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ activeCode.numbers.length }} numbers captured • Created {{ formatTime(activeCode.createdAt) }}</p>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    @click="simulateCaptureNumber"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <ZapIcon class="w-4 h-4" />
                    <span>Test Capture</span>
                  </button>
                  <button
                    @click="stopCurrentCode"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon class="w-4 h-4" />
                    <span>Finish & New Code</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Captured Numbers</h4>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ activeCode.numbers.length }} total</span>
              </div>

              <div v-if="activeCode.numbers.length === 0" class="text-center py-12">
                <div class="flex justify-center mb-4">
                  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <PhoneIcon class="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-2">Waiting for Numbers...</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Numbers will appear here as they are captured</p>
                <button
                  @click="simulateCaptureNumber"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Simulate Capture
                </button>
              </div>

              <div v-else class="space-y-3 max-h-[500px] overflow-y-auto">
                <TransitionGroup name="number-slide">
                  <div
                    v-for="(number, index) in activeCode.numbers.slice().reverse()"
                    :key="number.id"
                    class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {{ activeCode.numbers.length - index }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-mono font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">{{ number.phoneNumber }}</p>
                          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate">
                            <UserIcon class="w-3 h-3 flex-shrink-0" />
                            @{{ number.username }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <span v-if="index === 0" class="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                          New
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">{{ formatTime(number.capturedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </div>

          <div v-if="codes.length > 1" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Completed Codes</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ codes.filter(c => !c.isActive).length }} code{{ codes.filter(c => !c.isActive).length !== 1 ? 's' : '' }} completed in this session</p>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <div
                v-for="code in codes.filter(c => !c.isActive)"
                :key="code.id"
                class="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div v-if="code.photo" class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <img :src="code.photo" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PackageIcon class="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">{{ code.name }}</h4>
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full flex-shrink-0">
                          <CheckCircleIcon class="w-3 h-3" />
                          Complete
                        </span>
                      </div>
                      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ code.numbers.length }} numbers • {{ formatTime(code.createdAt) }}</p>
                    </div>
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
import { Code as CodeIcon, Play as PlayIcon, StopCircle as StopCircleIcon, Plus as PlusIcon, Target as TargetIcon, Package as PackageIcon, CheckCircle as CheckCircleIcon, Zap as ZapIcon, Phone as PhoneIcon, User as UserIcon, Clock as ClockIcon } from 'lucide-vue-next'
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
    router.push('/live-code-capture')
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
  transform: translateY(-10px);
}

.number-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.number-slide-move {
  transition: transform 0.4s ease;
}
</style>
