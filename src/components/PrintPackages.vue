<template>
  <div class="hidden print:block">
    <div v-for="(colis, index) in packages" :key="colis.id" :class="{ 'page-break-before': index > 0 }">
      <div class="p-8">
        <div class="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
          <div>
            <h1 class="text-3xl font-bold mb-2">BON DE LIVRAISON</h1>
            <p class="text-lg">{{ colis.tracking_number }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm">Date: {{ new Date().toLocaleDateString('fr-FR') }}</p>
            <p class="text-sm">{{ new Date().toLocaleTimeString('fr-FR') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-2">INFORMATIONS CLIENT</h2>
            <div class="space-y-2">
              <div>
                <p class="text-sm text-gray-600 font-semibold">Nom du Client:</p>
                <p class="text-lg">{{ colis.client_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">Téléphone:</p>
                <p class="text-lg">{{ colis.client_phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 font-semibold">Adresse de Livraison:</p>
                <p class="text-lg">{{ colis.client_address }}</p>
                <p class="text-lg">{{ colis.client_city }}, {{ colis.client_postal_code }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-2">DÉTAILS COLIS</h2>
            <div class="space-y-2">
              <div>
                <p class="text-sm text-gray-600 font-semibold">Description:</p>
                <p class="text-lg">{{ colis.product_description }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600 font-semibold">Valeur:</p>
                  <p class="text-lg font-bold">{{ colis.product_value }} DT</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 font-semibold">Poids:</p>
                  <p class="text-lg">{{ colis.weight }} kg</p>
                </div>
              </div>
              <div class="mt-4 p-4 bg-gray-100 rounded">
                <p class="text-sm text-gray-600 font-semibold">Montant COD:</p>
                <p class="text-3xl font-bold">{{ colis.cod_amount }} DT</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="colis.notes" class="mb-8">
          <h2 class="text-xl font-bold mb-3 border-b border-gray-400 pb-2">NOTES</h2>
          <p class="text-base">{{ colis.notes }}</p>
        </div>

        <div class="grid grid-cols-2 gap-8 mt-12">
          <div class="border-t-2 border-gray-400 pt-4">
            <p class="text-sm text-gray-600 font-semibold text-center">Signature du Livreur</p>
            <div class="h-20"></div>
            <p class="text-xs text-gray-500 text-center">Date: _______________</p>
          </div>
          <div class="border-t-2 border-gray-400 pt-4">
            <p class="text-sm text-gray-600 font-semibold text-center">Signature du Client</p>
            <div class="h-20"></div>
            <p class="text-xs text-gray-500 text-center">Date: _______________</p>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
          <p>Ce document est une preuve de livraison. Merci de le conserver.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Colis {
  id: string
  tracking_number: string
  client_name: string
  client_phone: string
  client_address: string
  client_city: string
  client_postal_code: string
  product_description: string
  product_value: number
  cod_amount: number
  weight: number
  status: string
  notes: string
  created_at: string
  updated_at: string
}

defineProps<{
  packages: Colis[]
}>()
</script>

<style scoped>
@media print {
  .page-break-before {
    page-break-before: always;
  }
}
</style>
