<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div class="relative max-w-7xl mx-auto text-center">
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <SparklesIcon class="w-5 h-5 animate-pulse" />
            <span class="text-sm font-semibold">Nouveautés disponibles</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Boutique Live Streaming
          </h1>
          <p class="text-xl sm:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Équipez-vous comme un pro
          </p>

          <div class="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div class="flex items-center space-x-2">
              <div class="bg-white/20 p-2 rounded-lg">
                <TruckIcon class="w-5 h-5" />
              </div>
              <span class="font-semibold">Livraison Rapide</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="bg-white/20 p-2 rounded-lg">
                <ShieldCheckIcon class="w-5 h-5" />
              </div>
              <span class="font-semibold">Garantie Incluse</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="bg-white/20 p-2 rounded-lg">
                <ZapIcon class="w-5 h-5" />
              </div>
              <span class="font-semibold">Stock Limité</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Catégories Populaires
          </h2>
          <div class="flex items-center justify-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
            <button
              @click="selectedCategory = null"
              :class="[
                'px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all transform hover:scale-105',
                selectedCategory === null
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/50'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-lg'
              ]"
            >
              🔥 Tous
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="[
                'px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all transform hover:scale-105',
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/50'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-lg'
              ]"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p class="text-gray-600 dark:text-gray-400 mt-4">Chargement...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center py-16">
          <PackageXIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun produit disponible
          </h3>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-800 hover:border-transparent"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <img
                :src="product.images[0] || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div v-if="product.original_price" class="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg animate-pulse">
                -{{ Math.round((1 - product.price / product.original_price) * 100) }}%
              </div>
              <div v-if="product.is_featured" class="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center space-x-1">
                <SparklesIcon class="w-3 h-3" />
                <span>TOP</span>
              </div>

              <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{{ product.short_description }}</p>
                </div>
              </div>
            </div>

            <div class="relative p-5">
              <h3 class="font-black text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] text-lg">
                {{ product.name }}
              </h3>

              <div class="mb-4">
                <div class="flex items-baseline space-x-2">
                  <span class="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {{ product.price }}
                  </span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">DT</span>
                  <span v-if="product.original_price" class="text-sm text-gray-400 line-through">
                    {{ product.original_price }} DT
                  </span>
                </div>
              </div>

              <button
                @click="addToCart(product)"
                class="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group/btn"
              >
                <ShoppingCartIcon class="w-5 h-5 group-hover/btn:animate-bounce" />
                <span>Ajouter au Panier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="cart.length > 0"
        class="fixed bottom-6 right-6 z-50"
      >
        <button
          @click="showCart = true"
          class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white pl-6 pr-8 py-5 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center space-x-3 animate-bounce-slow group/cart hover:scale-110"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-50 group-hover/cart:opacity-75 transition-opacity"></div>

          <div class="relative flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-full">
              <ShoppingCartIcon class="w-6 h-6 group-hover/cart:animate-bounce" />
            </div>
            <div class="flex flex-col items-start">
              <span class="text-xs font-semibold opacity-90">Mon Panier</span>
              <span class="font-black text-lg">{{ cartTotal }} DT</span>
            </div>
          </div>

          <span class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg animate-pulse border-4 border-white">
            {{ cartItemCount }}
          </span>
        </button>
      </div>

      <div
        v-if="showCart"
        class="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        @click.self="showCart = false"
      >
        <div class="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShoppingCartIcon class="w-6 h-6" />
              <span>Panier ({{ cartItemCount }})</span>
            </h2>
            <button
              @click="showCart = false"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <div
                v-for="item in cart"
                :key="item.product.id"
                class="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-gray-900 dark:text-white line-clamp-2">{{ item.product.name }}</h4>
                  <p class="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {{ item.product.price }} DT
                  </p>
                </div>
                <div class="flex flex-col items-center space-y-2">
                  <div class="flex items-center space-x-2 bg-white dark:bg-gray-900 rounded-lg p-1">
                    <button
                      @click="updateCartQuantity(item.product.id, item.quantity - 1)"
                      class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <MinusIcon class="w-4 h-4" />
                    </button>
                    <span class="font-bold text-gray-900 dark:text-white w-8 text-center">{{ item.quantity }}</span>
                    <button
                      @click="updateCartQuantity(item.product.id, item.quantity + 1)"
                      class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <PlusIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    @click="removeFromCart(item.product.id)"
                    class="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center justify-between mb-4">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
              <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ cartTotal }} DT</span>
            </div>
            <button
              @click="checkout"
              class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition shadow-lg"
            >
              Commander
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
  PackageX as PackageXIcon,
  X as XIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Trash2 as Trash2Icon,
  Sparkles as SparklesIcon,
  Truck as TruckIcon,
  ShieldCheck as ShieldCheckIcon,
  Zap as ZapIcon
} from 'lucide-vue-next'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  short_description: string
  price: number
  original_price: number | null
  stock_quantity: number
  images: string[]
  is_featured: boolean
  is_available: boolean
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

