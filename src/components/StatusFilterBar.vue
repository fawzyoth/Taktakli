<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 py-4 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200"
      :class="isExpanded ? 'border-b border-gray-200 dark:border-gray-700' : ''"
    >
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-1">
          <div :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
            isExpanded ? 'bg-blue-600 dark:bg-blue-500 shadow-lg' : 'bg-blue-500 dark:bg-blue-600'
          ]">
            <FilterIcon class="w-5 h-5 text-white" />
          </div>
          <div class="text-left flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Filter by Status
            </h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {{ isExpanded ? 'Click to filter, or select multiple statuses' : `${hasActiveFilters ? activeFilterLabels.length + ' filter(s) active' : 'No filters applied'}` }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="hasActiveFilters && !isExpanded"
            @click.stop="clearFilters"
            class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 border border-blue-600 dark:border-blue-400 rounded-lg transition-all duration-200 flex items-center gap-1"
          >
            <XIcon class="w-3.5 h-3.5" />
            Clear
          </button>
          <div :class="[
            'transition-transform duration-300',
            isExpanded ? 'rotate-180' : ''
          ]">
            <ChevronDownIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </button>

    <div
      v-show="isExpanded"
      class="overflow-hidden transition-all duration-300"
    >
      <div class="p-4 sm:p-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          @click="toggleFilter('all')"
          :class="[
            'group relative rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 hover:shadow-lg',
            selectedFilters.includes('all')
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg ring-2 ring-blue-200 dark:ring-blue-700'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
          ]"
        >
          <div class="px-3 py-4">
            <div class="flex items-center justify-center mb-2">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                selectedFilters.includes('all') ? 'bg-blue-500 shadow-lg' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-400'
              ]">
                <LayersIcon :class="[
                  'w-5 h-5',
                  selectedFilters.includes('all') ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-white'
                ]" />
              </div>
            </div>
            <div class="text-sm font-bold text-gray-900 dark:text-white mb-1">All</div>
            <div class="text-2xl font-black" :class="selectedFilters.includes('all') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'">
              {{ statusCounts.all }}
            </div>
          </div>
          <div
            v-if="selectedFilters.includes('all')"
            class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
          >
            <CheckIcon class="w-4 h-4 text-white" />
          </div>
        </button>

        <button
          v-for="status in statuses"
          :key="status.value"
          @click="toggleFilter(status.value)"
          :disabled="statusCounts[status.value] === 0"
          :class="[
            'group relative rounded-xl border-2 text-center transition-all duration-200',
            statusCounts[status.value] === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg cursor-pointer',
            selectedFilters.includes(status.value)
              ? 'shadow-lg ring-2'
              : 'bg-white dark:bg-gray-800'
          ]"
          :style="selectedFilters.includes(status.value) ? getSelectedStyle(status.color) : { borderColor: '#E5E7EB' }"
        >
          <div class="px-3 py-4">
            <div class="flex items-center justify-center mb-2">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                  statusCounts[status.value] === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''
                ]"
                :style="selectedFilters.includes(status.value) ? { backgroundColor: getColorValue(status.color) } : { backgroundColor: statusCounts[status.value] > 0 ? `${getColorValue(status.color)}20` : '' }"
              >
                <component
                  :is="status.icon"
                  :class="[
                    'w-5 h-5 transition-all',
                    selectedFilters.includes(status.value) ? 'text-white' : statusCounts[status.value] > 0 ? '' : 'text-gray-400 dark:text-gray-600'
                  ]"
                  :style="!selectedFilters.includes(status.value) && statusCounts[status.value] > 0 ? { color: getColorValue(status.color) } : {}"
                />
              </div>
            </div>
            <div class="text-xs font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {{ status.label }}
            </div>
            <div
              class="text-2xl font-black transition-all"
              :style="selectedFilters.includes(status.value) ? { color: getColorValue(status.color) } : { color: statusCounts[status.value] > 0 ? '' : '#9CA3AF' }"
            >
              {{ statusCounts[status.value] || 0 }}
            </div>
          </div>
          <div
            v-if="selectedFilters.includes(status.value)"
            class="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900"
            :style="{ backgroundColor: getColorValue(status.color) }"
          >
            <CheckIcon class="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

        <div v-if="hasActiveFilters && !selectedFilters.includes('all')" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <CheckCircleIcon class="w-4 h-4" />
              Active:
            </span>
            <div
              v-for="filter in activeFilterLabels"
              :key="filter.value"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all"
              :style="{
                backgroundColor: getColorValue(filter.color),
                color: '#FFFFFF'
              }"
            >
              <component :is="filter.icon" class="w-3.5 h-3.5" />
              {{ filter.label }}
              <button
                @click="toggleFilter(filter.value)"
                class="hover:bg-white/20 rounded-full p-0.5 transition-all"
              >
                <XIcon class="w-3 h-3" />
              </button>
            </div>
            <button
              @click="clearFilters"
              class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 border border-blue-600 dark:border-blue-400 rounded-lg transition-all duration-200 flex items-center gap-1"
            >
              <XIcon class="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  X as XIcon,
  Check as CheckIcon,
  Filter as FilterIcon,
  Layers as LayersIcon,
  Phone as PhoneIcon,
  PhoneOff as PhoneOffIcon,
  PhoneMissed as PhoneMissedIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronDown as ChevronDownIcon
} from 'lucide-vue-next'
import type { ContactStatus } from '@/lib/mockData'
import type { Component } from 'vue'

const isExpanded = ref(true)

interface StatusDefinition {
  value: ContactStatus
  label: string
  description: string
  color: string
  icon: Component
}

const statuses: StatusDefinition[] = [
  { value: 'not_called', label: 'Not Called', description: 'Pending call', color: 'gray', icon: PhoneIcon },
  { value: 'called_no_answer', label: 'No Answer', description: 'Called but no answer', color: 'yellow', icon: PhoneMissedIcon },
  { value: 'called_answered', label: 'Called', description: 'Call answered', color: 'blue', icon: PhoneIcon },
  { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed', color: 'green', icon: CheckCircleIcon },
  { value: 'declined', label: 'Declined', description: 'Order declined', color: 'red', icon: XCircleIcon },
  { value: 'callback_requested', label: 'Callback', description: 'Requested callback', color: 'purple', icon: ClockIcon },
  { value: 'invalid_contact', label: 'Invalid', description: 'Invalid contact', color: 'orange', icon: AlertCircleIcon },
  { value: 'completed', label: 'Completed', description: 'Process completed', color: 'emerald', icon: CheckCircle2Icon }
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

function getSelectedStyle(color: string) {
  const colorValue = getColorValue(color)
  return {
    borderColor: colorValue,
    backgroundColor: `${colorValue}10`,
    ringColor: `${colorValue}40`
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
