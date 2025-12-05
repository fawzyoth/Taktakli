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

    <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-800/50">
      <div class="mb-3">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <SearchIcon class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Quick Number Lookup</h3>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 ml-10">Find any phone number instantly</p>
      </div>

      <div class="relative">
        <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          @input="handleInput"
          type="text"
          placeholder="e.g., +1 555-123-4567"
          class="w-full pl-9 pr-10 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''; searchResults = []"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>

      <div v-if="searchResults.length > 0" class="mt-2 bg-white dark:bg-gray-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg max-h-64 overflow-y-auto">
        <div class="p-2">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">{{ searchResults.length }} result{{ searchResults.length > 1 ? 's' : '' }} found</p>
          <button
            v-for="result in searchResults"
            :key="result.id"
            @click="selectResult(result)"
            class="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {{ result.username ? result.username.charAt(0).toUpperCase() : '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ result.username || 'Anonymous' }}
                </p>
                <p class="font-mono text-xs text-gray-600 dark:text-gray-400 truncate">{{ result.phone_number }}</p>
              </div>
              <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: getStatusColor(result.contact_status) }"></div>
            </div>
          </button>
        </div>
      </div>

      <button
        @click="handleSearch"
        :disabled="!searchQuery.trim()"
        class="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none"
      >
        <SearchIcon class="w-4 h-4" />
        {{ searchQuery.trim() ? 'Search Now' : 'Enter a Number' }}
      </button>

      <div class="mt-3 p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p class="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
          <span class="text-blue-600 dark:text-blue-400 font-bold mt-0.5">💡</span>
          <span><strong>Tip:</strong> You can search with or without formatting</span>
        </p>
      </div>
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
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { mockDataService } from '@/lib/mockData'
import { LayoutDashboard, FileText, Package, ShoppingBag, Code, PackageCheck, Sun, Moon, X as XIcon, Search as SearchIcon } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  openPartnership: []
  openNumberSearch: [phoneNumber: string]
}>()

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)

const route = useRoute()
const themeStore = useThemeStore()

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Code Capture', path: '/live-code-capture', icon: Code },
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

async function handleInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  const query = searchQuery.value.trim()
  if (!query || query.length < 3) {
    searchResults.value = []
    return
  }

  searchTimeout.value = setTimeout(async () => {
    try {
      const allNumbers = await mockDataService.getAllPhoneNumbers()
      const filtered = allNumbers.filter(phone =>
        phone.phone_number.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        phone.username?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
      searchResults.value = filtered
    } catch (error) {
      console.error('Error searching:', error)
      searchResults.value = []
    }
  }, 300)
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    emit('openNumberSearch', searchQuery.value.trim())
    searchQuery.value = ''
    searchResults.value = []
  }
}

function selectResult(result: any) {
  emit('openNumberSearch', result.phone_number)
  searchQuery.value = ''
  searchResults.value = []
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    not_called: '#6B7280',
    called_no_answer: '#EAB308',
    called_answered: '#3B82F6',
    confirmed: '#22C55E',
    declined: '#EF4444',
    callback_requested: '#A855F7',
    invalid_contact: '#F97316',
    completed: '#10B981'
  }
  return colors[status] || '#6B7280'
}
</script>
