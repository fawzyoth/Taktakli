<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Confirmation Modal Demo</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Preview the confirmation interface with multiple codes and numbers</p>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Mock Session Data</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Total Codes</span>
              <CodeIcon class="w-4 h-4 text-blue-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ mockSession.codes.length }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Total Numbers</span>
              <PhoneIcon class="w-4 h-4 text-green-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalNumbers }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Will Purchase</span>
              <ShoppingCartIcon class="w-4 h-4 text-orange-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ purchaseCount }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Avg per Code</span>
              <BarChartIcon class="w-4 h-4 text-purple-500" />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageNumbers }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div
            v-for="code in mockSession.codes"
            :key="code.id"
            class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div v-if="code.photo" class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img :src="code.photo" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <PackageIcon class="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ code.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ code.numbers.length }} numbers captured</p>
                </div>
              </div>
              <span
                v-if="code.willPurchase"
                class="inline-flex items-center px-2.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full"
              >
                <ShoppingCartIcon class="w-3 h-3 mr-1" />
                Will Purchase
              </span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(number, idx) in code.numbers"
                :key="number.id"
                class="flex items-center gap-3 text-sm"
              >
                <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {{ idx + 1 }}
                </div>
                <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ number.phoneNumber }}</span>
                <span class="text-gray-500 dark:text-gray-400">@{{ number.username }}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="showModal = true"
          class="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
        >
          <EyeIcon class="w-5 h-5" />
          Preview Confirmation Modal
        </button>
      </div>
    </div>

    <CaptureSummaryModal
      :is-open="showModal"
      :session="mockSession"
      @close="showModal = false"
      @toggle-purchase="togglePurchase"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import CaptureSummaryModal from '@/components/CaptureSummaryModal.vue'
import { Code as CodeIcon, Phone as PhoneIcon, ShoppingCart as ShoppingCartIcon, BarChart as BarChartIcon, Package as PackageIcon, Eye as EyeIcon } from 'lucide-vue-next'
import { generateMockSession } from '@/lib/codeCapture'

const showModal = ref(false)
const mockSession = ref(generateMockSession())

const totalNumbers = computed(() => {
  return mockSession.value.codes.reduce((sum, code) => sum + code.numbers.length, 0)
})

const purchaseCount = computed(() => {
  return mockSession.value.codes.filter(code => code.willPurchase).length
})

const averageNumbers = computed(() => {
  if (mockSession.value.codes.length === 0) return 0
  return Math.round(totalNumbers.value / mockSession.value.codes.length)
})

function togglePurchase(codeId: string) {
  const code = mockSession.value.codes.find(c => c.id === codeId)
  if (code) {
    code.willPurchase = !code.willPurchase
  }
}
</script>
