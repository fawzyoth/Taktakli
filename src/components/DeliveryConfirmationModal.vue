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
        class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-800 w-full max-w-md transform transition-all duration-300 animate-scale-in relative"
        @click.stop
      >
        <button
          @click="handleClose"
          class="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div class="p-6 space-y-5">
          <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <img
              src="/Design sans titre.png"
              alt="Delivery Partners"
              class="w-full h-20 object-contain"
            />
          </div>

          <div class="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/20 dark:via-green-950/20 dark:to-teal-950/20 rounded-2xl p-5 border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
            <div class="text-center mb-4">
              <h3 class="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">🎉 Exclusive Delivery Offer</h3>
              <p class="text-sm text-emerald-700 dark:text-emerald-300">Premium benefits for your business</p>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <PackageIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="font-semibold text-gray-800 dark:text-gray-200">Delivery Cost</span>
                </div>
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">3 DT</span>
              </div>

              <div class="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-md border-2 border-green-400 dark:border-green-600 relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                  FREE!
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-green-200 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <RotateCcwIcon class="w-5 h-5 text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <span class="font-bold text-gray-900 dark:text-gray-100 block">Return Cost</span>
                      <span class="text-xs text-green-700 dark:text-green-400 font-medium">Fast & hassle-free</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xl font-bold text-green-700 dark:text-green-300 line-through opacity-50">3 DT</span>
                    <span class="text-3xl font-bold text-green-600 dark:text-green-400">0 DT</span>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-amber-300 dark:border-amber-700">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-amber-200 dark:bg-amber-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <ZapIcon class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <span class="font-bold text-gray-900 dark:text-gray-100 block">Lightning Fast</span>
                    <span class="text-xs text-amber-700 dark:text-amber-400 font-medium">2 minutes from confirmation to preparation</span>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-purple-200 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <PercentIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="flex-1">
                    <span class="font-bold text-gray-900 dark:text-gray-100 block mb-1">Volume Discounts</span>
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center justify-between">
                        <span class="text-purple-700 dark:text-purple-400 font-medium">300-500 colis/month:</span>
                        <span class="font-bold text-purple-600 dark:text-purple-400">50% OFF</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-purple-700 dark:text-purple-400 font-medium">500+ colis/month:</span>
                        <span class="font-bold text-purple-600 dark:text-purple-400">100% FREE</span>
                      </div>
                    </div>
                  </div>
                </div>
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
  Package as PackageIcon,
  RotateCcw as RotateCcwIcon,
  Clock as ClockIcon,
  Percent as PercentIcon,
  Zap as ZapIcon,
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
