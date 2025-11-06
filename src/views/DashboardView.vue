<template>
  <AppLayout>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitor your TikTok captures and phone numbers</p>
      </div>

      <button
        @click="showDeliveryModal = true"
        class="w-full mb-6 sm:mb-8 group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-emerald-500/50 border border-white/10"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32 group-hover:translate-x-24 group-hover:-translate-y-24 transition-transform duration-700"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl transform -translate-x-24 translate-y-24 group-hover:-translate-x-16 group-hover:translate-y-16 transition-transform duration-700"></div>

        <div class="relative px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-black/10 border border-white/20">
              <svg class="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-black rounded-full uppercase tracking-wide shadow-lg">
                  Offre Exclusive
                </span>
              </div>
              <p class="text-xl sm:text-2xl font-black mb-1.5 leading-tight drop-shadow-md">
                Le retour est à 0 DT, vous ne prenez aucun risque dès aujourd'hui
              </p>
              <p class="text-sm sm:text-base text-white/95 font-semibold flex items-center gap-2">
                <span class="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Découvrez notre offre exclusive de livraison avec Shopa.ovh & Axess Logistique
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3.5 rounded-xl group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300 flex-shrink-0 shadow-lg border border-white/30">
            <span class="font-black text-sm sm:text-base whitespace-nowrap drop-shadow">En savoir plus</span>
            <svg class="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
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
