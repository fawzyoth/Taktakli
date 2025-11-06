<template>
  <AppLayout>
    <div class="bg-gray-50 dark:bg-gray-950">
      <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <h1 class="text-4xl sm:text-5xl font-bold mb-4">
            Shop Live Streaming
          </h1>
          <p class="text-xl text-blue-100 mb-8">
            Équipez-vous avec le meilleur matériel pour vos lives TikTok
          </p>
          <div class="flex items-center justify-center space-x-2 text-sm">
            <TruckIcon class="w-5 h-5" />
            <span>Livraison rapide</span>
            <span class="mx-3">•</span>
            <ShieldCheckIcon class="w-5 h-5" />
            <span>Garantie incluse</span>
            <span class="mx-3">•</span>
            <CreditCardIcon class="w-5 h-5" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
              <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FilterIcon class="w-5 h-5" />
                <span>Catégories</span>
              </h3>
              <div class="space-y-2">
                <button
                  @click="selectedCategory = null"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition',
                    selectedCategory === null
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                >
                  Tous les produits
                </button>
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'w-full text-left px-4 py-2 rounded-lg transition',
                    selectedCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                >
                  {{ category.name }}
                </button>
              </div>

              <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 class="font-bold text-gray-900 dark:text-white mb-4">
                  Prix
                </h3>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" class="rounded" />
                    <span>Moins de 200 DT</span>
                  </label>
                  <label class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" class="rounded" />
                    <span>200 - 500 DT</span>
                  </label>
                  <label class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" class="rounded" />
                    <span>500 - 1000 DT</span>
                  </label>
                  <label class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" class="rounded" />
                    <span>Plus de 1000 DT</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <main class="flex-1">
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
              </p>
              <select class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option>Plus récents</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
                <option>Les plus populaires</option>
              </select>
            </div>

            <div v-if="loading" class="text-center py-16">
              <p class="text-gray-600 dark:text-gray-400">Chargement des produits...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-center py-16">
              <div class="flex justify-center mb-4">
                <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                  <PackageXIcon class="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun produit trouvé
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Essayez de changer les filtres
              </p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    :src="product.images[0] || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div v-if="product.original_price" class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{{ Math.round((1 - product.price / product.original_price) * 100) }}%
                  </div>
                  <div v-if="product.is_featured" class="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ Populaire
                  </div>
                  <div v-if="product.stock_quantity < 5" class="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Stock limité
                  </div>
                </div>

                <div class="p-4">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {{ product.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {{ product.short_description }}
                  </p>

                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <div class="flex items-baseline space-x-2">
                        <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {{ product.price }} DT
                        </span>
                        <span v-if="product.original_price" class="text-sm text-gray-500 line-through">
                          {{ product.original_price }} DT
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <EyeIcon class="w-4 h-4" />
                    <span>{{ product.view_count }} vues</span>
                    <span class="mx-2">•</span>
                    <PackageIcon class="w-4 h-4" />
                    <span>{{ product.stock_quantity }} en stock</span>
                  </div>

                  <div class="flex space-x-2">
                    <button
                      @click="addToCart(product)"
                      class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon class="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                    <button
                      @click="viewProduct(product)"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div
        v-if="cart.length > 0"
        class="fixed bottom-4 right-4 z-50"
      >
        <button
          @click="showCart = true"
          class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center space-x-3"
        >
          <ShoppingCartIcon class="w-6 h-6" />
          <span class="font-bold">Panier ({{ cartTotal }} DT)</span>
          <span class="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {{ cartItemCount }}
          </span>
        </button>
      </div>

      <div
        v-if="showCart"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showCart = false"
      >
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShoppingCartIcon class="w-6 h-6" />
              <span>Mon Panier</span>
            </h2>
            <button
              @click="showCart = false"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <div
                v-for="item in cart"
                :key="item.product.id"
                class="flex items-center space-x-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
              >
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 dark:text-white">{{ item.product.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.product.price }} DT</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button
                    @click="updateCartQuantity(item.product.id, item.quantity - 1)"
                    class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                  <span class="font-bold text-gray-900 dark:text-white w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="updateCartQuantity(item.product.id, item.quantity + 1)"
                    class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                </div>
                <button
                  @click="removeFromCart(item.product.id)"
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2Icon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-center justify-between mb-4">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
              <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ cartTotal }} DT</span>
            </div>
            <button
              @click="checkout"
              class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
            >
              Commander Maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import {
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag,
  Package as PackageIcon,
  PackageX as PackageXIcon,
  Eye as EyeIcon,
  Filter as FilterIcon,
  Truck as TruckIcon,
  ShieldCheck as ShieldCheckIcon,
  CreditCard as CreditCardIcon,
  X as XIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Trash2 as Trash2Icon
} from 'lucide-vue-next'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
}

interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price: number | null
  stock_quantity: number
  images: string[]
  features: Record<string, any>
  is_featured: boolean
  is_available: boolean
  view_count: number
}

interface CartItem {
  product: Product
  quantity: number
}

const loading = ref(true)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const selectedCategory = ref<string | null>(null)
const cart = ref<CartItem[]>([])
const showCart = ref(false)

const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return products.value
  }
  return products.value.filter(p => p.category_id === selectedCategory.value)
})

const cartItemCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)
})

function addToCart(product: Product) {
  const existingItem = cart.value.find(item => item.product.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ product, quantity: 1 })
  }
}

function updateCartQuantity(productId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }
  const item = cart.value.find(item => item.product.id === productId)
  if (item) {
    item.quantity = newQuantity
  }
}

function removeFromCart(productId: string) {
  const index = cart.value.findIndex(item => item.product.id === productId)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

function viewProduct(product: Product) {
  console.log('View product:', product)
  alert('Page produit à venir!')
}

function checkout() {
  alert('Commande en cours de traitement!')
  showCart.value = false
}

async function loadData() {
  loading.value = true
  try {
    categories.value = [
      { id: '1', name: 'Smartphones', slug: 'smartphones', description: '', image_url: '' },
      { id: '2', name: 'Ring Lights', slug: 'ring-lights', description: '', image_url: '' },
      { id: '3', name: 'Trépieds', slug: 'trepieds', description: '', image_url: '' },
      { id: '4', name: 'Microphones', slug: 'microphones', description: '', image_url: '' },
      { id: '5', name: 'Accessoires', slug: 'accessoires', description: '', image_url: '' }
    ]

    products.value = [
      {
        id: '1',
        category_id: '1',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Le smartphone ultime pour le streaming',
        short_description: 'Smartphone premium avec caméra 48MP',
        price: 4299.00,
        original_price: 4799.00,
        stock_quantity: 15,
        images: ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
        features: {},
        is_featured: true,
        is_available: true,
        view_count: 234
      },
      {
        id: '2',
        category_id: '2',
        name: 'Ring Light LED 18 pouces',
        slug: 'ring-light-18-pouces',
        description: 'Anneau lumineux professionnel',
        short_description: 'Éclairage LED professionnel 18 pouces',
        price: 349.00,
        original_price: 449.00,
        stock_quantity: 3,
        images: ['https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg'],
        features: {},
        is_featured: true,
        is_available: true,
        view_count: 189
      },
      {
        id: '3',
        category_id: '3',
        name: 'Trépied Télescopique Pro',
        slug: 'trepied-telescopique-pro',
        description: 'Trépied robuste et stable',
        short_description: 'Trépied professionnel hauteur réglable',
        price: 129.00,
        original_price: 179.00,
        stock_quantity: 30,
        images: ['https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg'],
        features: {},
        is_featured: true,
        is_available: true,
        view_count: 156
      },
      {
        id: '4',
        category_id: '4',
        name: 'Micro-Cravate Sans Fil',
        slug: 'micro-cravate-sans-fil',
        description: 'Microphone sans fil ultra compact',
        short_description: 'Micro sans fil compact avec réduction de bruit',
        price: 299.00,
        original_price: null,
        stock_quantity: 20,
        images: ['https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg'],
        features: {},
        is_featured: false,
        is_available: true,
        view_count: 98
      },
      {
        id: '5',
        category_id: '5',
        name: 'Kit Complet Streaming',
        slug: 'kit-complet-streaming',
        description: 'Pack complet pour démarrer',
        short_description: 'Kit débutant complet pour le live streaming',
        price: 199.00,
        original_price: 279.00,
        stock_quantity: 40,
        images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
        features: {},
        is_featured: true,
        is_available: true,
        view_count: 312
      }
    ]
  } catch (error) {
    console.error('Error loading shop data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
