<template>
  <div
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Créer un Colis</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Remplissez les informations de livraison</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <XIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6">
        <div class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">
              ✓ Le retour est à 0 DT - Vous ne prenez aucun risque
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du Client *
              </label>
              <input
                v-model="form.client_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Nom complet du client"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone *
              </label>
              <input
                v-model="form.client_phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="+216 XX XXX XXX"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code Postal *
              </label>
              <input
                v-model="form.client_postal_code"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="1000"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ville *
              </label>
              <input
                v-model="form.client_city"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tunis"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse Complète *
              </label>
              <textarea
                v-model="form.client_address"
                required
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Adresse détaillée de livraison"
              ></textarea>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description du Produit *
              </label>
              <textarea
                v-model="form.product_description"
                required
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Décrivez le contenu du colis"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valeur Déclarée (DT) *
              </label>
              <input
                v-model.number="form.product_value"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant COD (DT)
              </label>
              <input
                v-model.number="form.cod_amount"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Laissez à 0 si prépayé</p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Poids (kg) *
              </label>
              <input
                v-model.number="form.weight"
                type="number"
                step="0.01"
                min="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="1.00"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                v-model="form.notes"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Instructions spéciales pour la livraison"
              ></textarea>
            </div>
          </div>
        </div>
      </form>

      <div class="p-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="submitting"
          class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition"
        >
          {{ submitting ? 'Création...' : 'Créer le Colis' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X as XIcon } from 'lucide-vue-next'

defineEmits<{
  close: []
  created: []
}>()

const submitting = ref(false)
const form = ref({
  client_name: '',
  client_phone: '',
  client_address: '',
  client_city: '',
  client_postal_code: '',
  product_description: '',
  product_value: 0,
  cod_amount: 0,
  weight: 0,
  notes: ''
})

async function handleSubmit() {
  if (submitting.value) return

  submitting.value = true
  try {
    console.log('Creating colis:', form.value)
    alert('Colis créé avec succès! (Demo mode)')
  } catch (error) {
    console.error('Error creating colis:', error)
    alert('Erreur lors de la création du colis')
  } finally {
    submitting.value = false
  }
}
</script>
