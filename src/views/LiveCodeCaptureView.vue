<template>
  <AppLayout>
    <div class="p-4 md:p-6">
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

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Codes</span>
              <CodeIcon class="w-4 h-4 text-blue-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ codes.length }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Numbers</span>
              <PhoneIcon class="w-4 h-4 text-green-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalNumbers }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Current</span>
              <TargetIcon class="w-4 h-4 text-orange-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeCode?.numbers.length || 0 }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Time</span>
              <ClockIcon class="w-4 h-4 text-purple-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatDuration(captureTimer) }}</p>
          </div>
        </div>

        <button
          @click="showSessionSummary"
          class="md:hidden w-full mb-6 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <StopCircleIcon class="w-5 h-5" />
          End Session
        </button>

        <div v-if="!activeCode" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <PlusIcon class="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Your First Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Start capturing numbers by creating a product code</p>
          <button
            @click="openCreateCodeModal"
            class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition inline-flex items-center justify-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Create Code
          </button>
        </div>

        <div v-else class="space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="p-4 border-b border-gray-200 dark:border-gray-800">
              <div class="flex items-start gap-3 mb-3">
                <div v-if="activeCode.photo" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <img :src="activeCode.photo" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PackageIcon class="w-8 h-8 text-gray-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ activeCode.name }}</h3>
                    <span class="inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded flex-shrink-0">
                      Active
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ activeCode.numbers.length }} numbers • {{ formatTime(activeCode.createdAt) }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="simulateCaptureNumber"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ZapIcon class="w-4 h-4" />
                  <span class="hidden md:inline">Test</span>
                </button>
                <button
                  @click="stopCurrentCode"
                  class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  <span>Finish</span>
                </button>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-base font-bold text-gray-900 dark:text-white">Captured Numbers</h4>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ activeCode.numbers.length }}</span>
              </div>

              <div v-if="activeCode.numbers.length === 0" class="text-center py-8">
                <div class="flex justify-center mb-3">
                  <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <PhoneIcon class="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Waiting for Numbers...</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-4">Numbers will appear here as captured</p>
                <button
                  @click="simulateCaptureNumber"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
                >
                  Test Capture
                </button>
              </div>

              <div v-else class="space-y-2 max-h-[400px] overflow-y-auto">
                <TransitionGroup name="number-slide">
                  <div
                    v-for="(number, index) in activeCode.numbers.slice().reverse()"
                    :key="number.id"
                    class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {{ activeCode.numbers.length - index }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-mono font-bold text-sm text-gray-900 dark:text-white truncate">{{ number.phoneNumber }}</p>
                          <p class="text-xs text-gray-600 dark:text-gray-400 truncate">@{{ number.username }}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <span v-if="index === 0" class="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded">
                          New
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 hidden md:inline">{{ formatTime(number.capturedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </div>

          <div v-if="codes.length > 1" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div class="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Completed Codes</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ codes.filter(c => !c.isActive).length }} completed</p>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-800">
              <div
                v-for="code in codes.filter(c => !c.isActive)"
                :key="code.id"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div class="flex items-center gap-3">
                  <div v-if="code.photo" class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <img :src="code.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PackageIcon class="w-6 h-6 text-gray-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-bold text-sm text-gray-900 dark:text-white truncate">{{ code.name }}</h4>
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded flex-shrink-0">
                        <CheckCircleIcon class="w-3 h-3" />
                      </span>
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ code.numbers.length }} numbers</p>
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
