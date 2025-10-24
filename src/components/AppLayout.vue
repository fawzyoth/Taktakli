<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
    <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="flex-1 overflow-y-auto w-full lg:w-auto">
      <div class="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">TikTok Monitor</h2>
        <button
          @click="sidebarOpen = true"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <MenuIcon class="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import { Menu as MenuIcon } from 'lucide-vue-next'

const sidebarOpen = ref(false)
</script>
