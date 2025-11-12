<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Vérification du Retour</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">ID: {{ verification.id.substring(0, 8) }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <XIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PackageIcon class="w-5 h-5" />
            Informations du Colis
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">ID Retour:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ verification.retour_id.substring(0, 16) }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">ID Colis:</span>
              <p class="font-medium text-gray-900 dark:text-white mt-1">{{ verification.colis_id.substring(0, 16) }}</p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Statut:</span>
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1',
                getStatusColor(verification.verification_status)
              ]">
                {{ getStatusLabel(verification.verification_status) }}
              </span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Approbation:</span>
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1',
                getApprovalColor(verification.approval_status)
              ]">
                {{ getApprovalLabel(verification.approval_status) }}
              </span>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              État du Colis
            </label>
            <select
              v-model="form.package_condition"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Sélectionner...</option>
              <option value="excellent">Excellent</option>
              <option value="good">Bon</option>
              <option value="fair">Acceptable</option>
              <option value="poor">Mauvais</option>
              <option value="damaged">Endommagé</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <input
                v-model="form.items_complete"
                type="checkbox"
                id="items_complete"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label for="items_complete" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Articles complets
              </label>
            </div>
            <div class="flex items-center">
              <input
                v-model="form.items_damaged"
                type="checkbox"
                id="items_damaged"
                class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <label for="items_damaged" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Articles endommagés
              </label>
            </div>
          </div>

          <div v-if="form.items_damaged">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description des Dommages
            </label>
            <textarea
              v-model="form.damage_description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Décrivez les dommages constatés..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Décision d'Approbation
            </label>
            <select
              v-model="form.approval_status"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
              <option value="partial">Partiel</option>
            </select>
          </div>

          <div v-if="form.approval_status === 'approved' || form.approval_status === 'partial'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Montant du Remboursement (DT)
            </label>
            <input
              v-model.number="form.refund_amount"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes d'Approbation
            </label>
            <textarea
              v-model="form.approval_notes"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Ajoutez vos notes..."
            ></textarea>
          </div>
        </form>
      </div>

      <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex gap-3 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition border border-gray-300 dark:border-gray-600"
        >
          Annuler
        </button>
        <button
          @click="handleSubmit"
          :disabled="submitting"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
        >
          {{ submitting ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button
          v-if="verification.verification_status !== 'completed'"
          @click="completeVerification"
          :disabled="submitting"
          class="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition"
        >
          {{ submitting ? 'En cours...' : 'Terminer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X as XIcon, Package as PackageIcon } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

interface ReturnVerification {
  id: string
  retour_id: string
  colis_id: string
  verification_status: string
  package_condition: string | null
  items_complete: boolean
  items_damaged: boolean
  damage_description: string | null
  approval_status: string
  approval_notes: string | null
  refund_amount: number
  created_at: string
  completed_at: string | null
}

const props = defineProps<{
  verification: ReturnVerification
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const submitting = ref(false)
const form = ref({
  package_condition: '',
  items_complete: false,
  items_damaged: false,
  damage_description: '',
  approval_status: 'pending',
  approval_notes: '',
  refund_amount: 0
})

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

function getApprovalColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    partial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getApprovalLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    partial: 'Partiel'
  }
  return labels[status] || status
}

async function handleSubmit() {
  if (submitting.value) return

  submitting.value = true
  try {
    const { error } = await supabase
      .from('return_verifications')
      .update({
        package_condition: form.value.package_condition || null,
        items_complete: form.value.items_complete,
        items_damaged: form.value.items_damaged,
        damage_description: form.value.damage_description || null,
        approval_status: form.value.approval_status,
        approval_notes: form.value.approval_notes || null,
        refund_amount: form.value.refund_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', props.verification.id)

    if (error) throw error

    alert('Vérification mise à jour avec succès!')
    emit('updated')
  } catch (error) {
    console.error('Error updating verification:', error)
    alert('Erreur lors de la mise à jour')
  } finally {
    submitting.value = false
  }
}

async function completeVerification() {
  if (submitting.value) return

  if (!form.value.package_condition) {
    alert('Veuillez sélectionner l\'état du colis')
    return
  }

  submitting.value = true
  try {
    const { error } = await supabase
      .from('return_verifications')
      .update({
        package_condition: form.value.package_condition,
        items_complete: form.value.items_complete,
        items_damaged: form.value.items_damaged,
        damage_description: form.value.damage_description || null,
        approval_status: form.value.approval_status,
        approval_notes: form.value.approval_notes || null,
        refund_amount: form.value.refund_amount,
        verification_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', props.verification.id)

    if (error) throw error

    alert('Vérification terminée avec succès!')
    emit('updated')
  } catch (error) {
    console.error('Error completing verification:', error)
    alert('Erreur lors de la finalisation')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  form.value = {
    package_condition: props.verification.package_condition || '',
    items_complete: props.verification.items_complete,
    items_damaged: props.verification.items_damaged,
    damage_description: props.verification.damage_description || '',
    approval_status: props.verification.approval_status,
    approval_notes: props.verification.approval_notes || '',
    refund_amount: props.verification.refund_amount
  }
})
</script>
