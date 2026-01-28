<template>
  <div class="daily-tasks p-4">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Package class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.toPickup }}</p>
            <p class="text-xs text-gray-500">À récupérer</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Truck class="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.toDeliver }}</p>
            <p class="text-xs text-gray-500">À livrer</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.delivered }}</p>
            <p class="text-xs text-gray-500">Livrés</p>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <RotateCcw class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.returns }}</p>
            <p class="text-xs text-gray-500">Retours</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <router-link to="/mobile/pickup" class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <ScanLine class="w-8 h-8 mb-2" />
        <p class="font-semibold">Scanner Pick up</p>
        <p class="text-xs text-blue-100">{{ stats.toPickup }} en attente</p>
      </router-link>
      <router-link to="/mobile/return" class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
        <RotateCcw class="w-8 h-8 mb-2" />
        <p class="font-semibold">Scanner Retour</p>
        <p class="text-xs text-orange-100">{{ stats.pendingReturns }} à traiter</p>
      </router-link>
    </div>

    <!-- Today's Tasks -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 dark:text-white">Tâches du jour</h3>
          <span class="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
            {{ pendingTasks.length }} en cours
          </span>
        </div>
      </div>

      <!-- Task List -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="task in todayTasks"
          :key="task.id"
          class="p-4 flex items-center space-x-3"
          :class="task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
        >
          <button
            @click="toggleTask(task)"
            :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 dark:border-gray-600'
            ]"
          >
            <Check v-if="task.completed" class="w-4 h-4 text-white" />
          </button>
          <div class="flex-1">
            <p
              class="text-sm font-medium"
              :class="task.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'"
            >
              {{ task.title }}
            </p>
            <p class="text-xs text-gray-500">{{ task.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              v-if="task.priority === 'high'"
              class="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full"
            >
              Urgent
            </span>
            <component
              :is="task.actionIcon"
              class="w-5 h-5 text-gray-400"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="todayTasks.length === 0" class="p-8 text-center">
        <CheckCircle class="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p class="text-gray-500">Toutes les tâches sont terminées !</p>
      </div>
    </div>

    <!-- Upcoming Pickups -->
    <div class="mt-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="font-semibold text-gray-900 dark:text-white">Prochains pick ups</h3>
      </div>
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="pickup in upcomingPickups" :key="pickup.id" class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MapPin class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ pickup.seller }}</p>
                <p class="text-xs text-gray-500">{{ pickup.address }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ pickup.packages }} colis</p>
              <p class="text-xs text-gray-500">{{ pickup.time }}</p>
            </div>
          </div>
          <div class="mt-3 flex space-x-2">
            <button class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
              <Phone class="w-4 h-4" />
              <span>Appeler</span>
            </button>
            <button class="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
              <Navigation class="w-4 h-4" />
              <span>Itinéraire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import {
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
  ScanLine,
  Check,
  MapPin,
  Phone,
  Navigation,
  ClipboardCheck,
  AlertCircle,
  Eye
} from 'lucide-vue-next'

const stats = ref({
  toPickup: 12,
  toDeliver: 28,
  delivered: 15,
  returns: 3,
  pendingReturns: 5
})

const todayTasks = ref([
  {
    id: 1,
    title: 'Récupérer 5 colis - Boutique Zara',
    description: 'Rue de la Liberté, Tunis',
    priority: 'high',
    completed: false,
    actionIcon: markRaw(Package)
  },
  {
    id: 2,
    title: 'Livrer colis YAL-2026-001234',
    description: 'Ahmed Ben Ali - Ariana',
    priority: 'normal',
    completed: true,
    actionIcon: markRaw(Truck)
  },
  {
    id: 3,
    title: 'Retour client absent - 3ème tentative',
    description: 'Hichem Mansour - La Marsa',
    priority: 'high',
    completed: false,
    actionIcon: markRaw(AlertCircle)
  },
  {
    id: 4,
    title: 'Vérifier colis endommagé',
    description: 'ZR-2026-005678 - Photo requise',
    priority: 'normal',
    completed: false,
    actionIcon: markRaw(Eye)
  },
  {
    id: 5,
    title: 'Confirmer livraison #2026-1235',
    description: 'Omar Chahed - Signature obtenue',
    priority: 'normal',
    completed: true,
    actionIcon: markRaw(ClipboardCheck)
  }
])

const pendingTasks = computed(() => todayTasks.value.filter(t => !t.completed))

const upcomingPickups = ref([
  {
    id: 1,
    seller: 'Boutique Électronique Plus',
    address: '45 Rue de Marseille, Tunis',
    packages: 8,
    time: '10:30'
  },
  {
    id: 2,
    seller: 'Fashion Store',
    address: '12 Avenue Habib Bourguiba',
    packages: 3,
    time: '11:45'
  },
  {
    id: 3,
    seller: 'Cosmétique Beauty',
    address: '78 Rue de Palestine, La Marsa',
    packages: 5,
    time: '14:00'
  }
])

const toggleTask = (task: any) => {
  task.completed = !task.completed
}
</script>
