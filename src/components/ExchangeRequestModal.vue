<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Demande d'Échange</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Échange gratuit à 0 DT pour livres</p>
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
            <div class="flex items-start space-x-3">
              <RefreshCwIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Échange sans frais
                </p>
                <p class="text-xs text-blue-700 dark:text-blue-400">
                  L'échange de livres est gratuit. Nous récupérons l'ancien livre et vous livrons le nouveau.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Numéro de Commande
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
              Raison de l'Échange *
            </label>
            <select
              v-model="form.exchange_reason"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Sélectionnez une raison</option>
              <option value="wrong_book">Mauvais livre reçu</option>
              <option value="damaged_book">Livre endommagé</option>
              <option value="different_edition">Édition différente</option>
              <option value="missing_pages">Pages manquantes</option>
              <option value="change_mind">Changement d'avis</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div v-if="form.exchange_reason === 'other'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Précisez la raison *
            </label>
            <textarea
              v-model="form.custom_reason"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Décrivez la raison de l'échange"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Livre souhaité pour l'échange (optionnel)
            </label>
            <input
              v-model="form.desired_book"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Titre du livre souhaité"
            />
          </div>

          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p class="text-xs text-amber-800 dark:text-amber-300">
              <strong>Note:</strong> Notre équipe vous contactera pour confirmer la disponibilité du livre d'échange.
              Le livre actuel sera récupéré lors de la livraison du nouveau.
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
          class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
        >
          <RefreshCwIcon v-if="!submitting" class="w-4 h-4" />
          {{ submitting ? 'Envoi...' : 'Demander l\'Échange' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X as XIcon, RefreshCw as RefreshCwIcon } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

const props = defineProps<{
  colisId: string
  productType?: string
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const submitting = ref(false)
const form = ref({
  exchange_reason: '',
  custom_reason: '',
  desired_book: ''
})

async function handleSubmit() {
  if (submitting.value) return

  if (!form.value.exchange_reason) {
    alert('Veuillez sélectionner une raison')
    return
  }

  if (form.value.exchange_reason === 'other' && !form.value.custom_reason) {
    alert('Veuillez préciser la raison')
    return
  }

  submitting.value = true
  try {
    const finalReason = form.value.exchange_reason === 'other'
      ? form.value.custom_reason
      : form.value.exchange_reason

    const { data, error } = await supabase
      .from('retours')
      .insert({
        colis_id: props.colisId,
        request_type: 'exchange',
        product_type: props.productType || 'book',
        return_reason: finalReason,
        exchange_reason: form.value.desired_book,
        custom_reason: form.value.exchange_reason === 'other' ? form.value.custom_reason : null,
        return_status: 'requested'
      })
      .select()
      .single()

    if (error) throw error

    alert('Demande d\'échange créée avec succès!')
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Error creating exchange request:', error)
    alert('Erreur lors de la création de la demande')
  } finally {
    submitting.value = false
  }
}
</script>