function checkout() {
  alert('Commande en cours! Total: ' + cartTotal.value + ' DT')
  showCart.value = false
  cart.value = []
}

async function loadData() {
  loading.value = true
  try {
    categories.value = [
      { id: '1', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
      { id: '2', name: 'Ring Lights', slug: 'ring-lights', icon: '💡' },
      { id: '3', name: 'Trépieds', slug: 'trepieds', icon: '📸' },
      { id: '4', name: 'Microphones', slug: 'microphones', icon: '🎤' },
      { id: '5', name: 'Accessoires', slug: 'accessoires', icon: '🎯' },
      { id: '6', name: 'Emballage', slug: 'emballage', icon: '📦' }
    ]

    products.value = [
      {
        id: '1',
        category_id: '1',
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        short_description: 'Smartphone premium avec caméra 48MP',
        price: 4299.00,
        original_price: 4799.00,
        stock_quantity: 15,
        images: ['https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg'],
        is_featured: true,
        is_available: true
      },
      {
        id: '2',
        category_id: '2',
        name: 'Ring Light LED 18 pouces',
        slug: 'ring-light-18-pouces',
        short_description: 'Éclairage LED professionnel 18 pouces',
        price: 349.00,
        original_price: 449.00,
        stock_quantity: 25,
        images: ['https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg'],
        is_featured: true,
        is_available: true
      },
      {
        id: '3',
        category_id: '3',
        name: 'Trépied Télescopique Pro',
        slug: 'trepied-telescopique-pro',
        short_description: 'Trépied professionnel hauteur réglable',
        price: 129.00,
        original_price: 179.00,
        stock_quantity: 30,
        images: ['https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg'],
        is_featured: true,
        is_available: true
      },
      {
        id: '4',
        category_id: '4',
        name: 'Micro-Cravate Sans Fil',
        slug: 'micro-cravate-sans-fil',
        short_description: 'Micro sans fil compact avec réduction de bruit',
        price: 299.00,
        original_price: null,
        stock_quantity: 20,
        images: ['https://images.pexels.com/photos/164829/pexels-photo-164829.jpeg'],
        is_featured: false,
        is_available: true
      },
      {
        id: '5',
        category_id: '5',
        name: 'Kit Complet Streaming',
        slug: 'kit-complet-streaming',
        short_description: 'Kit débutant complet pour le live streaming',
        price: 199.00,
        original_price: 279.00,
        stock_quantity: 40,
        images: ['https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'],
        is_featured: true,
        is_available: true
      },
      {
        id: '6',
        category_id: '6',
        name: 'Cartons 30x20x10cm (Pack 50)',
        slug: 'cartons-pack-50',
        short_description: 'Pack 50 cartons robustes 30x20x10cm',
        price: 89.00,
        original_price: null,
        stock_quantity: 100,
        images: ['https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg'],
        is_featured: true,
        is_available: true
      },
      {
        id: '7',
        category_id: '6',
        name: 'Film Bulles 50m',
        slug: 'film-bulles-50m',
        short_description: 'Film à bulles 50m x 50cm',
        price: 45.00,
        original_price: null,
        stock_quantity: 80,
        images: ['https://images.pexels.com/photos/4226262/pexels-photo-4226262.jpeg'],
        is_featured: false,
        is_available: true
      },
      {
        id: '8',
        category_id: '6',
        name: 'Scotch Emballage (Pack 6)',
        slug: 'scotch-pack-6',
        short_description: 'Pack 6 rouleaux scotch marron 48mm',
        price: 35.00,
        original_price: null,
        stock_quantity: 120,
        images: ['https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg'],
        is_featured: false,
        is_available: true
      },
      {
        id: '9',
        category_id: '6',
        name: 'Enveloppes Bulles (100 pcs)',
        slug: 'enveloppes-bulles-100',
        short_description: 'Pack 100 enveloppes à bulles 23x32cm',
        price: 65.00,
        original_price: 79.00,
        stock_quantity: 60,
        images: ['https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg'],
        is_featured: true,
        is_available: true
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

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
