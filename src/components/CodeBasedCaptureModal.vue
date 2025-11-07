<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" @click="close"></div>

      <div class="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CodeIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ step === 'create' ? 'Create New Code' : 'Capture Numbers' }}
                </h3>
                <p class="text-sm text-blue-100">
                  {{ step === 'create' ? 'Name your code and optionally add a photo' : `Capturing for: ${activeCode?.name}` }}
                </p>
              </div>
            </div>
            <button @click="close" class="text-white hover:bg-white/20 rounded-lg p-2 transition">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div v-if="step === 'create'" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Code Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="codeName"
                type="text"
                placeholder="e.g., iPhone 15 Pro, Samsung Galaxy S24"
                class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition"
                @keyup.enter="createCode"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Product Photo (Optional)
              </label>
              <div class="space-y-3">
                <div class="flex gap-3">
                  <button
                    @click="triggerFileInput"
                    class="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <CameraIcon class="w-5 h-5" />
                    <span class="font-medium">Upload Photo</span>
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                </div>

                <div v-if="photoPreview" class="relative">
                  <img :src="photoPreview" class="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700" />
                  <button
                    @click="removePhoto"
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition shadow-lg"
                  >
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                @click="close"
                class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                @click="createCode"
                :disabled="!codeName.trim()"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                Create Code
              </button>
            </div>
          </div>

          <div v-else-if="step === 'capture'" class="space-y-5">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div v-if="activeCode?.photo" class="w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-300 dark:border-blue-700">
                    <img :src="activeCode.photo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <PackageIcon class="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white text-lg">{{ activeCode?.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ activeCode?.numbers.length || 0 }} numbers captured
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="phoneNumber"
                  type="text"
                  placeholder="+216 XX XXX XXX"
                  class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition font-mono"
                  @keyup.enter="captureNumber"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="username"
                  type="text"
                  placeholder="e.g., ahmed_tech"
                  class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition"
                  @keyup.enter="captureNumber"
                />
              </div>
            </div>

            <div v-if="activeCode && activeCode.numbers.length > 0" class="max-h-48 overflow-y-auto space-y-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3">
              <div
                v-for="number in activeCode.numbers"
                :key="number.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p class="font-mono font-semibold text-gray-900 dark:text-white">{{ number.phoneNumber }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">@{{ number.username }}</p>
                </div>
                <CheckCircleIcon class="w-5 h-5 text-green-500" />
              </div>
            </div>

            <div class="flex gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-800">
              <button
                @click="captureNumber"
                :disabled="!phoneNumber.trim() || !username.trim()"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <PlusIcon class="w-5 h-5" />
                Capture Number
              </button>
              <button
                @click="finishCurrentCode"
                class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition shadow-lg"
              >
                Finish Code
              </button>
            </div>

            <button
              @click="finishSession"
              class="w-full px-6 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 font-bold rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition flex items-center justify-center gap-2"
            >
              <CheckCircleIcon class="w-5 h-5" />
              Finish Entire Session
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Code as CodeIcon, X as XIcon, Camera as CameraIcon, Package as PackageIcon, CheckCircle as CheckCircleIcon, Plus as PlusIcon } from 'lucide-vue-next'
import type { CapturedCode } from '@/lib/codeCapture'

interface Props {
  isOpen: boolean
  step: 'create' | 'capture'
  activeCode: CapturedCode | null
}

interface Emits {
  (e: 'close'): void
  (e: 'create-code', name: string, photo?: string): void
  (e: 'capture-number', phoneNumber: string, username: string): void
  (e: 'finish-code'): void
  (e: 'finish-session'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const codeName = ref('')
const photoPreview = ref<string | undefined>(undefined)
const fileInput = ref<HTMLInputElement | null>(null)
const phoneNumber = ref('')
const username = ref('')

function close() {
  codeName.value = ''
  photoPreview.value = undefined
  phoneNumber.value = ''
  username.value = ''
  emit('close')
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removePhoto() {
  photoPreview.value = undefined
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function createCode() {
  if (codeName.value.trim()) {
    emit('create-code', codeName.value.trim(), photoPreview.value)
    codeName.value = ''
    photoPreview.value = undefined
  }
}

function captureNumber() {
  if (phoneNumber.value.trim() && username.value.trim()) {
    emit('capture-number', phoneNumber.value.trim(), username.value.trim())
    phoneNumber.value = ''
    username.value = ''
  }
}

function finishCurrentCode() {
  emit('finish-code')
}

function finishSession() {
  emit('finish-session')
}
</script>
