<template>
  <AppLayout>
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pages</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your TikTok pages for monitoring</p>
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Your Pages</h2>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center space-x-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Add Page</span>
          </button>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <p class="text-gray-600 dark:text-gray-400">Loading pages...</p>
        </div>

        <div v-else-if="pages.length === 0" class="p-16 text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <FileTextIcon class="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No pages yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Add your first TikTok page to start monitoring</p>
          <button
            @click="showAddModal = true"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Add Page
          </button>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
          <div
            v-for="page in pages"
            :key="page.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ page.page_name }}</h3>
                  <span
                    :class="[
                      'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                      page.is_active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    ]"
                  >
                    {{ page.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <a
                  :href="page.page_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ page.page_url }}
                </a>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Added {{ new Date(page.created_at).toLocaleString() }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="togglePageStatus(page)"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {{ page.is_active ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                  @click="deletePage(page.id)"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showAddModal = false"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Page</h2>
          <button
            @click="showAddModal = false"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form @submit.prevent="handleAddPage" class="p-6 space-y-4">
          <div>
            <label for="pageName" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Page Name
            </label>
            <input
              id="pageName"
              v-model="newPage.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="My TikTok Page"
            />
          </div>

          <div>
            <label for="pageUrl" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Page URL
            </label>
            <input
              id="pageUrl"
              v-model="newPage.url"
              type="url"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="https://tiktok.com/@username"
            />
          </div>

          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <div class="flex space-x-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Adding...' : 'Add Page' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import type { Page } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout.vue'
import { Plus as PlusIcon, FileText as FileTextIcon, X as XIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const pages = ref<Page[]>([])
const loading = ref(true)
const showAddModal = ref(false)
const submitting = ref(false)
const error = ref('')

const newPage = ref({
  name: '',
  url: ''
})

async function fetchPages() {
  loading.value = true
  try {
    const { data, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', authStore.user?.id)
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    pages.value = data || []
  } catch (err) {
    console.error('Error fetching pages:', err)
  } finally {
    loading.value = false
  }
}

async function handleAddPage() {
  submitting.value = true
  error.value = ''

  try {
    const { data, error: createError } = await supabase
      .from('pages')
      .insert({
        user_id: authStore.user?.id,
        page_name: newPage.value.name,
        page_url: newPage.value.url,
        is_active: true
      })
      .select()
      .single()

    if (createError) throw createError

    pages.value.unshift(data)
    showAddModal.value = false
    newPage.value = { name: '', url: '' }
  } catch (err: any) {
    console.error('Error creating page:', err)
    error.value = err.message || 'Failed to create page'
  } finally {
    submitting.value = false
  }
}

async function togglePageStatus(page: Page) {
  try {
    const { error: updateError } = await supabase
      .from('pages')
      .update({ is_active: !page.is_active })
      .eq('id', page.id)

    if (updateError) throw updateError

    const index = pages.value.findIndex(p => p.id === page.id)
    if (index !== -1) {
      pages.value[index].is_active = !pages.value[index].is_active
    }
  } catch (err) {
    console.error('Error updating page:', err)
  }
}

async function deletePage(pageId: string) {
  if (!confirm('Are you sure you want to delete this page?')) return

  try {
    const { error: deleteError } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)

    if (deleteError) throw deleteError

    pages.value = pages.value.filter(p => p.id !== pageId)
  } catch (err) {
    console.error('Error deleting page:', err)
  }
}

onMounted(() => {
  fetchPages()
})
</script>
