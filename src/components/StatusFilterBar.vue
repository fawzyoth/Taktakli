<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filter by Status</h3>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1"
      >
        <XIcon class="w-4 h-4" />
        Clear Filters
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        @click="toggleFilter('all')"
        :class="[
          'relative px-4 py-3 rounded-lg border-2 text-left transition-all duration-200',
          selectedFilters.includes('all')
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">All</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View everything</div>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ statusCounts.all }}
          </div>
        </div>
        <div
          v-if="selectedFilters.includes('all')"
          class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <CheckIcon class="w-3 h-3 text-white" />
        </div>
      </button>

      <button
        v-for="status in statuses"
        :key="status.value"
        @click="toggleFilter(status.value)"
        :class="[
          'relative px-4 py-3 rounded-lg border-2 text-left transition-all duration-200',
          selectedFilters.includes(status.value)
            ? `border-${status.color}-500 bg-${status.color}-50 dark:bg-${status.color}-900/20 shadow-md`
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        ]"
        :style="selectedFilters.includes(status.value) ? getStatusStyle(status.color) : {}"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ status.label }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ status.description }}
            </div>
          </div>
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            {{ statusCounts[status.value] || 0 }}
          </div>
        </div>
        <div
          v-if="selectedFilters.includes(status.value)"
          :class="`absolute top-2 right-2 w-5 h-5 bg-${status.color}-500 rounded-full flex items-center justify-center`"
          :style="{ backgroundColor: getColorValue(status.color) }"
        >
          <CheckIcon class="w-3 h-3 text-white" />
        </div>
      </button>
    </div>

    <div v-if="hasActiveFilters && !selectedFilters.includes('all')" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
        <div
          v-for="filter in activeFilterLabels"
          :key="filter.value"
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          :style="{
            backgroundColor: `${getColorValue(filter.color)}20`,
            color: getColorValue(filter.color)
          }"
        >
          {{ filter.label }}
          <button
            @click="toggleFilter(filter.value)"
            class="hover:opacity-70 transition"
          >
            <XIcon class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X as XIcon, Check as CheckIcon } from 'lucide-vue-next'
import type { ContactStatus } from '@/lib/mockData'

interface StatusDefinition {
  value: ContactStatus
  label: string
  description: string
  color: string
}

const statuses: StatusDefinition[] = [
  { value: 'not_called', label: 'Not Called', description: 'Pending call', color: 'gray' },
  { value: 'called_no_answer', label: 'No Answer', description: 'Called but no answer', color: 'yellow' },
  { value: 'called_answered', label: 'Called', description: 'Call answered', color: 'blue' },
  { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed', color: 'green' },
  { value: 'declined', label: 'Declined', description: 'Order declined', color: 'red' },
  { value: 'callback_requested', label: 'Callback', description: 'Requested callback', color: 'purple' },
  { value: 'invalid_contact', label: 'Invalid', description: 'Invalid contact', color: 'orange' },
  { value: 'completed', label: 'Completed', description: 'Process completed', color: 'emerald' }
]

interface Props {
  statusCounts: Record<ContactStatus | 'all', number>
  selectedFilters: (ContactStatus | 'all')[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedFilters': [filters: (ContactStatus | 'all')[]]
}>()

const hasActiveFilters = computed(() => {
  return props.selectedFilters.length > 0 && !props.selectedFilters.includes('all')
})

const activeFilterLabels = computed(() => {
  return props.selectedFilters
    .filter(f => f !== 'all')
    .map(f => statuses.find(s => s.value === f))
    .filter(Boolean) as StatusDefinition[]
})

function toggleFilter(status: ContactStatus | 'all') {
  let newFilters: (ContactStatus | 'all')[] = [...props.selectedFilters]

  if (status === 'all') {
    newFilters = ['all']
  } else {
    const allIndex = newFilters.indexOf('all')
    if (allIndex > -1) {
      newFilters.splice(allIndex, 1)
    }

    const index = newFilters.indexOf(status)
    if (index > -1) {
      newFilters.splice(index, 1)
      if (newFilters.length === 0) {
        newFilters = ['all']
      }
    } else {
      newFilters.push(status)
    }
  }

  emit('update:selectedFilters', newFilters)
}

function clearFilters() {
  emit('update:selectedFilters', ['all'])
}

function getStatusStyle(color: string) {
  const colorValue = getColorValue(color)
  return {
    borderColor: colorValue,
    backgroundColor: `${colorValue}15`
  }
}

function getColorValue(color: string): string {
  const colors: Record<string, string> = {
    gray: '#6B7280',
    yellow: '#EAB308',
    blue: '#3B82F6',
    green: '#22C55E',
    red: '#EF4444',
    purple: '#A855F7',
    orange: '#F97316',
    emerald: '#10B981'
  }
  return colors[color] || colors.blue
}
</script>
