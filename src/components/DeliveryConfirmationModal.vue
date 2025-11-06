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
        class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-scale-in relative overflow-hidden"
        @click.stop
      >
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
        <button
          @click="handleClose"
          class="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div class="p-6 pt-8 space-y-5">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden p-4 shadow-inner">
            <img
              src="/Design sans titre.png"
              alt="Delivery Partners"
              class="w-full h-20 object-contain"
            />
          </div>

          <div class="text-center space-y-2">
            <div class="inline-block bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse">
              LIMITED TIME OFFER
            </div>
            <h2 id="delivery-modal-title" class="text-3xl font-extrabold text-gray-900 dark:text-white">
              Transform Your Delivery
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
              Join hundreds of businesses saving time and money with our premium delivery solution
            </p>
          </div>

          <div class="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-blue-100 text-xs font-medium uppercase tracking-wide">Your Investment</p>
                  <p class="text-3xl font-black mt-1">Only 7 DT</p>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <PackageIcon class="w-8 h-8" />
                </div>
              </div>
              <p class="text-sm text-blue-50">Per delivery with instant tracking</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border-2 border-green-500 dark:border-green-600 shadow-lg relative overflow-hidden transform hover:scale-[1.02] transition-transform">
              <div class="absolute -right-8 -top-8 w-24 h-24 bg-green-500/20 rounded-full"></div>
              <div class="absolute -left-4 -bottom-4 w-20 h-20 bg-emerald-500/20 rounded-full"></div>
              <div class="relative z-10">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <RotateCcwIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p class="text-lg font-bold text-gray-900 dark:text-white">FREE Returns Forever</p>
                      <p class="text-xs text-green-700 dark:text-green-400 font-medium">Save 7 DT on every return</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-green-700 dark:text-green-400 line-through font-medium">7 DT</div>
                    <div class="text-3xl font-black text-green-600 dark:text-green-400">FREE</div>
                  </div>
                </div>
                <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p class="text-xs font-semibold text-green-800 dark:text-green-300">Instant verification • No hassle • No fees</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border-2 border-orange-300 dark:border-orange-600 shadow-md hover:shadow-lg transition-shadow">
                <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mb-3 shadow-md">
                  <ZapIcon class="w-5 h-5 text-white" />
                </div>
                <p class="font-bold text-gray-900 dark:text-white text-sm mb-1">Ultra Fast</p>
                <p class="text-xs text-orange-700 dark:text-orange-400 font-medium leading-tight">Ready in 2 minutes</p>
              </div>

              <div class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 border-2 border-cyan-300 dark:border-cyan-600 shadow-md hover:shadow-lg transition-shadow">
                <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-3 shadow-md">
                  <ClockIcon class="w-5 h-5 text-white" />
                </div>
                <p class="font-bold text-gray-900 dark:text-white text-sm mb-1">Real-time</p>
                <p class="text-xs text-cyan-700 dark:text-cyan-400 font-medium leading-tight">Live tracking</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-fuchsia-900/20 rounded-2xl p-5 border-2 border-rose-300 dark:border-rose-600 shadow-lg">
              <div class="flex items-start space-x-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-rose-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <PercentIcon class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-lg font-bold text-gray-900 dark:text-white mb-1">Grow & Save More</p>
                  <p class="text-xs text-rose-700 dark:text-rose-400 font-medium">Scale your business with volume rewards</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border-l-4 border-rose-500">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">300-500 colis/month</span>
                    <span class="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">50% OFF</span>
                  </div>
                </div>
                <div class="bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-lg p-3 border-l-4 border-fuchsia-600 shadow-md">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-white">500+ colis/month</span>
                    <span class="bg-white text-rose-600 text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse">100% FREE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">Join 500+ happy merchants already using our service</p>
            <div class="flex items-center justify-center space-x-1">
              <span class="text-yellow-500 text-lg">★★★★★</span>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">4.9/5 Rating</span>
            </div>
          </div>

          <button
            @click="handleContinue"
            class="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-black py-5 px-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3 text-lg relative overflow-hidden group"
          >
            <div class="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span class="relative z-10">Start Saving Now</span>
            <ArrowRightIcon class="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            @click="handleClose"
            class="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium py-3 transition-colors text-sm"
          >
            I'll decide later
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
