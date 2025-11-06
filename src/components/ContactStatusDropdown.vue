<template>
  <div>
    <button
      @click="isOpen = true"
      :disabled="updating"
      :class="[
        'flex items-center space-x-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 hover:shadow-md',
        currentOption.colorClass,
        currentOption.bgClass,
        currentOption.borderClass,
        updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      aria-label="Change contact status"
      aria-haspopup="dialog"
    >
      <component :is="currentOption.icon" class="w-4 h-4" />
      <span>{{ currentOption.label }}</span>
      <ChevronDownIcon class="w-4 h-4" />
    </button>

    <teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-md"
        @click="isOpen = false"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[85vh] overflow-hidden"
          @click.stop
        >
          <div class="flex items-center justify-between px-6 py-5 border-b-2 border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
            <h2 class="text-lg font-bold text-blue-900 dark:text-blue-100">
              Select Contact Status
            </h2>
            <button
              @click="isOpen = false"
              class="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-all"
              aria-label="Close modal"
            >
              <XIcon class="w-5 h-5 text-blue-700 dark:text-blue-300" />
            </button>
          </div>

          <div class="overflow-y-auto max-h-[calc(85vh-5rem)] overscroll-contain">
            <div class="p-4">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="handleStatusChange(option.value)"
                :disabled="updating"
                :class="[
                  'w-full flex items-start space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 mb-2',
                  option.value === currentStatus
                    ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-300 dark:ring-blue-700 shadow-md'
                    : 'hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:shadow-sm',
                  updating ? 'opacity-50 cursor-not-allowed' : ''
                ]"
                role="option"
                :aria-selected="option.value === currentStatus"
              >
                <div :class="['flex-shrink-0 p-2.5 rounded-lg shadow-sm', option.bgClass]">
                  <component :is="option.icon" :class="['w-4 h-4', option.colorClass]" />
                </div>
                <div class="flex-1 text-left min-w-0">
                  <div :class="['font-bold text-sm', option.colorClass]">
                    {{ option.label }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {{ option.description }}
                  </div>
                </div>
                <div v-if="option.value === currentStatus" class="flex-shrink-0 self-center">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center shadow-md">
                    <CheckIcon class="w-4 h-4 text-white" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <DeliveryConfirmationModal
      :is-open="showDeliveryModal"
      @close="handleDeliveryModalClose"
      @continue="handleDeliveryModalContinue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { mockDataService } from '@/lib/mockData'
import type { ContactStatus } from '@/lib/mockData'
import DeliveryConfirmationModal from './DeliveryConfirmationModal.vue'
import {
  Check as CheckIcon,
  Phone,
  PhoneOff,
  PhoneMissed,
  PhoneCall,
  XCircle,
  Clock,
  AlertCircle,
  X as XIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-vue-next'

interface StatusOption {
  value: ContactStatus
  label: string
  icon: any
  colorClass: string
  bgClass: string
  borderClass: string
  description: string
}

const props = defineProps<{
  phoneNumberId: string
  currentStatus: ContactStatus
}>()

const emit = defineEmits<{
  statusChanged: [newStatus: ContactStatus]
}>()

const isOpen = ref(false)
const updating = ref(false)
const showDeliveryModal = ref(false)

const statusOptions: StatusOption[] = [
  {
    value: 'not_called',
    label: 'Not Called',
    icon: Phone,
    colorClass: 'text-gray-700 dark:text-gray-300',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    borderClass: 'border-gray-300 dark:border-gray-600',
    description: 'No contact attempted yet',
  },
  {
    value: 'called_no_answer',
    label: 'Called - No Answer',
    icon: PhoneMissed,
    colorClass: 'text-yellow-700 dark:text-yellow-300',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderClass: 'border-yellow-400 dark:border-yellow-600',
    description: 'Call made but no response',
  },
  {
    value: 'called_answered',
    label: 'Called - Answered',
    icon: PhoneCall,
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    borderClass: 'border-blue-400 dark:border-blue-600',
    description: 'Contact made and responded',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    icon: CheckIcon,
    colorClass: 'text-green-700 dark:text-green-300',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    borderClass: 'border-green-400 dark:border-green-600',
    description: 'Final confirmation received',
  },
  {
    value: 'declined',
    label: 'Declined',
    icon: XCircle,
    colorClass: 'text-red-700 dark:text-red-300',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    borderClass: 'border-red-400 dark:border-red-600',
    description: 'Person declined or refused',
  },
  {
    value: 'callback_requested',
    label: 'Callback Requested',
    icon: Clock,
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    borderClass: 'border-purple-400 dark:border-purple-600',
    description: 'Asked to be contacted later',
  },
  {
    value: 'invalid_contact',
    label: 'Invalid Contact',
    icon: AlertCircle,
    colorClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    borderClass: 'border-orange-400 dark:border-orange-600',
    description: "Phone number doesn't work",
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: CheckIcon,
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderClass: 'border-emerald-400 dark:border-emerald-600',
    description: 'Process fully finished',
  },
]

const currentOption = computed(() => {
  return statusOptions.find((opt) => opt.value === props.currentStatus) || statusOptions[0]
})

async function handleStatusChange(newStatus: ContactStatus) {
  if (newStatus === props.currentStatus) {
    isOpen.value = false
    return
  }

  isOpen.value = false

  if (newStatus === 'confirmed') {
    showDeliveryModal.value = true
    return
  }

  await updateStatus(newStatus)
}

async function updateStatus(newStatus: ContactStatus) {
  updating.value = true
  try {
    await mockDataService.updatePhoneNumberStatus(props.phoneNumberId, newStatus)
    emit('statusChanged', newStatus)
  } catch (err) {
    console.error('Error updating status:', err)
  } finally {
    updating.value = false
  }
}

function handleDeliveryModalClose() {
  showDeliveryModal.value = false
}

async function handleDeliveryModalContinue() {
  showDeliveryModal.value = false
  await updateStatus('confirmed')
  console.log('User confirmed - redirect to bordereau form')
}

watch(isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
})
</script>
