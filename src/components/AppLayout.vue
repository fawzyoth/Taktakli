<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>
