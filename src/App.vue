<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initialize()
})
</script>
