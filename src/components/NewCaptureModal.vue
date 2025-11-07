<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <PlusCircleIcon class="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">New Capture</h2>
              <p class="text-sm text-blue-100">Choose your capture type</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <XIcon class="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Capture Type
          </label>
          <div class="grid grid-cols-1 gap-3">
            <button
              type="button"
              @click="captureType = 'normal'"
              :class="[
                'relative p-5 rounded-xl border-2 transition-all duration-200 text-left group',
                captureType === 'normal'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                  :class="captureType === 'normal' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40'"
                >
                  <VideoIcon class="w-6 h-6" :class="captureType === 'normal' ? 'text-white' : 'text-gray-600 dark:text-gray-400'" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Normal Capture</h3>
                    <span v-if="captureType === 'normal'" class="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                      Selected
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Standard capture mode for monitoring TikTok live streams and collecting phone numbers
                  </p>
                </div>
                <div v-if="captureType === 'normal'" class="flex-shrink-0">
                  <CheckCircleIcon class="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </button>

            <button
              type="button"
              @click="captureType = 'code-based'"
              :class="[
                'relative p-5 rounded-xl border-2 transition-all duration-200 text-left group',
                captureType === 'code-based'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg shadow-orange-500/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                  :class="captureType === 'code-based' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40'"
                >
                  <CodeIcon class="w-6 h-6" :class="captureType === 'code-based' ? 'text-white' : 'text-gray-600 dark:text-gray-400'" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Capture with Code</h3>
                    <span v-if="captureType === 'code-based'" class="px-2 py-0.5 bg-orange-600 text-white text-xs font-bold rounded-full">
                      Selected
                    </span>
                    <span class="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-orange-500 text-white text-xs font-black rounded-full">
                      NEW
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Organize captures by product codes with photos and purchase tracking
                  </p>
                </div>
                <div v-if="captureType === 'code-based'" class="flex-shrink-0">
                  <CheckCircleIcon class="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="captureType === 'normal'">
          <label for="page" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Select Page <span class="text-red-500">*</span>
          </label>
          <select
            id="page"
            v-model="selectedPageId"
            required
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Choose a page...</option>
            <option v-for="page in pages" :key="page.id" :value="page.id">
              {{ page.page_name }}
            </option>
          </select>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Select the TikTok page to monitor for this capture session
          </p>
        </div>

        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-center gap-2">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || (captureType === 'normal' && !selectedPageId)"
            class="flex-1 px-6 py-3 font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :class="captureType === 'code-based'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/30'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/30'"
          >
            <component :is="loading ? LoaderIcon : PlayIcon" :class="loading ? 'animate-spin' : ''" class="w-5 h-5" />
            {{ loading ? 'Creating...' : captureType === 'code-based' ? 'Start Code Capture' : 'Start Capture' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockDataService } from '@/lib/mockData'
import type { Page } from '@/lib/mockData'
import { X as XIcon, PlusCircle as PlusCircleIcon, Video as VideoIcon, Code as CodeIcon, CheckCircle as CheckCircleIcon, Play as PlayIcon, Loader as LoaderIcon } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
  created: []
}>()

const router = useRouter()
const pages = ref<Page[]>([])
const selectedPageId = ref('')
const captureType = ref<'normal' | 'code-based'>('normal')
const loading = ref(false)
const error = ref('')

async function fetchPages() {
  try {
    const allPages = await mockDataService.getPages()
    pages.value = allPages.filter(p => p.is_active)
  } catch (err: any) {
    console.error('Error fetching pages:', err)
    error.value = 'Failed to load pages'
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (captureType.value === 'code-based') {
      emit('close')
      await router.push('/live-code-capture')
    } else {
      const capture = await mockDataService.createCapture(selectedPageId.value)
      emit('close')
      await router.push(`/capture/${capture.id}`)
    }
  } catch (err: any) {
    console.error('Error creating capture:', err)
    error.value = err.message || 'Failed to create capture'
    loading.value = false
  }
}

onMounted(() => {
  fetchPages()
})
</script>
