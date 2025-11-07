<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" @click="close"></div>

      <div class="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800">
        <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Number-to-Code Confirmation</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Review {{ totalNumbers }} phone numbers and their assigned codes
              </p>
            </div>
            <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-6 flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by number, username, or code..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="flex gap-2">
              <button
                @click="viewMode = 'table'"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2',
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                <ListIcon class="w-4 h-4" />
                <span class="hidden sm:inline">All Numbers</span>
              </button>
              <button
                @click="viewMode = 'cards'"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2',
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                <GridIcon class="w-4 h-4" />
                <span class="hidden sm:inline">By Code</span>
              </button>
            </div>
          </div>

          <div v-if="session.codes.length === 0" class="text-center py-16">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <PackageIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Codes Yet</h4>
            <p class="text-gray-600 dark:text-gray-400">Start capturing numbers by creating your first code</p>
          </div>

          <div v-else class="max-h-[60vh] overflow-y-auto">
            <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-16">#</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Phone Number</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Username</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">→ Assigned To Code</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr
                      v-for="(item, index) in filteredTableData"
                      :key="item.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                    >
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {{ index + 1 }}
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <p class="font-mono font-bold text-lg text-gray-900 dark:text-white">{{ item.phoneNumber }}</p>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <UserIcon class="w-3 h-3" />
                          @{{ item.username }}
                        </div>
                      </td>
                      <td class="px-4 py-4">
                        <div class="flex items-center gap-3">
                          <ArrowRightIcon class="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div v-if="item.codePhoto" class="w-10 h-10 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-700 flex-shrink-0 shadow-sm">
                            <img :src="item.codePhoto" class="w-full h-full object-cover" />
                          </div>
                          <div v-else class="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <PackageIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span class="font-bold text-base text-gray-900 dark:text-white">{{ item.codeName }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTime(item.capturedAt) }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <CheckCircleIcon class="w-3 h-3 mr-1" />
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="filteredTableData.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
                No results found for "{{ searchQuery }}"
              </div>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="code in session.codes"
                :key="code.id"
                class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-4 flex-1">
                      <div v-if="code.photo" class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <img :src="code.photo" class="w-full h-full object-cover" />
                      </div>
                      <div v-else class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <PackageIcon class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>

                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ code.name }}</h4>
                          <span v-if="code.willPurchase" class="inline-flex items-center px-2.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            <ShoppingCartIcon class="w-3 h-3 mr-1" />
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
                      class="px-4 py-2 rounded-lg font-semibold text-sm transition"
                      :class="code.willPurchase
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'"
                    >
                      {{ code.willPurchase ? 'Selected' : 'Select for Purchase' }}
                    </button>
                  </div>
                </div>

                <div class="p-4 sm:p-6">
                  <div v-if="code.numbers.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
                    No numbers captured for this code
                  </div>

                  <div v-else class="space-y-2">
                    <div
                      v-for="(number, index) in code.numbers"
                      :key="number.id"
                      class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <div class="flex items-center gap-3 flex-1">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {{ index + 1 }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-mono font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">{{ number.phoneNumber }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <UserIcon class="w-3 h-3 flex-shrink-0" />
                            @{{ number.username }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span class="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                          <CheckCircleIcon class="w-3 h-3 mr-1" />
                          Confirmed
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                          {{ formatTime(number.capturedAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="session.codes.length > 0" class="mt-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Summary Statistics</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Total Codes</span>
                  <CodeIcon class="w-4 h-4 text-blue-500" />
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ session.codes.length }}</p>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Total Numbers</span>
                  <PhoneIcon class="w-4 h-4 text-green-500" />
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalNumbers }}</p>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">To Purchase</span>
                  <ShoppingCartIcon class="w-4 h-4 text-orange-500" />
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ purchaseCount }}</p>
              </div>
              <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Avg per Code</span>
                  <BarChartIcon class="w-4 h-4 text-purple-500" />
                </div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageNumbers }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="close"
              class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-white dark:hover:bg-gray-800 transition"
            >
              Close
            </button>
            <button
              @click="exportData"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
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
import { ref, computed } from 'vue'
import { X as XIcon, Package as PackageIcon, ShoppingCart as ShoppingCartIcon, Phone as PhoneIcon, Clock as ClockIcon, BarChart as BarChartIcon, Download as DownloadIcon, Search as SearchIcon, List as ListIcon, Grid3X3 as GridIcon, CheckCircle as CheckCircleIcon, User as UserIcon, Code as CodeIcon, ArrowRight as ArrowRightIcon } from 'lucide-vue-next'
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

const searchQuery = ref('')
const viewMode = ref<'table' | 'cards'>('table')

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

const tableData = computed(() => {
  const data: Array<{
    id: string
    phoneNumber: string
    username: string
    codeName: string
    codePhoto?: string
    capturedAt: string
  }> = []

  props.session.codes.forEach(code => {
    code.numbers.forEach(number => {
      data.push({
        id: number.id,
        phoneNumber: number.phoneNumber,
        username: number.username,
        codeName: code.name,
        codePhoto: code.photo,
        capturedAt: number.capturedAt
      })
    })
  })

  return data.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())
})

const filteredTableData = computed(() => {
  if (!searchQuery.value.trim()) return tableData.value

  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(item =>
    item.phoneNumber.toLowerCase().includes(query) ||
    item.username.toLowerCase().includes(query) ||
    item.codeName.toLowerCase().includes(query)
  )
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

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  return `${hours}h ago`
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
    })),
    numberToCodeMapping: tableData.value.map(item => ({
      phoneNumber: item.phoneNumber,
      username: item.username,
      assignedCode: item.codeName,
      capturedAt: item.capturedAt
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
