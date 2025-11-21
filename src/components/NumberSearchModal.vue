<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-6 py-6 flex items-center justify-between relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div class="flex items-center gap-3 relative z-10">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <PhoneIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white flex items-center gap-2">
                  👋 Contact Details
                </h3>
                <p class="text-sm text-blue-100 mt-0.5">Everything you need to know</p>
              </div>
            </div>
            <button
              @click="close"
              class="relative z-10 p-2 hover:bg-white/20 rounded-xl transition-all hover:scale-110"
            >
              <XIcon class="w-6 h-6 text-white" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="!phoneData" class="text-center py-12">
              <div class="flex justify-center mb-6">
                <div class="relative">
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl">
                    <SearchIcon class="w-16 h-16 text-gray-400" />
                  </div>
                  <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    🤔
                  </div>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Hmm, we couldn't find that number
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                No worries! This number might not be in our system yet.
              </p>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 max-w-md mx-auto border-2 border-blue-200 dark:border-blue-800">
                <p class="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span class="text-xl">💡</span>
                  <span><strong>Tip:</strong> Make sure you've entered the complete phone number, including country code if available.</span>
                </p>
              </div>
            </div>

            <div v-else>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 dark:bg-blue-700/20 rounded-full -mr-16 -mt-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/30 dark:bg-indigo-700/20 rounded-full -ml-12 -mb-12"></div>
                <div class="flex items-start gap-4 mb-4 relative z-10">
                  <div class="relative flex-shrink-0">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {{ phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?' }}
                    </div>
                    <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-900"></div>
                  </div>

                  <div class="flex-1">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="text-xs font-semibold text-green-700 dark:text-green-400">Active Contact</span>
                    </div>
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

                <div class="flex items-center justify-between pt-4 border-t-2 border-blue-200 dark:border-blue-800 relative z-10">
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

              <div v-if="phoneData.capture" class="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <TvIcon class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white">Where we found them</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Source information</p>
                  </div>
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

              <div v-if="phoneData.comments && phoneData.comments.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <MessageCircleIcon class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white">What they said 💬</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ phoneData.comments.length }} message{{ phoneData.comments.length > 1 ? 's' : '' }}</p>
                  </div>
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

              <div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <HistoryIcon class="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-900 dark:text-white">Journey Timeline 📅</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Track every step of this contact</p>
                  </div>
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
