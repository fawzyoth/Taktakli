<template>
  <AppLayout>
    <div class="p-4 md:p-6">
      <div class="mb-6">
        <button
          @click="$router.push('/')"
          class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div class="mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Code-Based Capture
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Organize your captures by product codes
          </p>

          <button
            v-if="currentSession"
            @click="showSummary"
            class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            <ClipboardCheckIcon class="w-5 h-5" />
            View Summary
          </button>
          <button
            v-if="!currentSession"
            @click="startSession"
            class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            <PlayIcon class="w-5 h-5" />
            Start Session
          </button>
        </div>

        <div v-if="!currentSession" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CodeIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Session</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Start a new session to organize numbers by product codes
          </p>
          <button
            @click="loadMockData"
            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition"
          >
            Load Demo Data
          </button>
        </div>
      </div>

      <div v-if="currentSession" class="space-y-4">
        <div class="bg-blue-600 dark:bg-blue-700 rounded-lg p-4 md:p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg md:text-xl font-bold">Active Session</h3>
              <p class="text-blue-100 text-sm">Started {{ formatTime(currentSession.startedAt) }}</p>
            </div>
            <button
              @click="openCodeModal"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition flex items-center gap-2"
            >
              <PlusIcon class="w-5 h-5" />
              <span class="hidden md:inline">New Code</span>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-2xl md:text-3xl font-bold">{{ currentSession.codes.length }}</p>
              <p class="text-blue-100 text-xs md:text-sm">Codes</p>
            </div>
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-2xl md:text-3xl font-bold">{{ totalNumbers }}</p>
              <p class="text-blue-100 text-xs md:text-sm">Numbers</p>
            </div>
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-2xl md:text-3xl font-bold">{{ purchaseCount }}</p>
              <p class="text-blue-100 text-xs md:text-sm">Purchase</p>
            </div>
          </div>
        </div>

        <div v-if="currentSession.codes.length === 0" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <PackageIcon class="w-10 h-10 text-gray-500" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Codes Yet</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Create your first code to start
          </p>
          <button
            @click="openCodeModal"
            class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Create First Code
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="code in currentSession.codes"
            :key="code.id"
            class="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden"
            :class="code.isActive ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-800'"
          >
            <div class="p-4" :class="code.isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''">
              <div class="flex items-start gap-3 mb-3">
                <div v-if="code.photo" class="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <img :src="code.photo" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <PackageIcon class="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{{ code.name }}</h4>
                    <span v-if="code.isActive" class="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                      ACTIVE
                    </span>
                    <span v-if="code.willPurchase" class="px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded flex items-center gap-1">
                      <ShoppingCartIcon class="w-3 h-3" />
                      Purchase
                    </span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <PhoneIcon class="w-4 h-4" />
                      {{ code.numbers.length }}
                    </span>
                    <span class="flex items-center gap-1">
                      <ClockIcon class="w-4 h-4" />
                      {{ formatTime(code.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  v-if="!code.isActive"
                  @click="activateCode(code.id)"
                  class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
                >
                  Activate
                </button>
                <button
                  @click="togglePurchase(code.id)"
                  class="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition"
                  :class="code.willPurchase ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
                >
                  {{ code.willPurchase ? 'Selected' : 'Mark' }}
                </button>
              </div>
            </div>

            <div class="px-4 pb-4">
              <div v-if="code.numbers.length === 0" class="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                No numbers yet
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="(number, index) in code.numbers"
                  :key="number.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {{ index + 1 }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-mono font-bold text-gray-900 dark:text-white truncate">{{ number.phoneNumber }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400 truncate">@{{ number.username }}</p>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {{ formatTime(number.capturedAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CodeBasedCaptureModal
      :is-open="isModalOpen"
      :step="modalStep"
      :active-code="activeCode"
      @close="closeModal"
      @create-code="handleCreateCode"
      @capture-number="handleCaptureNumber"
      @finish-code="handleFinishCode"
      @finish-session="handleFinishSession"
    />

    <CaptureSummaryModal
      :is-open="isSummaryOpen"
      :session="summarySession || currentSession!"
      @close="closeSummary"
      @toggle-purchase="togglePurchase"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import CodeBasedCaptureModal from '@/components/CodeBasedCaptureModal.vue'
import CaptureSummaryModal from '@/components/CaptureSummaryModal.vue'
import { ArrowLeft as ArrowLeftIcon, Play as PlayIcon, ClipboardCheck as ClipboardCheckIcon, Code as CodeIcon, Plus as PlusIcon, Package as PackageIcon, ShoppingCart as ShoppingCartIcon, Phone as PhoneIcon, Clock as ClockIcon } from 'lucide-vue-next'
import { codeCaptureService, generateMockSession } from '@/lib/codeCapture'
import type { CaptureSession, CapturedCode } from '@/lib/codeCapture'

const router = useRouter()
const currentSession = ref<CaptureSession | null>(null)
const isModalOpen = ref(false)
const modalStep = ref<'create' | 'capture'>('create')
const isSummaryOpen = ref(false)
const summarySession = ref<CaptureSession | null>(null)

const activeCode = computed(() => {
  if (!currentSession.value) return null
  return currentSession.value.codes.find(c => c.isActive) || null
})

const totalNumbers = computed(() => {
  if (!currentSession.value) return 0
  return currentSession.value.codes.reduce((sum, code) => sum + code.numbers.length, 0)
})

const purchaseCount = computed(() => {
  if (!currentSession.value) return 0
  return currentSession.value.codes.filter(code => code.willPurchase).length
})

function startSession() {
  currentSession.value = codeCaptureService.createSession('code-based')
  openCodeModal()
}

function loadMockData() {
  currentSession.value = generateMockSession()
}

function openCodeModal() {
  modalStep.value = 'create'
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleCreateCode(name: string, photo?: string) {
  codeCaptureService.createCode(name, photo)
  currentSession.value = codeCaptureService.getSession()
  modalStep.value = 'capture'
}

function handleCaptureNumber(phoneNumber: string, username: string) {
  codeCaptureService.captureNumber(phoneNumber, username)
  currentSession.value = codeCaptureService.getSession()
}

function handleFinishCode() {
  modalStep.value = 'create'
}

function handleFinishSession() {
  const finishedSession = codeCaptureService.finishSession()
  summarySession.value = finishedSession
  currentSession.value = null
  isModalOpen.value = false
  isSummaryOpen.value = true
}

function activateCode(codeId: string) {
  if (!currentSession.value) return

  currentSession.value.codes.forEach(code => {
    code.isActive = code.id === codeId
  })
  currentSession.value.activeCodeId = codeId

  modalStep.value = 'capture'
  isModalOpen.value = true
}

function togglePurchase(codeId: string) {
  codeCaptureService.togglePurchaseDecision(codeId)
  currentSession.value = codeCaptureService.getSession()
  if (summarySession.value) {
    const code = summarySession.value.codes.find(c => c.id === codeId)
    if (code) {
      code.willPurchase = !code.willPurchase
    }
  }
}

function showSummary() {
  isSummaryOpen.value = true
}

function closeSummary() {
  isSummaryOpen.value = false
  summarySession.value = null
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script>
