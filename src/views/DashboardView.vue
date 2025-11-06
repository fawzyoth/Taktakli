<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitor your TikTok captures and phone numbers</p>
      </div>

      <button
        @click="showDeliveryModal = true"
        class="w-full mb-6 sm:mb-8 group relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-orange-500/50 border-2 border-orange-400/40"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-400/15 to-blue-500/10 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

        <div class="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48 group-hover:translate-x-32 group-hover:-translate-y-32 transition-transform duration-700"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32 group-hover:-translate-x-16 group-hover:translate-y-16 transition-transform duration-700"></div>

        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTIgMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC4yIiBvcGFjaXR5PSIwLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div class="relative px-6 sm:px-8 py-7 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div class="flex items-center gap-5 sm:gap-6">
            <div class="relative flex-shrink-0">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-400 to-blue-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                <svg class="w-11 h-11 sm:w-14 sm:h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-black rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/50">
                  Offre Exclusive
                </span>
                <span class="flex items-center gap-1 text-orange-400 text-xs font-bold">
                  <svg class="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>Nouveau</span>
                </span>
              </div>
              <p class="text-xl sm:text-2xl font-black mb-2 leading-tight">
                Le retour est à <span class="text-orange-400">0 DT</span>, vous ne prenez aucun risque dès aujourd'hui
              </p>
              <p class="text-sm sm:text-base text-blue-100 font-medium flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></span>
                Découvrez notre offre exclusive de livraison avec <span class="text-orange-400 font-bold">Shopa.ovh & Axess Logistique</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-4 rounded-xl group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-orange-400/50 transition-all duration-300 flex-shrink-0 font-black text-sm sm:text-base shadow-xl">
            <span class="whitespace-nowrap">En savoir plus</span>
            <svg class="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </button>

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

    <DeliveryConfirmationModal
      :is-open="showDeliveryModal"
      @close="showDeliveryModal = false"
      @continue="handleDeliverySubmit"
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
import DeliveryConfirmationModal from '@/components/DeliveryConfirmationModal.vue'
import { Video as VideoIcon, Phone as PhoneIcon, Eye as EyeIcon, MessageCircle as MessageCircleIcon, Plus as PlusIcon } from 'lucide-vue-next'

const router = useRouter()
const captures = ref<Capture[]>([])
const loading = ref(true)
const showNewCaptureModal = ref(false)
const showDeliveryModal = ref(false)

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

function handleDeliverySubmit() {
  console.log('Delivery form submitted')
  showDeliveryModal.value = false
}

onMounted(() => {
  fetchCaptures()
})
</script>
