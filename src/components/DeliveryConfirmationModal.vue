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

        <div v-if="!showForm" class="p-8 space-y-6">
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

        <div v-else class="p-8 space-y-6">
          <div class="text-center space-y-3">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto">
              <PackageIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Delivery Information
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Please provide your delivery details
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon class="w-5 h-5" />
                </div>
                <input
                  v-model="formData.fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <PhoneIcon class="w-5 h-5" />
                </div>
                <input
                  v-model="formData.phone"
                  type="tel"
                  required
                  placeholder="+216 XX XXX XXX"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div class="relative">
                <div class="absolute left-3 top-3 text-gray-400">
                  <MapPinIcon class="w-5 h-5" />
                </div>
                <textarea
                  v-model="formData.address"
                  required
                  rows="2"
                  placeholder="Street address"
                  class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <BuildingIcon class="w-5 h-5" />
                  </div>
                  <input
                    v-model="formData.city"
                    type="text"
                    required
                    placeholder="City"
                    class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Governorate
                </label>
                <select
                  v-model="formData.governorate"
                  required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Ariana">Ariana</option>
                  <option value="Ben Arous">Ben Arous</option>
                  <option value="Manouba">Manouba</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Zaghouan">Zaghouan</option>
                  <option value="Bizerte">Bizerte</option>
                  <option value="Béja">Béja</option>
                  <option value="Jendouba">Jendouba</option>
                  <option value="Kef">Kef</option>
                  <option value="Siliana">Siliana</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Monastir">Monastir</option>
                  <option value="Mahdia">Mahdia</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Kairouan">Kairouan</option>
                  <option value="Kasserine">Kasserine</option>
                  <option value="Sidi Bouzid">Sidi Bouzid</option>
                  <option value="Gabès">Gabès</option>
                  <option value="Medenine">Medenine</option>
                  <option value="Tataouine">Tataouine</option>
                  <option value="Gafsa">Gafsa</option>
                  <option value="Tozeur">Tozeur</option>
                  <option value="Kebili">Kebili</option>
                </select>
              </div>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="showForm = false"
                class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Submit</span>
                <SendIcon class="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  X as XIcon,
  Package as PackageIcon,
  RotateCcw as RotateCcwIcon,
  Clock as ClockIcon,
  Percent as PercentIcon,
  ArrowRight as ArrowRightIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Building2 as BuildingIcon,
  Send as SendIcon
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  continue: []
}>()

const showForm = ref(false)
const formData = ref({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  governorate: ''
})

function handleClose() {
  showForm.value = false
  formData.value = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    governorate: ''
  }
  emit('close')
}

function handleContinue() {
  showForm.value = true
}

function handleSubmit() {
  emit('continue')
  handleClose()
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
    showForm.value = false
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
