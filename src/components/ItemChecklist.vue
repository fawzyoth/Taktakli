<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
      <ClipboardListIcon class="w-6 h-6" />
      <span>Liste des Articles</span>
    </h3>

    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        :class="[
          'relative border-2 rounded-lg p-4 transition-all duration-300',
          isVerified(item.id)
            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
            : isCurrentScan(item.item_barcode)
            ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 animate-pulse'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        ]"
      >
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div
              v-if="item.item_image_url"
              class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
            >
              <img
                :src="item.item_image_url"
                :alt="item.item_name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div
              v-else
              class="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            >
              <PackageIcon class="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ item.item_name }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  SKU: {{ item.item_sku }}
                </p>
                <div class="flex items-center space-x-2">
                  <BarcodeIcon class="w-4 h-4 text-gray-400" />
                  <code class="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {{ item.item_barcode }}
                  </code>
                </div>
                <p v-if="item.item_notes" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {{ item.item_notes }}
                </p>
              </div>

              <div class="flex-shrink-0 ml-4">
                <div
                  v-if="isVerified(item.id)"
                  class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <CheckCircleIcon class="w-6 h-6 text-white" />
                </div>
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                >
                  <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {{ item.item_quantity }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isVerified(item.id)"
          class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded"
        >
          VÉRIFIÉ
        </div>

        <div
          v-if="isCurrentScan(item.item_barcode)"
          class="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded animate-bounce"
        >
          SCAN EN COURS
        </div>
      </div>
    </div>

    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
          Progression
        </span>
        <span class="text-sm font-bold text-gray-900 dark:text-white">
          {{ verifiedItems.size }} / {{ items.length }}
        </span>
      </div>
      <div class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          :style="{ width: progressPercentage + '%' }"
          class="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ClipboardList as ClipboardListIcon,
  Package as PackageIcon,
  Barcode as BarcodeIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

interface ColisItem {
  id: string
  colis_id: string
  item_name: string
  item_sku: string
  item_barcode: string
  item_quantity: number
  item_image_url: string
  item_notes: string
}

const props = defineProps<{
  items: ColisItem[]
  verifiedItems: Set<string>
  currentScan: string
}>()

const progressPercentage = computed(() => {
  if (props.items.length === 0) return 0
  return (props.verifiedItems.size / props.items.length) * 100
})

function isVerified(itemId: string): boolean {
  return props.verifiedItems.has(itemId)
}

function isCurrentScan(barcode: string): boolean {
  return props.currentScan === barcode
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>
