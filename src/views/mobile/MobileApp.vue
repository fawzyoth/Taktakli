<template>
  <div class="mobile-app min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 z-40">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Truck class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">Taktakli</h1>
            <p class="text-xs text-gray-500">{{ currentPageTitle }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="toggleNotifications" class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Bell class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadNotifications }}
            </span>
          </button>
          <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-orange-600" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20">
      <router-view />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 z-50">
      <div class="flex items-center justify-around">
        <router-link
          v-for="tab in navTabs"
          :key="tab.route"
          :to="tab.route"
          class="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors"
          :class="[
            isActiveRoute(tab.route)
              ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          ]"
        >
          <component :is="tab.icon" class="w-6 h-6" />
          <span class="text-xs mt-1 font-medium">{{ tab.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Notification Panel (Slide-up) -->
    <Transition name="slide-up">
      <div v-if="showNotificationPanel" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/50" @click="showNotificationPanel = false"></div>
        <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70vh] overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <button @click="showNotificationPanel = false" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div class="overflow-y-auto max-h-[50vh]">
            <div v-for="notif in recentNotifications" :key="notif.id" class="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div class="flex items-start space-x-3">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  notif.type === 'pickup' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  notif.type === 'delivery' ? 'bg-green-100 dark:bg-green-900/30' :
                  notif.type === 'return' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-gray-100 dark:bg-gray-800'
                ]">
                  <component :is="notif.icon" :class="[
                    'w-5 h-5',
                    notif.type === 'pickup' ? 'text-blue-600' :
                    notif.type === 'delivery' ? 'text-green-600' :
                    notif.type === 'return' ? 'text-red-600' :
                    'text-gray-600'
                  ]" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notif.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ notif.message }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ notif.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import {
  Truck,
  Bell,
  User,
  X,
  Home,
  ScanLine,
  RotateCcw,
  ClipboardList,
  Package,
  CheckCircle,
  AlertTriangle
} from 'lucide-vue-next'

const route = useRoute()

const navTabs = [
  { route: '/mobile', label: 'Accueil', icon: markRaw(Home) },
  { route: '/mobile/pickup', label: 'Pick up', icon: markRaw(ScanLine) },
  { route: '/mobile/return', label: 'Retour', icon: markRaw(RotateCcw) },
  { route: '/mobile/tasks', label: 'Tâches', icon: markRaw(ClipboardList) }
]

const showNotificationPanel = ref(false)
const unreadNotifications = ref(3)

const currentPageTitle = computed(() => {
  const currentTab = navTabs.find(tab => tab.route === route.path)
  return currentTab?.label || 'Livreur'
})

const isActiveRoute = (tabRoute: string) => {
  if (tabRoute === '/mobile') {
    return route.path === '/mobile'
  }
  return route.path.startsWith(tabRoute)
}

const toggleNotifications = () => {
  showNotificationPanel.value = !showNotificationPanel.value
}

const recentNotifications = ref([
  {
    id: 1,
    type: 'pickup',
    icon: markRaw(Package),
    title: 'Nouveau pickup assigné',
    message: '5 colis à récupérer - Zone Tunis Centre',
    time: 'Il y a 5 min'
  },
  {
    id: 2,
    type: 'delivery',
    icon: markRaw(CheckCircle),
    title: 'Livraison confirmée',
    message: 'Colis YAL-2026-001234 livré avec succès',
    time: 'Il y a 15 min'
  },
  {
    id: 3,
    type: 'return',
    icon: markRaw(AlertTriangle),
    title: 'Retour signalé',
    message: 'Client absent - 3ème tentative échouée',
    time: 'Il y a 30 min'
  }
])
</script>

<style scoped>
.mobile-app {
  max-width: 100vw;
  overflow-x: hidden;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from > div:last-child,
.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
