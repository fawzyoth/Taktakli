<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" @click="close"></div>

      <div class="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ClipboardCheckIcon class="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Capture Session Summary</h3>
                <p class="text-sm text-blue-100">
                  {{ session.codes.length }} codes • {{ totalNumbers }} total numbers captured
                </p>
              </div>
            </div>
            <button @click="close" class="text-white hover:bg-white/20 rounded-lg p-2 transition">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <div v-if="session.codes.length === 0" class="text-center py-12">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <PackageIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Codes Yet</h4>
            <p class="text-gray-600 dark:text-gray-400">Start capturing numbers by creating your first code</p>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="code in session.codes"
              :key="code.id"
              class="border-2 rounded-2xl overflow-hidden transition-all hover:shadow-xl"
              :class="code.willPurchase ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'"
            >
              <div class="p-5 border-b-2" :class="code.willPurchase ? 'border-green-200 dark:border-green-800 bg-green-100 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-4 flex-1">
                    <div v-if="code.photo" class="w-20 h-20 rounded-xl overflow-hidden border-2" :class="code.willPurchase ? 'border-green-400 dark:border-green-600' : 'border-gray-300 dark:border-gray-600'">
                      <img :src="code.photo" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-20 h-20 rounded-xl flex items-center justify-center" :class="code.willPurchase ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'">
                      <PackageIcon class="w-10 h-10 text-white" />
                    </div>

                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ code.name }}</h4>
                        <span v-if="code.willPurchase" class="px-3 py-1 bg-green-600 text-white text-xs font-black rounded-full flex items-center gap-1">
                          <ShoppingCartIcon class="w-3 h-3" />
                          Will Purchase
                        </span>
                      </div>
                      <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span class="flex items-center gap-1">
                          <PhoneIcon class="w-4 h-4" />
                          {{ code.numbers.length }} {{ code.numbers.length === 1 ? 'number' : 'numbers' }}
                        </span>
                        <span class="flex items-center gap-1">
                          <ClockIcon class="w-4 h-4" />
                          {{ formatTime(code.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    @click="togglePurchase(code.id)"
                    class="px-4 py-2 rounded-lg font-semibold text-sm transition shadow-md hover:shadow-lg"
                    :class="code.willPurchase ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
                  >
                    {{ code.willPurchase ? 'Selected' : 'Mark to Purchase' }}
                  </button>
                </div>
              </div>

              <div class="p-5">
                <div v-if="code.numbers.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                  No numbers captured for this code
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="(number, index) in code.numbers"
                    :key="number.id"
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition"
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

            <div class="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChartIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Summary Statistics
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ session.codes.length }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Codes</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ totalNumbers }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Numbers</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ purchaseCount }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">To Purchase</p>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ averageNumbers }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Avg per Code</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div class="flex gap-3">
            <button
              @click="close"
              class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-800 transition"
            >
              Close
            </button>
            <button
              @click="exportData"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <DownloadIcon class="w-5 h-5" />
              Export Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ClipboardCheck as ClipboardCheckIcon, X as XIcon, Package as PackageIcon, ShoppingCart as ShoppingCartIcon, Phone as PhoneIcon, Clock as ClockIcon, BarChart as BarChartIcon, Download as DownloadIcon } from 'lucide-vue-next'
import type { CaptureSession } from '@/lib/codeCapture'

interface Props {
  isOpen: boolean
  session: CaptureSession
}

interface Emits {
  (e: 'close'): void
  (e: 'toggle-purchase', codeId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const totalNumbers = computed(() => {
  return props.session.codes.reduce((sum, code) => sum + code.numbers.length, 0)
})

const purchaseCount = computed(() => {
  return props.session.codes.filter(code => code.willPurchase).length
})

const averageNumbers = computed(() => {
  if (props.session.codes.length === 0) return 0
  return Math.round(totalNumbers.value / props.session.codes.length)
})

function close() {
  emit('close')
}

function togglePurchase(codeId: string) {
  emit('toggle-purchase', codeId)
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

function exportData() {
  const data = {
    sessionId: props.session.id,
    mode: props.session.mode,
    startedAt: props.session.startedAt,
    totalCodes: props.session.codes.length,
    totalNumbers: totalNumbers.value,
    codesToPurchase: purchaseCount.value,
    codes: props.session.codes.map(code => ({
      name: code.name,
      willPurchase: code.willPurchase,
      numbersCount: code.numbers.length,
      numbers: code.numbers.map(num => ({
        phoneNumber: num.phoneNumber,
        username: num.username,
        capturedAt: num.capturedAt
      }))
    }))
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `capture-summary-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
