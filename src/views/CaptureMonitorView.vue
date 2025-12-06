<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <p class="text-gray-600 dark:text-gray-400">Loading capture...</p>
      </div>

      <div v-else-if="!capture" class="text-center py-16">
        <p class="text-gray-600 dark:text-gray-400">Capture not found</p>
      </div>

      <div v-else>
        <div class="mb-6">
          <button
            @click="$router.push('/')"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Capture Monitor
              </h1>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Started {{ new Date(capture.started_at).toLocaleString() }}
              </p>
            </div>

            <button
              v-if="capture.status === 'active'"
              @click="stopCapture"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Stop Capture
            </button>
            <span
              v-else
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-semibold rounded-lg text-center"
            >
              Stopped
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center space-x-3 mb-2">
              <EyeIcon class="w-5 h-5 text-purple-500" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Views</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ capture.total_views.toLocaleString() }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center space-x-3 mb-2">
              <HeartIcon class="w-5 h-5 text-red-500" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Likes</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ capture.total_likes.toLocaleString() }}</p>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center space-x-3 mb-2">
              <MessageCircleIcon class="w-5 h-5 text-blue-500" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ capture.total_comments }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
          <div class="border-b border-gray-200 dark:border-gray-800">
            <nav class="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              <button
                @click="activeTab = 'numbers'"
                :class="[
                  'py-3 sm:py-4 px-2 text-sm sm:text-base font-semibold border-b-2 transition whitespace-nowrap',
                  activeTab === 'numbers'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Phone Numbers
                <span v-if="!selectedFilters.includes('all')" class="ml-1">
                  ({{ filteredPhoneNumbers.length }}/{{ phoneNumbers.length }})
                </span>
                <span v-else class="ml-1">
                  ({{ phoneNumbers.length }})
                </span>
              </button>
              <button
                @click="activeTab = 'chat'"
                :class="[
                  'py-3 sm:py-4 px-2 text-sm sm:text-base font-semibold border-b-2 transition whitespace-nowrap',
                  activeTab === 'chat'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Live Chat ({{ allComments.length }})
              </button>
            </nav>
          </div>

          <div class="p-4 sm:p-6">
            <div v-if="activeTab === 'numbers'">
              <StatusFilterBar
                :status-counts="statusCounts"
                :selected-filters="selectedFilters"
                @update:selected-filters="selectedFilters = $event"
              />

              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 shadow-sm">
                <div class="flex flex-col lg:flex-row gap-4">
                  <div class="flex-1 relative">
                    <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search by phone number, username, or status..."
                      class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      v-if="searchQuery"
                      @click="searchQuery = ''"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XIcon class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <SortIcon class="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <select
                      v-model="sortBy"
                      class="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alphabetical">A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Phone Numbers
                  <span v-if="searchQuery || !selectedFilters.includes('all')" class="text-lg font-normal text-gray-600 dark:text-gray-400">
                    ({{ filteredPhoneNumbers.length }} of {{ phoneNumbers.length }})
                  </span>
                </h2>
              </div>

              <div v-if="phoneNumbers.length === 0" class="py-16 text-center">
                <div class="flex justify-center mb-4">
                  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <PhoneIcon class="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No phone numbers detected yet
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ capture.status === 'active' ? 'Phone numbers will appear here as they are detected' : 'This capture has been stopped' }}
                </p>
              </div>

              <div v-else-if="filteredPhoneNumbers.length === 0" class="py-16 text-center">
                <div class="flex justify-center mb-4">
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl">
                    <SearchIcon class="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ searchQuery ? 'No phone numbers match your search query' : 'No phone numbers match the selected filters' }}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                  <button
                    v-if="hasActiveFilters"
                    @click="selectedFilters = ['all']"
                    class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="phoneData in filteredPhoneNumbers"
                  :key="phoneData.id"
                  :class="[
                    'rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] cursor-pointer',
                    getStatusColor(phoneData.contact_status)
                  ]"
                >
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex items-start space-x-3 flex-1">
                      <div class="relative flex-shrink-0">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-lg">
                          {{ phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?' }}
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 mb-1.5 flex-wrap">
                          <span class="font-bold text-base text-gray-900 dark:text-white">
                            {{ phoneData.username || 'Anonymous User' }}
                          </span>
                          <span class="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm">
                            NEW
                          </span>
                        </div>
                        <div class="flex items-center space-x-2 mb-2">
                          <PhoneIcon class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span class="font-mono font-bold text-lg text-gray-900 dark:text-white">
                            {{ phoneData.phone_number }}
                          </span>
                        </div>
                        <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon class="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{{ new Date(phoneData.detected_at).toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="phoneData.callHistory && phoneData.callHistory.totalAttempts > 0" class="flex items-center gap-2 mb-3 flex-wrap">
                    <div
                      v-if="phoneData.callHistory.confirmedCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                      :title="`${phoneData.callHistory.confirmedCount} confirmed contact${phoneData.callHistory.confirmedCount > 1 ? 's' : ''}`"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>{{ phoneData.callHistory.confirmedCount }}×</span>
                    </div>

                    <div
                      v-if="phoneData.callHistory.declinedCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                      :title="`${phoneData.callHistory.declinedCount} declined call${phoneData.callHistory.declinedCount > 1 ? 's' : ''}`"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                      <span>{{ phoneData.callHistory.declinedCount }}×</span>
                    </div>

                    <div
                      v-if="phoneData.callHistory.noAnswerCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                      :title="`${phoneData.callHistory.noAnswerCount} no answer${phoneData.callHistory.noAnswerCount > 1 ? 's' : ''}`"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      <span>{{ phoneData.callHistory.noAnswerCount }}×</span>
                    </div>

                    <div
                      v-if="phoneData.callHistory.answeredCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      :title="`${phoneData.callHistory.answeredCount} answered call${phoneData.callHistory.answeredCount > 1 ? 's' : ''}`"
                    >
                      <PhoneIcon class="w-3 h-3" />
                      <span>{{ phoneData.callHistory.answeredCount }}×</span>
                    </div>

                    <div
                      v-if="phoneData.callHistory.callbackCount > 0"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                      :title="`${phoneData.callHistory.callbackCount} callback request${phoneData.callHistory.callbackCount > 1 ? 's' : ''}`"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{{ phoneData.callHistory.callbackCount }}×</span>
                    </div>

                    <div
                      v-if="phoneData.callHistory.successRate >= 50"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      :title="`${phoneData.callHistory.successRate.toFixed(0)}% success rate`"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                      </svg>
                      <span>{{ phoneData.callHistory.successRate.toFixed(0) }}%</span>
                    </div>
                  </div>

                  <div v-if="phoneData.comments && phoneData.comments.length > 0" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <MessageCircleIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span class="text-sm font-semibold text-blue-900 dark:text-blue-200">
                          {{ phoneData.comments.length }} {{ phoneData.comments.length === 1 ? 'Comment' : 'Comments' }}
                        </span>
                      </div>
                      <button
                        v-if="phoneData.comments.length >= 2"
                        @click="openCommentsModal(phoneData)"
                        class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                      >
                        Show More
                      </button>
                    </div>
                    <p v-if="phoneData.comments.length === 1" class="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                      {{ phoneData.comments[0].comment_text }}
                    </p>
                  </div>

                  <div v-if="phoneData.sessionAppearances !== undefined && phoneData.sessionAppearances > 0" class="flex items-center gap-2 mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div class="flex items-center gap-2 flex-1">
                      <HistoryIcon class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <div>
                        <div class="text-sm font-semibold text-amber-900 dark:text-amber-200">
                          Previously Seen
                        </div>
                        <div class="text-xs text-amber-700 dark:text-amber-400">
                          Appeared in {{ phoneData.sessionAppearances }} other {{ phoneData.sessionAppearances === 1 ? 'session' : 'sessions' }}
                        </div>
                      </div>
                    </div>
                    <button
                      @click.stop="openHistoryModal(phoneData)"
                      class="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ClockIcon class="w-4 h-4" />
                      History
                    </button>
                  </div>

                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <ContactStatusDropdown
                      :phone-number-id="phoneData.id"
                      :current-status="phoneData.contact_status"
                      @status-changed="(newStatus) => handleStatusChange(phoneData.id, newStatus)"
                    />
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Updated: {{ new Date(phoneData.status_updated_at).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'chat'">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Live Chat</h2>

              <div v-if="allComments.length === 0" class="py-16 text-center">
                <div class="flex justify-center mb-4">
                  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <MessageCircleIcon class="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No chat messages yet
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Messages will appear here when users comment
                </p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="message in allComments"
                  :key="message.id"
                  class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-start justify-between mb-2">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      Comment from {{ message.phone_number }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ new Date(message.created_at).toLocaleString() }}
                    </span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300">{{ message.comment_text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CommentsModal
      v-if="selectedPhoneData"
      :is-open="isModalOpen"
      :comments="selectedPhoneData.comments"
      :phone-number="selectedPhoneData.phone_number"
      :username="selectedPhoneData.username || 'Anonymous User'"
      @close="closeCommentsModal"
    />

    <NumberHistoryModal
      v-if="historyPhoneData"
      :is-open="isHistoryModalOpen"
      :phone-number="historyPhoneData.phone_number"
      :username="historyPhoneData.username || 'Anonymous User'"
      @close="closeHistoryModal"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockDataService } from '@/lib/mockData'
import type { Capture, DetectedPhoneNumber, PhoneNumberComment, ContactStatus } from '@/lib/mockData'
import AppLayout from '@/components/AppLayout.vue'
import ContactStatusDropdown from '@/components/ContactStatusDropdown.vue'
import CommentsModal from '@/components/CommentsModal.vue'
import NumberHistoryModal from '@/components/NumberHistoryModal.vue'
import StatusFilterBar from '@/components/StatusFilterBar.vue'
import { ArrowLeft as ArrowLeftIcon, Eye as EyeIcon, Heart as HeartIcon, MessageCircle as MessageCircleIcon, Phone as PhoneIcon, Search as SearchIcon, SlidersHorizontal as SortIcon, X as XIcon, Clock as ClockIcon, History as HistoryIcon } from 'lucide-vue-next'

interface CallHistorySummary {
  totalAttempts: number
  declinedCount: number
  noAnswerCount: number
  answeredCount: number
  confirmedCount: number
  callbackCount: number
  invalidCount: number
  completedCount: number
  lastContactAt: string | null
  lastOutcome: string
  successRate: number
}

interface PhoneNumberWithHistory extends DetectedPhoneNumber {
  comments: PhoneNumberComment[]
  callHistory?: CallHistorySummary
  sessionAppearances?: number
}

const route = useRoute()
const router = useRouter()
const capture = ref<Capture | null>(null)
const phoneNumbers = ref<PhoneNumberWithHistory[]>([])
const loading = ref(true)
const activeTab = ref<'numbers' | 'chat'>('numbers')
const selectedPhoneData = ref<(DetectedPhoneNumber & { comments: PhoneNumberComment[] }) | null>(null)
const isModalOpen = ref(false)
const historyPhoneData = ref<PhoneNumberWithHistory | null>(null)
const isHistoryModalOpen = ref(false)
const selectedFilters = ref<(ContactStatus | 'all')[]>(['all'])
const searchQuery = ref('')
const sortBy = ref<'newest' | 'oldest' | 'alphabetical'>('newest')

const statusCounts = computed(() => {
  const counts: Record<ContactStatus | 'all', number> = {
    all: phoneNumbers.value.length,
    not_called: 0,
    called_no_answer: 0,
    called_answered: 0,
    confirmed: 0,
    declined: 0,
    callback_requested: 0,
    invalid_contact: 0,
    completed: 0
  }

  phoneNumbers.value.forEach(phone => {
    counts[phone.contact_status]++
  })

  return counts
})

const filteredPhoneNumbers = computed(() => {
  let filtered = phoneNumbers.value

  if (!selectedFilters.value.includes('all')) {
    filtered = filtered.filter(phone =>
      selectedFilters.value.includes(phone.contact_status)
    )
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(phone =>
      phone.phone_number.toLowerCase().includes(query) ||
      phone.username?.toLowerCase().includes(query) ||
      phone.contact_status.toLowerCase().includes(query)
    )
  }

  const sorted = [...filtered]
  if (sortBy.value === 'newest') {
    sorted.sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime())
  } else if (sortBy.value === 'oldest') {
    sorted.sort((a, b) => new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime())
  } else if (sortBy.value === 'alphabetical') {
    sorted.sort((a, b) => {
      const nameA = a.username || a.phone_number
      const nameB = b.username || b.phone_number
      return nameA.localeCompare(nameB)
    })
  }

  return sorted
})

const hasActiveFilters = computed(() => {
  return !selectedFilters.value.includes('all')
})

const allComments = computed(() => {
  const comments: (PhoneNumberComment & { phone_number: string })[] = []
  phoneNumbers.value.forEach(phone => {
    phone.comments.forEach(comment => {
      comments.push({
        ...comment,
        phone_number: phone.phone_number
      })
    })
  })
  return comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

function getStatusColor(status: ContactStatus) {
  const colors = {
    not_called: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900',
    called_no_answer: 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10',
    called_answered: 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/10',
    confirmed: 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10',
    declined: 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10',
    callback_requested: 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/10',
    invalid_contact: 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10',
    completed: 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10'
  }
  return colors[status]
}

function openCommentsModal(phoneData: DetectedPhoneNumber & { comments: PhoneNumberComment[] }) {
  selectedPhoneData.value = phoneData
  isModalOpen.value = true
}

function closeCommentsModal() {
  isModalOpen.value = false
  selectedPhoneData.value = null
}

function openHistoryModal(phoneData: PhoneNumberWithHistory) {
  historyPhoneData.value = phoneData
  isHistoryModalOpen.value = true
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false
  historyPhoneData.value = null
}

function handleStatusChange(phoneNumberId: string, newStatus: ContactStatus) {
  const index = phoneNumbers.value.findIndex(p => p.id === phoneNumberId)
  if (index !== -1) {
    phoneNumbers.value[index].contact_status = newStatus
    phoneNumbers.value[index].status_updated_at = new Date().toISOString()
  }
}

async function fetchCapture() {
  loading.value = true
  try {
    capture.value = await mockDataService.getCapture(route.params.id as string)
    if (capture.value) {
      const numbers = await mockDataService.getPhoneNumbers(capture.value.id)

      const numbersWithHistory = await Promise.all(
        numbers.map(async (number) => {
          const [callHistory, sessionAppearances] = await Promise.all([
            mockDataService.getCallHistorySummary(number.phone_number),
            mockDataService.getNumberAppearanceCount(number.phone_number, capture.value!.id)
          ])
          return {
            ...number,
            callHistory,
            sessionAppearances
          }
        })
      )

      phoneNumbers.value = numbersWithHistory
    }
  } catch (error) {
    console.error('Error fetching capture:', error)
  } finally {
    loading.value = false
  }
}

async function stopCapture() {
  try {
    await mockDataService.stopCapture(route.params.id as string)
    if (capture.value) {
      capture.value.status = 'stopped'
      capture.value.stopped_at = new Date().toISOString()
    }
  } catch (error) {
    console.error('Error stopping capture:', error)
  }
}

onMounted(() => {
  fetchCapture()
})
</script>
