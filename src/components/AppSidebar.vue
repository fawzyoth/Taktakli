<template>
  <aside class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
    <div class="p-6 border-b border-gray-200 dark:border-gray-800">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        TikTok Monitor
      </h1>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors"
        :class="isActive(item.path)
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
      <button
        @click="toggleTheme"
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
      >
        <component :is="themeIcon" class="w-5 h-5" />
        <span>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>

      <button
        @click="handleSignOut"
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
      >
        <LogOutIcon class="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { LayoutDashboard, Video, FileText, Sun, Moon, LogOut as LogOutIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Pages', path: '/pages', icon: FileText }
]

const themeIcon = computed(() => themeStore.isDark ? Sun : Moon)

function isActive(path: string) {
  return route.path === path
}

function toggleTheme() {
  themeStore.toggleTheme()
}

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>
