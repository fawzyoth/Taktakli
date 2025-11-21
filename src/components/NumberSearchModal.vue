<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <PhoneIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Number Details</h3>
                <p class="text-xs text-blue-100">Complete information and history</p>
              </div>
            </div>
            <button
              @click="close"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XIcon class="w-5 h-5 text-white" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="!phoneData" class="text-center py-12">
              <div class="flex justify-center mb-4">
                <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl">
                  <SearchIcon class="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Number not found
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                No record found for this phone number
              </p>
            </div>

            <div v-else>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
                <div class="flex items-start gap-4 mb-4">
                  <div class="relative flex-shrink-0">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {{ phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?' }}
                    </div>
                    <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-900"></div>
                  </div>

                  <div class="flex-1">
                    <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ phoneData.username || 'Anonymous User' }}
                    </h4>
                    <div class="flex items-center gap-2 mb-3">
                      <PhoneIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span class="font-mono text-xl font-bold text-gray-900 dark:text-white">
                        {{ phoneData.phone_number }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <ClockIcon class="w-4 h-4" />
                      <span>Detected {{ formatRelativeTime(phoneData.detected_at) }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t-2 border-blue-200 dark:border-blue-800">
                  <div>
                    <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Status</p>
                    <div class="flex items-center gap-2">
                      <div
                        class="w-3 h-3 rounded-full"
                        :style="{ backgroundColor: getStatusColor(phoneData.contact_status) }"
                      ></div>
                      <span class="font-semibold text-gray-900 dark:text-white">
                        {{ getStatusLabel(phoneData.contact_status) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Source</p>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ phoneData.page_source || 'Unknown' }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="phoneData.capture" class="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-3">
                  <TvIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h5 class="font-semibold text-gray-900 dark:text-white">Associated Capture</h5>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ phoneData.capture.page_name }}</span>
                    <span :class="[
                      'text-xs px-2 py-1 rounded-full font-semibold',
                      phoneData.capture.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    ]">
                      {{ phoneData.capture.status }}
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Views</p>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ phoneData.capture.total_views.toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Likes</p>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ phoneData.capture.total_likes.toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ phoneData.capture.total_comments }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="phoneData.comments && phoneData.comments.length > 0" class="bg-white dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-4">
                  <MessageCircleIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h5 class="font-semibold text-gray-900 dark:text-white">Comments ({{ phoneData.comments.length }})</h5>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="comment in phoneData.comments"
                    :key="comment.id"
                    class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                  >
                    <p class="text-gray-900 dark:text-white mb-2">{{ comment.comment_text }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDateTime(comment.created_at) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-4">
                  <HistoryIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h5 class="font-semibold text-gray-900 dark:text-white">Status History</h5>
                </div>

                <div class="relative">
                  <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div class="space-y-6">
                    <div class="relative flex gap-4">
                      <div class="relative z-10 flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div class="flex-1 pb-6">
                        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <div class="flex items-center gap-2 mb-2">
                            <span class="font-semibold text-gray-900 dark:text-white">
                              {{ getStatusLabel(phoneData.contact_status) }}
                            </span>
                            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold">
                              Current
                            </span>
                          </div>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Updated {{ formatRelativeTime(phoneData.status_updated_at) }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="relative flex gap-4">
                      <div class="relative z-10 flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <div class="w-2 h-2 bg-white dark:bg-gray-400 rounded-full"></div>
                      </div>
                      <div class="flex-1">
                        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <div class="flex items-center gap-2 mb-2">
                            <span class="font-semibold text-gray-900 dark:text-white">
                              Number Detected
                            </span>
                          </div>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatDateTime(phoneData.detected_at) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { mockDataService } from '@/lib/mockData'
import type { DetectedPhoneNumber, PhoneNumberComment, Capture } from '@/lib/mockData'
import {
  X as XIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  Clock as ClockIcon,
  MessageCircle as MessageCircleIcon,
  History as HistoryIcon,
  Tv as TvIcon
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  phoneNumber: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)
const phoneData = ref<(DetectedPhoneNumber & { comments: PhoneNumberComment[], capture?: Capture }) | null>(null)

watch(() => props.phoneNumber, async (newNumber) => {
  if (newNumber && props.isOpen) {
    await searchNumber()
  }
}, { immediate: true })

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.phoneNumber) {
    await searchNumber()
  }
})

async function searchNumber() {
  loading.value = true
  phoneData.value = null

  try {
    const allPhoneNumbers = await mockDataService.getAllPhoneNumbers()
    const found = allPhoneNumbers.find(p =>
      p.phone_number.replace(/\D/g, '') === props.phoneNumber.replace(/\D/g, '')
    )

    if (found) {
      const capture = await mockDataService.getCapture(found.capture_id)
      phoneData.value = {
        ...found,
        capture: capture || undefined
      }
    }
  } catch (error) {
    console.error('Error searching number:', error)
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString()
}

function formatRelativeTime(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    not_called: 'Not Called',
    called_no_answer: 'No Answer',
    called_answered: 'Called',
    confirmed: 'Confirmed',
    declined: 'Declined',
    callback_requested: 'Callback Requested',
    invalid_contact: 'Invalid Contact',
    completed: 'Completed'
  }
  return labels[status] || status
}

function getStatusColor(status: string) {
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
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
