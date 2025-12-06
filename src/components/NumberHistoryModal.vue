<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-800"
        @click.stop
      >
        <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 z-10">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Number History
              </h2>
              <div class="flex items-center gap-2">
                <PhoneIcon class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p class="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                  {{ phoneNumber }}
                </p>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ username }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div v-if="!loading && history" class="mt-4 flex items-center gap-2">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <HistoryIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Appeared in {{ history.totalSessions }} {{ history.totalSessions === 1 ? 'session' : 'sessions' }}
              </span>
            </div>
          </div>
        </div>

        <div class="overflow-y-auto max-h-[calc(85vh-180px)] p-6">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="!history || history.totalSessions === 0" class="py-16 text-center">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <HistoryIcon class="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Previous Sessions
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              This is the first time this number has been detected
            </p>
          </div>

          <div v-else class="space-y-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Session History
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Chronological list of when this number was detected
              </p>
            </div>

            <div
              v-for="(session, index) in history.sessions"
              :key="index"
              class="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <VideoIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ session.capture.page_name }}
                    </h4>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        session.capture.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                      ]"
                    >
                      {{ session.capture.status === 'active' ? 'Active' : 'Stopped' }}
                    </span>
                  </div>

                  <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <div class="flex items-center gap-1">
                      <CalendarIcon class="w-4 h-4" />
                      <span>{{ formatDate(session.detectedAt) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <ClockIcon class="w-4 h-4" />
                      <span>{{ formatTime(session.detectedAt) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">Contact Status:</span>
                    <span
                      :class="[
                        'px-2 py-1 rounded-lg text-xs font-semibold',
                        getStatusColor(session.contactStatus)
                      ]"
                    >
                      {{ formatStatus(session.contactStatus) }}
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Session ID</div>
                  <div class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {{ session.capture.id }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2">
                  <EyeIcon class="w-4 h-4 text-purple-500" />
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Views</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ session.capture.total_views.toLocaleString() }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <HeartIcon class="w-4 h-4 text-red-500" />
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ session.capture.total_likes.toLocaleString() }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <MessageCircleIcon class="w-4 h-4 text-blue-500" />
                  <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ session.capture.total_comments.toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="session.capture.status === 'active'"
                class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  @click="navigateToSession(session.capture.id)"
                  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLinkIcon class="w-4 h-4" />
                  View Live Session
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            @click="$emit('close')"
            class="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { mockDataService } from '@/lib/mockData'
import type { ContactStatus } from '@/lib/mockData'
import {
  X as XIcon,
  Phone as PhoneIcon,
  History as HistoryIcon,
  Video as VideoIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Heart as HeartIcon,
  MessageCircle as MessageCircleIcon,
  ExternalLink as ExternalLinkIcon
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  phoneNumber: string
  username: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const loading = ref(false)
const history = ref<Awaited<ReturnType<typeof mockDataService.getNumberSessionHistory>> | null>(null)

async function loadHistory() {
  if (!props.phoneNumber) return

  loading.value = true
  try {
    history.value = await mockDataService.getNumberSessionHistory(props.phoneNumber)
  } catch (error) {
    console.error('Error loading number history:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function formatStatus(status: ContactStatus): string {
  const statusMap: Record<ContactStatus, string> = {
    not_called: 'Not Called',
    called_no_answer: 'No Answer',
    called_answered: 'Answered',
    confirmed: 'Confirmed',
    declined: 'Declined',
    callback_requested: 'Callback Requested',
    invalid_contact: 'Invalid Contact',
    completed: 'Completed'
  }
  return statusMap[status]
}

function getStatusColor(status: ContactStatus): string {
  const colors: Record<ContactStatus, string> = {
    not_called: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    called_no_answer: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    called_answered: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    declined: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    callback_requested: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    invalid_contact: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
    completed: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
  }
  return colors[status]
}

function navigateToSession(captureId: string) {
  emit('close')
  router.push(`/capture/${captureId}`)
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadHistory()
  }
})
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

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
