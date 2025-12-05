<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="bg-gray-900 dark:bg-gray-800 px-6 py-6 flex items-center justify-between border-b border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <HistoryIcon class="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white flex items-center gap-2">
                  Session History
                </h3>
                <p class="text-sm text-gray-400 mt-0.5">Complete activity timeline</p>
              </div>
            </div>
            <button
              @click="close"
              class="p-2 hover:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <XIcon class="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
            </div>

            <div v-else>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {{ phoneNumber.username ? phoneNumber.username.charAt(0).toUpperCase() : '📱' }}
                  </div>
                  <div class="flex-1">
                    <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {{ phoneNumber.username || 'Anonymous User' }}
                    </h4>
                    <div class="flex items-center gap-2">
                      <PhoneIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span class="font-mono text-lg font-bold text-gray-900 dark:text-white">
                        {{ phoneNumber.phone_number }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-center">
                    <div class="text-2xl font-black text-gray-900 dark:text-white">
                      {{ sessions.length }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                      Total Sessions
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-black text-green-600 dark:text-green-400">
                      {{ calledCount }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                      Called
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-black text-gray-600 dark:text-gray-400">
                      {{ notCalledCount }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                      Not Called
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="sessions.length === 0" class="text-center py-8">
                <div class="text-gray-400 mb-3">
                  <LayersIcon class="w-12 h-12 mx-auto" />
                </div>
                <p class="text-gray-600 dark:text-gray-400">No sessions found for this number</p>
              </div>

              <div v-else class="space-y-4">
                <h5 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <LayersIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  All Sessions
                </h5>

                <div
                  v-for="(session, index) in sessions"
                  :key="session.id"
                  class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md"
                >
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                        #{{ sessions.length - index }}
                      </div>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h6 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {{ session.capture?.page_name || 'Unknown Session' }}
                          </h6>
                          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div class="flex items-center gap-1">
                              <CalendarIcon class="w-4 h-4" />
                              <span>{{ formatDateTime(session.detected_at) }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                              <ClockIcon class="w-4 h-4" />
                              <span>{{ formatRelativeTime(session.detected_at) }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="flex flex-col items-end gap-2">
                          <span
                            :class="[
                              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm',
                              isCalledStatus(session.contact_status)
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                            ]"
                          >
                            <div
                              :class="[
                                'w-2 h-2 rounded-full',
                                isCalledStatus(session.contact_status) ? 'bg-green-500' : 'bg-gray-400'
                              ]"
                            ></div>
                            {{ isCalledStatus(session.contact_status) ? '✓ Called' : '○ Not Called' }}
                          </span>
                        </div>
                      </div>

                      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">
                              Contact Status
                            </label>
                            <div class="relative">
                              <select
                                v-model="session.contact_status"
                                @change="updateSessionStatus(session)"
                                class="w-full px-3 py-2 pr-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
                              >
                                <option value="not_called">Not Called</option>
                                <option value="called_no_answer">Called - No Answer</option>
                                <option value="called_answered">Called - Answered</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="declined">Declined</option>
                                <option value="callback_requested">Callback Requested</option>
                                <option value="invalid_contact">Invalid Contact</option>
                                <option value="completed">Completed</option>
                              </select>
                              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                              </div>
                              <div
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                                :style="{ backgroundColor: getStatusColor(session.contact_status) }"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">Source</p>
                            <span class="text-sm font-semibold text-gray-900 dark:text-white block px-3 py-2">
                              {{ session.page_source || 'Unknown' }}
                            </span>
                          </div>
                        </div>

                        <div v-if="session.capture" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Session Metrics</p>
                          <div class="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <div class="text-lg font-bold text-gray-900 dark:text-white">
                                {{ session.capture.total_views.toLocaleString() }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Views</div>
                            </div>
                            <div>
                              <div class="text-lg font-bold text-gray-900 dark:text-white">
                                {{ session.capture.total_likes.toLocaleString() }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                            </div>
                            <div>
                              <div class="text-lg font-bold text-gray-900 dark:text-white">
                                {{ session.capture.total_comments }}
                              </div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="session.comments && session.comments.length > 0" class="mt-3 space-y-2">
                        <p class="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <MessageCircleIcon class="w-3.5 h-3.5" />
                          Comments ({{ session.comments.length }})
                        </p>
                        <div
                          v-for="comment in session.comments"
                          :key="comment.id"
                          class="bg-gray-100 dark:bg-gray-950 rounded-lg p-3 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                        >
                          {{ comment.comment_text }}
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
import { ref, computed, watch } from 'vue'
import { mockDataService } from '@/lib/mockData'
import type { DetectedPhoneNumber, PhoneNumberComment, Capture } from '@/lib/mockData'
import {
  X as XIcon,
  Phone as PhoneIcon,
  History as HistoryIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Layers as LayersIcon,
  MessageCircle as MessageCircleIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-vue-next'

interface SessionWithDetails extends DetectedPhoneNumber {
  comments: PhoneNumberComment[]
  capture?: Capture
}

interface Props {
  isOpen: boolean
  phoneNumber: DetectedPhoneNumber & { comments: PhoneNumberComment[] }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const loading = ref(false)
const sessions = ref<SessionWithDetails[]>([])

const calledCount = computed(() => {
  return sessions.value.filter(s => isCalledStatus(s.contact_status)).length
})

const notCalledCount = computed(() => {
  return sessions.value.filter(s => !isCalledStatus(s.contact_status)).length
})

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await loadSessions()
  }
}, { immediate: true })

async function loadSessions() {
  loading.value = true
  try {
    const allNumbers = await mockDataService.getAllPhoneNumbers()

    const matchingSessions = allNumbers.filter(
      phone => phone.phone_number === props.phoneNumber.phone_number
    )

    const sessionsWithCaptures = await Promise.all(
      matchingSessions.map(async (session) => {
        const capture = await mockDataService.getCapture(session.capture_id)
        return {
          ...session,
          capture: capture || undefined
        }
      })
    )

    sessions.value = sessionsWithCaptures.sort((a, b) =>
      new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
    )
  } catch (error) {
    console.error('Error loading sessions:', error)
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function isCalledStatus(status: string): boolean {
  return ['called_answered', 'confirmed', 'completed', 'declined', 'callback_requested'].includes(status)
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

async function updateSessionStatus(session: SessionWithDetails) {
  try {
    await mockDataService.updatePhoneNumberStatus(session.id, session.contact_status)
    console.log('Status updated successfully')
  } catch (error) {
    console.error('Error updating status:', error)
  }
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
