<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col m-4 sm:m-0">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircleIcon class="w-6 h-6 text-blue-500" />
              Comments
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ username }} - {{ phoneNumber }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <XIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div
              v-for="(comment, idx) in comments"
              :key="comment.id"
              class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  Comment #{{ idx + 1 }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ new Date(comment.created_at).toLocaleString() }}
                </span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ comment.comment_text }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('close')"
            class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { PhoneNumberComment } from '@/lib/mockData'
import { X as XIcon, MessageCircle as MessageCircleIcon } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  comments: PhoneNumberComment[]
  phoneNumber: string
  username: string
}>()

defineEmits<{
  close: []
}>()
</script>
