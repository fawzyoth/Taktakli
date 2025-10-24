<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitor your TikTok captures and phone numbers</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Captures</span>
            <VideoIcon class="w-5 h-5 text-green-500" />
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.activeCaptures }}</p>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Numbers</span>
            <PhoneIcon class="w-5 h-5 text-blue-500" />
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalNumbers }}</p>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</span>
            <EyeIcon class="w-5 h-5 text-purple-500" />
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalViews.toLocaleString() }}</p>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</span>
            <MessageCircleIcon class="w-5 h-5 text-orange-500" />
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalComments }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Captures</h2>
          <button
            @click="showNewCaptureModal = true"
            class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>New Capture</span>
          </button>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">Loading captures...</p>
        </div>

        <div v-else-if="captures.length === 0" class="p-16 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <VideoIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No captures yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Create your first capture to start monitoring</p>
          <button
            @click="showNewCaptureModal = true"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Create Capture
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="capture in captures"
            :key="capture.id"
            @click="$router.push(`/capture/${capture.id}`)"
            class="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center space-x-3 sm:space-x-4">
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  capture.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                ]">
                  <VideoIcon :class="[
                    'w-6 h-6',
                    capture.status === 'active'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  ]" />
                </div>
                <div>
                  <p class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{ capture.page_name }}</p>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Started {{ new Date(capture.started_at).toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div class="text-center flex-1 sm:flex-none">
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Numbers</p>
                  <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ capture.phone_count || 0 }}</p>
                </div>
                <div class="text-center flex-1 sm:flex-none">
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Views</p>
                  <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ capture.total_views.toLocaleString() }}</p>
                </div>
                <div class="text-center flex-1 sm:flex-none">
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span :class="[
                    'inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full',
                    capture.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  ]">
                    {{ capture.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NewCaptureModal
      v-if="showNewCaptureModal"
      @close="showNewCaptureModal = false"
      @created="handleCaptureCreated"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockDataService } from '@/lib/mockData'
import type { Capture } from '@/lib/mockData'
import AppLayout from '@/components/AppLayout.vue'
import NewCaptureModal from '@/components/NewCaptureModal.vue'
import { Video as VideoIcon, Phone as PhoneIcon, Eye as EyeIcon, MessageCircle as MessageCircleIcon, Plus as PlusIcon } from 'lucide-vue-next'

const router = useRouter()
const captures = ref<Capture[]>([])
const loading = ref(true)
const showNewCaptureModal = ref(false)

const stats = computed(() => {
  return {
    activeCaptures: captures.value.filter(c => c.status === 'active').length,
    totalNumbers: captures.value.reduce((sum, c) => sum + (c.phone_count || 0), 0),
    totalViews: captures.value.reduce((sum, c) => sum + c.total_views, 0),
    totalComments: captures.value.reduce((sum, c) => sum + c.total_comments, 0)
  }
})

async function fetchCaptures() {
  loading.value = true
  try {
    captures.value = await mockDataService.getCaptures()
  } catch (error) {
    console.error('Error fetching captures:', error)
  } finally {
    loading.value = false
  }
}

function handleCaptureCreated() {
  showNewCaptureModal.value = false
  fetchCaptures()
}

onMounted(() => {
  fetchCaptures()
})
</script>
