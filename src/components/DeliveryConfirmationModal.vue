<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click="handleClose"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-modal-title"
    >
      <div
        class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-800 w-full max-w-md transform transition-all duration-300 animate-scale-in"
        @click.stop
      >
        <div class="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-6 py-8 border-b-2 border-green-100 dark:border-green-900/40 text-center">
          <button
            @click="handleClose"
            class="absolute top-4 right-4 p-2 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <XIcon class="w-5 h-5 text-green-700 dark:text-green-300" />
          </button>

          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-once">
              <CheckCircleIcon class="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 id="delivery-modal-title" class="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
            Great Choice!
          </h2>
          <p class="text-green-700 dark:text-green-300 text-sm sm:text-base">
            Continue filling out the delivery bordereau to complete your order
          </p>
        </div>

        <div class="p-6 space-y-5">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div class="flex items-center justify-center h-32 sm:h-40 text-gray-400 dark:text-gray-600">
              <div class="text-center">
                <ImageIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p class="text-sm font-medium">Promotional Image</p>
                <p class="text-xs">Coming Soon</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800">
            <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
              <TruckIcon class="w-5 h-5 mr-2" />
              Special Delivery Offer
            </h3>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <PackageIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="font-semibold text-gray-800 dark:text-gray-200">Delivery Cost</span>
                </div>
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">7 DT</span>
              </div>

              <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border-2 border-green-300 dark:border-green-700 relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  FREE!
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <RotateCcwIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <span class="font-semibold text-gray-800 dark:text-gray-200 block">Return Cost</span>
                    <span class="text-xs text-green-700 dark:text-green-300 font-medium">Hassle-free returns</span>
                  </div>
                </div>
                <span class="text-2xl font-bold text-green-600 dark:text-green-400 line-through opacity-50">7 DT</span>
                <span class="text-2xl font-bold text-green-600 dark:text-green-400 ml-2">0 DT</span>
              </div>
            </div>
          </div>

          <button
            @click="handleContinue"
            class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Continue to Bordereau</span>
            <ArrowRightIcon class="w-5 h-5" />
          </button>

          <button
            @click="handleClose"
            class="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 transition-colors text-sm"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import {
  X as XIcon,
  CheckCircle as CheckCircleIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
  RotateCcw as RotateCcwIcon,
  Image as ImageIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  continue: []
}>()

function handleClose() {
  emit('close')
}

function handleContinue() {
  emit('continue')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-out;
}
</style>
