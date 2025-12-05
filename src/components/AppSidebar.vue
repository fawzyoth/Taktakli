<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        TikTok Monitor
      </h1>
      <button
        @click="$emit('close')"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <XIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.path"
        @click="$emit('close')"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors"
        :class="isActive(item.path)
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
      <button
        @click="$emit('openPartnership')"
        class="w-full p-4 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-2 border-blue-200 dark:border-blue-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer group"
      >
        <img
          src="/Design sans titre (1).png"
          alt="Partnership Delivery"
          class="w-full h-auto object-contain"
        />
        <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
          Special Delivery Offer
        </p>
      </button>

      <button
        @click="toggleTheme"
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
      >
        <component :is="themeIcon" class="w-5 h-5" />
        <span>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </aside>

  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { LayoutDashboard, FileText, Package, ShoppingBag, Code, PackageCheck, Sun, Moon, X as XIcon, Phone } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
  openPartnership: []
}>()

const route = useRoute()
const themeStore = useThemeStore()

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Code Capture', path: '/live-code-capture', icon: Code },
  { name: 'Numbers', path: '/numbers', icon: Phone },
  { name: 'Pages', path: '/pages', icon: FileText },
  { name: 'Livraison', path: '/livraison', icon: Package },
  { name: 'Vérif. Retours', path: '/return-verification', icon: PackageCheck },
  { name: 'Shop', path: '/shop', icon: ShoppingBag }
]

const themeIcon = computed(() => themeStore.isDark ? Sun : Moon)

function isActive(path: string) {
  return route.path === path
}

function toggleTheme() {
  themeStore.toggleTheme()
}
</script>
