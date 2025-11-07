<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6">
        <button
          @click="$router.push('/')"
          class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Code-Based Capture
            </h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Organize your captures by product codes
            </p>
          </div>

          <div class="flex gap-3">
            <button
              v-if="currentSession"
              @click="showSummary"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <ClipboardCheckIcon class="w-5 h-5" />
              View Summary
            </button>
            <button
              v-if="!currentSession"
              @click="startSession"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <PlayIcon class="w-5 h-5" />
              Start Session
            </button>
          </div>
        </div>

        <div v-if="!currentSession" class="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <CodeIcon class="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Session</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Start a new code-based capture session to organize your numbers by product codes
          </p>
          <button
            @click="loadMockData"
            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition"
          >
            Load Demo Data
          </button>
        </div>
      </div>

      <div v-if="currentSession" class="space-y-6">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 rounded-2xl p-6 text-white shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold">Active Session</h3>
              <p class="text-blue-100">Started {{ formatTime(currentSession.startedAt) }}</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="openCodeModal"
                class="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl transition flex items-center gap-2"
              >
                <PlusIcon class="w-5 h-5" />
                New Code
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p class="text-3xl font-bold">{{ currentSession.codes.length }}</p>
              <p class="text-blue-100 text-sm">Total Codes</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p class="text-3xl font-bold">{{ totalNumbers }}</p>
              <p class="text-blue-100 text-sm">Total Numbers</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p class="text-3xl font-bold">{{ purchaseCount }}</p>
              <p class="text-blue-100 text-sm">To Purchase</p>
            </div>
          </div>
        </div>

        <div v-if="currentSession.codes.length === 0" class="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <PackageIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Codes Created Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Create your first code to start organizing captures
          </p>
          <button
            @click="openCodeModal"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Create First Code
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="code in currentSession.codes"
            :key="code.id"
            class="bg-white dark:bg-gray-900 border-2 rounded-2xl overflow-hidden transition-all hover:shadow-xl"
            :class="code.isActive ? 'border-blue-500 dark:border-blue-600 shadow-lg shadow-blue-500/20' : code.willPurchase ? 'border-green-400 dark:border-green-600' : 'border-gray-300 dark:border-gray-700'"
          >
            <div class="p-6 border-b-2" :class="code.isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : code.willPurchase ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-4 flex-1">
                  <div v-if="code.photo" class="w-24 h-24 rounded-xl overflow-hidden border-2" :class="code.isActive ? 'border-blue-400' : code.willPurchase ? 'border-green-400' : 'border-gray-300'">
                    <img :src="code.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-24 h-24 rounded-xl flex items-center justify-center" :class="code.isActive ? 'bg-gradient-to-br from-blue-500 to-blue-600' : code.willPurchase ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'">
                    <PackageIcon class="w-12 h-12 text-white" />
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="text-2xl font-bold text-gray-900 dark:text-white">{{ code.name }}</h4>
                      <span v-if="code.isActive" class="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full animate-pulse">
                        ACTIVE
                      </span>
                      <span v-if="code.willPurchase" class="px-3 py-1 bg-green-600 text-white text-xs font-black rounded-full flex items-center gap-1">
                        <ShoppingCartIcon class="w-3 h-3" />
                        Will Purchase
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span class="flex items-center gap-1">
                        <PhoneIcon class="w-4 h-4" />
                        {{ code.numbers.length }} numbers
                      </span>
                      <span class="flex items-center gap-1">
                        <ClockIcon class="w-4 h-4" />
                        {{ formatTime(code.createdAt) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    v-if="!code.isActive"
                    @click="activateCode(code.id)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
                  >
                    Activate
                  </button>
                  <button
                    @click="togglePurchase(code.id)"
                    class="px-4 py-2 rounded-lg font-semibold text-sm transition"
                    :class="code.willPurchase ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
                  >
                    {{ code.willPurchase ? 'Selected' : 'Mark' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="code.numbers.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                No numbers captured for this code yet
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="(number, index) in code.numbers"
                  :key="number.id"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="font-mono font-bold text-gray-900 dark:text-white text-lg">{{ number.phoneNumber }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">@{{ number.username }}</p>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
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
