<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">New Capture</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <XIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label for="page" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Page
          </label>
          <select
            id="page"
            v-model="selectedPageId"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">Choose a page...</option>
            <option v-for="page in pages" :key="page.id" :value="page.id">
              {{ page.page_name }}
            </option>
          </select>
        </div>

        <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedPageId"
            class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating...' : 'Start Capture' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockDataService } from '@/lib/mockData'
import type { Page } from '@/lib/mockData'
import { X as XIcon } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
  created: []
}>()

const pages = ref<Page[]>([])
const selectedPageId = ref('')
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
    await mockDataService.createCapture(selectedPageId.value)
    emit('created')
  } catch (err: any) {
    console.error('Error creating capture:', err)
    error.value = err.message || 'Failed to create capture'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPages()
})
</script>
