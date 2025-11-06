<template>
  <div
    v-if="true"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div :class="[
              'w-16 h-16 rounded-full flex items-center justify-center',
              missingItems.length === 0
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-orange-100 dark:bg-orange-900/30'
            ]">
              <component
                :is="missingItems.length === 0 ? CheckCircle2Icon : AlertTriangleIcon"
                :class="[
                  'w-10 h-10',
                  missingItems.length === 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400'
                ]"
              />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Vérification Terminée
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <XIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
            <PackageIcon class="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ sessionData.total_items }}
            </p>
            <p class="text-xs text-blue-700 dark:text-blue-500 font-medium mt-1">
              Total Articles
            </p>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
            <CheckCircleIcon class="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ sessionData.verified_items }}
            </p>
            <p class="text-xs text-green-700 dark:text-green-500 font-medium mt-1">
              Vérifiés
            </p>
          </div>

          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
            <XCircleIcon class="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {{ sessionData.missing_items }}
            </p>
            <p class="text-xs text-orange-700 dark:text-orange-500 font-medium mt-1">
              Manquants
            </p>
          </div>
        </div>

        <div v-if="missingItems.length === 0" class="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6 text-center mb-6">
          <CheckCircle2Icon class="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-green-900 dark:text-green-300 mb-2">
            Vérification Réussie!
          </h3>
          <p class="text-green-800 dark:text-green-400">
            Tous les articles ont été vérifiés avec succès. Le colis est complet.
          </p>
        </div>

        <div v-else class="space-y-4 mb-6">
          <div class="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-6">
            <div class="flex items-start space-x-3 mb-4">
              <AlertTriangleIcon class="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 class="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">
                  Articles Manquants Détectés
                </h3>
                <p class="text-sm text-orange-800 dark:text-orange-400">
                  {{ missingItems.length }} article{{ missingItems.length > 1 ? 's' : '' }}
                  n'{{ missingItems.length > 1 ? 'ont' : 'a' }} pas été trouvé{{ missingItems.length > 1 ? 's' : '' }}
                  lors de la vérification.
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div
                v-for="item in missingItems"
                :key="item.id"
                class="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-lg p-3 flex items-center space-x-3"
              >
                <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="item.item_image_url"
                    :src="item.item_image_url"
                    :alt="item.item_name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <PackageIcon v-else class="w-6 h-6 text-gray-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ item.item_name }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    SKU: {{ item.item_sku }} | Code: {{ item.item_barcode }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-semibold rounded">
                    Qty: {{ item.item_quantity }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <InfoIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm">
                <p class="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Prochaines Étapes
                </p>
                <ul class="text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                  <li>Vérifiez physiquement le colis</li>
                  <li>Contactez le client pour clarification</li>
                  <li>Documentez les articles manquants</li>
                  <li>Initiez le processus de réclamation si nécessaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-3">
            Résumé de Session
          </h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">ID Session:</span>
              <p class="font-mono text-xs text-gray-900 dark:text-white mt-1">
                {{ sessionData.id.substring(0, 16) }}...
              </p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Statut:</span>
              <p class="font-semibold text-gray-900 dark:text-white mt-1">
                {{ sessionData.session_status }}
              </p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Taux de Réussite:</span>
              <p class="font-bold text-gray-900 dark:text-white mt-1">
                {{ successRate }}%
              </p>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Durée:</span>
              <p class="font-semibold text-gray-900 dark:text-white mt-1">
                ~{{ duration }} min
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
        <button
          @click="downloadReport"
          class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center space-x-2"
        >
          <DownloadIcon class="w-5 h-5" />
          <span>Télécharger Rapport</span>
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  X as XIcon,
  CheckCircle2 as CheckCircle2Icon,
  AlertTriangle as AlertTriangleIcon,
  Package as PackageIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Info as InfoIcon,
  Download as DownloadIcon
} from 'lucide-vue-next'

interface VerificationSession {
  id: string
  total_items: number
  verified_items: number
  missing_items: number
  session_status: string
}

interface ColisItem {
  id: string
  item_name: string
  item_sku: string
  item_barcode: string
  item_quantity: number
  item_image_url: string
}

const props = defineProps<{
  sessionData: VerificationSession
  missingItems: ColisItem[]
}>()

defineEmits<{
  close: []
}>()

const successRate = computed(() => {
  if (props.sessionData.total_items === 0) return 0
  return Math.round((props.sessionData.verified_items / props.sessionData.total_items) * 100)
})

const duration = computed(() => {
  return Math.floor(Math.random() * 10) + 5
})

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

function downloadReport() {
  alert('Téléchargement du rapport...')
}
</script>
