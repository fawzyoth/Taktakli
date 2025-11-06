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
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-scale-in relative"
        @click.stop
      >
        <button
          @click="handleClose"
          class="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <div class="space-y-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <img
                src="/Design sans titre.png"
                alt="Delivery Partners"
                class="w-full h-24 object-cover"
              />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information sur le client</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.fullName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Téléphone"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone 2
                  </label>
                  <input
                    v-model="formData.phone2"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Téléphone 2"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adresse du client</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gouvernorat
                  </label>
                  <select
                    v-model="formData.gouvernorat"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Gouvernorat</option>
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
                    <option value="Médenine">Médenine</option>
                    <option value="Tataouine">Tataouine</option>
                    <option value="Gafsa">Gafsa</option>
                    <option value="Tozeur">Tozeur</option>
                    <option value="Kebili">Kebili</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Délégation
                  </label>
                  <select
                    v-model="formData.delegation"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Délégation</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Localité
                  </label>
                  <select
                    v-model="formData.locality"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Localité</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse complémentaire <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.address"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Adresse complémentaire"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information sur le produit</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Désignation <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.designation"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Désignation"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre d'article
                  </label>
                  <input
                    v-model.number="formData.quantity"
                    type="number"
                    min="1"
                    max="5"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Le nombre d'articles doit être entre 1 et 5</p>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prix <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="0"
                />
                <p class="text-xs text-red-500 mt-1">*Merci d'inclure les frais de livraison - الرجاء إضافة تكاليف التوصيل</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ouvrir colis
                  </label>
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.openPackage"
                        type="radio"
                        :value="false"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.openPackage"
                        type="radio"
                        :value="true"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Colis Fragile
                  </label>
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.fragile"
                        type="radio"
                        :value="false"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.fragile"
                        type="radio"
                        :value="true"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Échange
                  </label>
                  <div class="flex items-center space-x-4">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.exchange"
                        type="radio"
                        :value="false"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Non</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input
                        v-model="formData.exchange"
                        type="radio"
                        :value="true"
                        class="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Créer Bordereau
            </button>
            <button
              type="button"
              @click="handleClose"
              class="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'
import {
  X as XIcon
} from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

const formData = ref({
  fullName: '',
  phone: '',
  phone2: '',
  gouvernorat: '',
  delegation: '',
  locality: '',
  address: '',
  designation: '',
  quantity: 1,
  price: 0,
  openPackage: false,
  fragile: false,
  exchange: false
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  emit('submit', formData.value)
  emit('close')
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
