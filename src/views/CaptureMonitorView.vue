<template>
  <AppLayout>
    <div class="p-8">
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

          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Capture Monitor
              </h1>
              <p class="text-gray-600 dark:text-gray-400">
                Started {{ new Date(capture.started_at).toLocaleString() }}
              </p>
            </div>

            <button
              v-if="capture.status === 'active'"
              @click="stopCapture"
              class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Stop Capture
            </button>
            <span
              v-else
              class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 font-semibold rounded-lg"
            >
              Stopped
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <nav class="flex space-x-8 px-6">
              <button
                @click="activeTab = 'numbers'"
                :class="[
                  'py-4 px-2 font-semibold border-b-2 transition',
                  activeTab === 'numbers'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Phone Numbers ({{ phoneNumbers.length }})
              </button>
              <button
                @click="activeTab = 'chat'"
                :class="[
                  'py-4 px-2 font-semibold border-b-2 transition',
                  activeTab === 'chat'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                ]"
              >
                Live Chat ({{ allComments.length }})
              </button>
            </nav>
          </div>

          <div class="p-6">
            <div v-if="activeTab === 'numbers'">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Phone Numbers</h2>

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

              <div v-else class="space-y-4">
                <div
                  v-for="phoneData in phoneNumbers"
                  :key="phoneData.id"
                  :class="[
                    'rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-lg',
                    getStatusColor(phoneData.contact_status)
                  ]"
                >
                  <div class="flex items-start justify-between gap-4 mb-4">
                    <div class="flex items-start space-x-3 flex-1">
                      <div class="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {{ phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?' }}
                      </div>

                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="font-bold text-gray-900 dark:text-white">
                            {{ phoneData.username || 'Anonymous User' }}
                          </span>
                          <span class="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
                            NEW
                          </span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm">
                          <span class="font-mono font-bold text-lg text-gray-900 dark:text-white">
                            {{ phoneData.phone_number }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ new Date(phoneData.detected_at).toLocaleString() }}
                        </div>
                      </div>
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
import { ArrowLeft as ArrowLeftIcon, Eye as EyeIcon, Heart as HeartIcon, MessageCircle as MessageCircleIcon, Phone as PhoneIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const capture = ref<Capture | null>(null)
const phoneNumbers = ref<(DetectedPhoneNumber & { comments: PhoneNumberComment[] })[]>([])
const loading = ref(true)
const activeTab = ref<'numbers' | 'chat'>('numbers')
const selectedPhoneData = ref<(DetectedPhoneNumber & { comments: PhoneNumberComment[] }) | null>(null)
const isModalOpen = ref(false)

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
      phoneNumbers.value = await mockDataService.getPhoneNumbers(capture.value.id)
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
