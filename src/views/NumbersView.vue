<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <div class="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
            <PhoneIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Numbers Directory
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Track all phone numbers and their session history
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>

      <div v-else-if="phoneNumbers.length === 0" class="text-center py-12">
        <div class="flex justify-center mb-6">
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl">
            <PhoneIcon class="w-16 h-16 text-gray-500" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          No numbers yet
        </h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Phone numbers will appear here once captures start detecting them.
        </p>
      </div>

      <div v-else>
        <div class="mb-6 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="text-center">
                <div class="text-3xl font-black text-gray-900 dark:text-white">
                  {{ phoneNumbers.length }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Total Numbers
                </div>
              </div>
              <div class="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
              <div class="text-center">
                <div class="text-3xl font-black text-gray-900 dark:text-white">
                  {{ totalSessions }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Total Sessions
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search numbers..."
                class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <button
            v-for="phoneNumber in filteredPhoneNumbers"
            :key="phoneNumber.id"
            @click="selectNumber(phoneNumber)"
            class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg text-left group"
          >
            <div class="flex items-start gap-4">
              <div class="relative flex-shrink-0">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {{ phoneNumber.username ? phoneNumber.username.charAt(0).toUpperCase() : '📱' }}
                </div>
                <div
                  class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900"
                  :style="{ backgroundColor: getStatusColor(phoneNumber.contact_status) }"
                ></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {{ phoneNumber.username || 'Anonymous' }}
                  </h3>
                  <span
                    class="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 transition-all"
                    :class="getSessionBadgeClass(phoneNumber.sessionCount)"
                    :style="phoneNumber.sessionCount >= 4 ? 'animation: pulse-badge 2s infinite' : ''"
                  >
                    {{ phoneNumber.sessionCount }} session{{ phoneNumber.sessionCount > 1 ? 's' : '' }}
                  </span>
                </div>

                <div class="flex items-center gap-2 mb-3">
                  <PhoneIcon class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {{ phoneNumber.phone_number }}
                  </span>
                </div>

                <div class="flex items-center gap-3 mb-2.5 text-xs font-semibold flex-wrap">
                  <div
                    class="flex items-center gap-1.5"
                    :class="getActivityColorClass(phoneNumber.todaySubmissions)"
                  >
                    <CalendarIcon class="w-3.5 h-3.5" />
                    <span>Today: {{ phoneNumber.todaySubmissions }}</span>
                  </div>
                  <div class="w-px h-3.5 bg-gray-300 dark:bg-gray-600"></div>
                  <div
                    class="flex items-center gap-1.5"
                    :class="getActivityColorClass(phoneNumber.weekSubmissions)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This week: {{ phoneNumber.weekSubmissions }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <CalendarIcon class="w-3.5 h-3.5" />
                    <span>First seen {{ formatRelativeTime(phoneNumber.detected_at) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div
                      class="w-2 h-2 rounded-full"
                      :style="{ backgroundColor: getStatusColor(phoneNumber.contact_status) }"
                    ></div>
                    <span>{{ getStatusLabel(phoneNumber.contact_status) }}</span>
                  </div>
                </div>
              </div>

              <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0 mt-2" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <NumberDetailModal
      v-if="selectedNumber"
      :is-open="showDetailModal"
      :phone-number="selectedNumber"
      @close="showDetailModal = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockDataService } from '@/lib/mockData'
import type { DetectedPhoneNumber, PhoneNumberComment, Capture } from '@/lib/mockData'
import AppLayout from '@/components/AppLayout.vue'
import NumberDetailModal from '@/components/NumberDetailModal.vue'
import {
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

interface PhoneNumberWithSessions extends DetectedPhoneNumber {
  comments: PhoneNumberComment[]
  sessionCount: number
  todaySubmissions: number
  weekSubmissions: number
  sessionTimes: string[]
}

const loading = ref(true)
const phoneNumbers = ref<PhoneNumberWithSessions[]>([])
const searchQuery = ref('')
const showDetailModal = ref(false)
const selectedNumber = ref<PhoneNumberWithSessions | null>(null)

const totalSessions = computed(() => {
  return phoneNumbers.value.reduce((sum, phone) => sum + phone.sessionCount, 0)
})

const filteredPhoneNumbers = computed(() => {
  if (!searchQuery.value.trim()) {
    return phoneNumbers.value
  }

  const query = searchQuery.value.toLowerCase()
  return phoneNumbers.value.filter(phone =>
    phone.phone_number.toLowerCase().includes(query) ||
    phone.username?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await loadPhoneNumbers()
})

async function loadPhoneNumbers() {
  loading.value = true
  try {
    const allNumbers = await mockDataService.getAllPhoneNumbers()

    const uniqueNumbers = new Map<string, PhoneNumberWithSessions>()
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    for (const number of allNumbers) {
      const key = number.phone_number
      const detectedDate = new Date(number.detected_at)

      if (!uniqueNumbers.has(key)) {
        uniqueNumbers.set(key, {
          ...number,
          sessionCount: 1,
          todaySubmissions: detectedDate >= todayStart ? 1 : 0,
          weekSubmissions: detectedDate >= weekStart ? 1 : 0,
          sessionTimes: [number.detected_at]
        })
      } else {
        const existing = uniqueNumbers.get(key)!
        existing.sessionCount += 1
        existing.sessionTimes.push(number.detected_at)

        if (detectedDate >= todayStart) {
          existing.todaySubmissions += 1
        }
        if (detectedDate >= weekStart) {
          existing.weekSubmissions += 1
        }

        if (new Date(number.detected_at) < new Date(existing.detected_at)) {
          existing.detected_at = number.detected_at
        }
      }
    }

    phoneNumbers.value = Array.from(uniqueNumbers.values()).sort((a, b) =>
      new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
    )
  } catch (error) {
    console.error('Error loading phone numbers:', error)
  } finally {
    loading.value = false
  }
}

function selectNumber(phoneNumber: PhoneNumberWithSessions) {
  selectedNumber.value = phoneNumber
  showDetailModal.value = true
}

function formatRelativeTime(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(date).toLocaleDateString()
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    not_called: 'Not Called',
    called_no_answer: 'No Answer',
    called_answered: 'Called',
    confirmed: 'Confirmed',
    declined: 'Declined',
    callback_requested: 'Callback',
    invalid_contact: 'Invalid',
    completed: 'Completed'
  }
  return labels[status] || status
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    not_called: '#6B7280',
    called_no_answer: '#EAB308',
    called_answered: '#3B82F6',
    confirmed: '#22C55E',
    declined: '#EF4444',
    callback_requested: '#A855F7',
    invalid_contact: '#F97316',
    completed: '#10B981'
  }
  return colors[status] || '#6B7280'
}

function getSessionBadgeClass(count: number): string {
  if (count === 1) {
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  } else if (count <= 3) {
    return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
  } else {
    return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
  }
}

function getActivityColorClass(count: number): string {
  if (count === 0) {
    return 'text-gray-500 dark:text-gray-400'
  } else if (count <= 2) {
    return 'text-gray-700 dark:text-gray-300'
  } else if (count <= 5) {
    return 'text-blue-600 dark:text-blue-400'
  } else {
    return 'text-emerald-600 dark:text-emerald-400'
  }
}
</script>

<style scoped>
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
</style>
