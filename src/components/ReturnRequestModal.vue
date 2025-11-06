<template>
  <div
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Demande de Retour</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Retour gratuit à 0 DT</p>
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
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <CheckCircleIcon class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                  Retour sans frais
                </p>
                <p class="text-xs text-green-700 dark:text-green-400">
                  Le retour est à 0 DT. Vous ne prenez aucun risque avec notre service de livraison.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID du Colis
            </label>
            <input
              :value="colisId"
              type="text"
              disabled
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Raison du Retour *
            </label>
            <select
              v-model="form.return_reason"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Sélectionnez une raison</option>
              <option value="client_refused">Client a refusé</option>
              <option value="wrong_address">Adresse incorrecte</option>
              <option value="client_absent">Client absent</option>
              <option value="damaged_product">Produit endommagé</option>
              <option value="wrong_product">Mauvais produit</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div v-if="form.return_reason === 'other'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Précisez la raison *
            </label>
            <textarea
              v-model="form.custom_reason"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Décrivez la raison du retour"
            ></textarea>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p class="text-xs text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Une fois votre demande soumise, notre équipe la traitera dans les plus brefs délais.
              Vous serez notifié du statut de votre retour.
            </p>
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
          class="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-lg transition"
        >
          {{ submitting ? 'Envoi...' : 'Soumettre la Demande' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X as XIcon, CheckCircle as CheckCircleIcon } from 'lucide-vue-next'

defineProps<{
  colisId: string
}>()

defineEmits<{
  close: []
  created: []
}>()

const submitting = ref(false)
const form = ref({
  return_reason: '',
  custom_reason: ''
})

async function handleSubmit() {
  if (submitting.value) return

  if (!form.value.return_reason) {
    alert('Veuillez sélectionner une raison')
    return
  }

  if (form.value.return_reason === 'other' && !form.value.custom_reason) {
    alert('Veuillez préciser la raison')
    return
  }

  submitting.value = true
  try {
    console.log('Creating return request:', form.value)
    alert('Demande de retour créée avec succès! (Demo mode)')
  } catch (error) {
    console.error('Error creating return request:', error)
    alert('Erreur lors de la création de la demande')
  } finally {
    submitting.value = false
  }
}
</script>
