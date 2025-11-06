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
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in relative"
        @click.stop
      >
        <button
          @click="handleClose"
          class="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div class="p-8 space-y-6">
          <div class="text-center space-y-3">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <img
                src="/Design sans titre.png"
                alt="Delivery Partners"
                class="w-full h-16 object-contain"
              />
            </div>
            <h2 id="delivery-modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">
              Special Delivery Offer
            </h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <PackageIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span class="font-semibold text-gray-900 dark:text-white">Delivery</span>
              </div>
              <span class="text-2xl font-bold text-gray-900 dark:text-white">7 DT</span>
            </div>

            <div class="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-500 dark:border-green-600">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                    <RotateCcwIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white">Return</p>
                    <p class="text-sm text-green-700 dark:text-green-400">Verified fast & easy</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 dark:text-gray-400 line-through">7 DT</p>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">FREE</p>
                </div>
              </div>
              <div class="flex items-center space-x-2 pt-3 border-t border-green-200 dark:border-green-700">
                <ClockIcon class="w-4 h-4 text-green-600 dark:text-green-400" />
                <p class="text-sm text-gray-700 dark:text-gray-300">Only 2 minutes to prepare</p>
              </div>
            </div>

            <div class="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-2 border-orange-300 dark:border-orange-600">
              <div class="flex items-start space-x-3 mb-3">
                <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PercentIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-900 dark:text-white mb-2">Volume Discounts</p>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-700 dark:text-gray-300">300-500 colis/month</span>
                      <span class="font-bold text-orange-600 dark:text-orange-400">50% OFF</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-700 dark:text-gray-300">500+ colis/month</span>
                      <span class="font-bold text-orange-600 dark:text-orange-400">100% FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="handleContinue"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRightIcon class="w-5 h-5" />
          </button>

          <button
            @click="handleClose"
            class="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium py-2 transition-colors text-sm"
          >
            Maybe later
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
  Package as PackageIcon,
  RotateCcw as RotateCcwIcon,
  Clock as ClockIcon,
  Percent as PercentIcon,
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
