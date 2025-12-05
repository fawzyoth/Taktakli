<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click.self="handleOverlayClick"
        @keydown.esc="closeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        tabindex="-1"
        ref="modalRef"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

        <div
          class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10 group"
            aria-label="إغلاق النافذة"
            ref="closeButtonRef"
          >
            <XIcon class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
          </button>

          <div class="p-6 sm:p-8 lg:p-10" dir="rtl">
            <div class="text-center mb-6">
              <h2
                id="welcome-modal-title"
                class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
              >
                نعتذر منكم 🙏
              </h2>
            </div>

            <div
              id="welcome-modal-description"
              class="space-y-4 text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed"
            >
              <p>
                لقد مررنا بعطلة أسبوع صعبة أثّرت بشكل كبير على سير عملكم.
              </p>

              <p>
                تعرّضنا لـ<strong class="text-gray-900 dark:text-white">هجوم إلكتروني غير متوقّع</strong>، لكننا نطمئنكم أنّ <strong class="text-green-600 dark:text-green-400">جميع بياناتكم كانت ولا تزال محفوظة ومحمية بالكامل</strong> بفضل أنظمة الأمان لدينا.
              </p>

              <div class="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-700 rounded-xl p-6 my-6">
                <p class="text-gray-800 dark:text-gray-200 mb-3">
                  ونظرًا للإزعاج الذي سبّبه هذا الأمر، قررنا أن نقدّم لكم تخفيضًا بنسبة
                </p>
                <div class="text-center">
                  <span class="inline-block text-5xl sm:text-6xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    30%
                  </span>
                  <p class="text-lg sm:text-xl font-semibold text-orange-700 dark:text-orange-400 mt-2">
                    على اشتراككم للشهر القادم
                  </p>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 my-6">
                <p class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ولدينا أيضًا خبر سار 🎉
                </p>
                <p class="text-gray-800 dark:text-gray-200">
                  لقد عقدنا <strong class="text-green-700 dark:text-green-400">شراكة جديدة مع شركة توصيل</strong> بهدف تسريع وتسهيل عملية توصيل طلباتكم وتحسين تجربة عملائكم بشكل كبير.
                </p>
              </div>

              <p class="text-center text-gray-700 dark:text-gray-300">
                شكرًا لـ<strong class="text-gray-900 dark:text-white">تفهّمكم</strong> و<strong class="text-gray-900 dark:text-white">ثقتكم</strong> بنا
              </p>

              <p class="text-center text-sm text-gray-600 dark:text-gray-400 italic">
                ونعتذر مرة أخرى على هذا الخلل.
              </p>
            </div>

            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                @click="closeModal"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-500/50"
                ref="okButtonRef"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { X as XIcon } from 'lucide-vue-next'

const STORAGE_KEY = 'welcome-modal-seen'

const isVisible = ref(false)
const modalRef = ref<HTMLElement>()
const closeButtonRef = ref<HTMLElement>()
const okButtonRef = ref<HTMLElement>()

function checkFirstVisit(): boolean {
  try {
    const hasSeenModal = localStorage.getItem(STORAGE_KEY)
    return !hasSeenModal
  } catch (error) {
    console.error('Error checking localStorage:', error)
    return false
  }
}

function markModalAsSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

function closeModal() {
  isVisible.value = false
  markModalAsSeen()
  enableBodyScroll()
}

function handleOverlayClick() {
  closeModal()
}

function disableBodyScroll() {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = getScrollbarWidth() + 'px'
}

function enableBodyScroll() {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth
}

function handleKeydown(event: KeyboardEvent) {
  if (!isVisible.value) return

  if (event.key === 'Escape') {
    closeModal()
    return
  }

  if (event.key === 'Tab') {
    trapFocus(event)
  }
}

function trapFocus(event: KeyboardEvent) {
  if (!modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement?.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement?.focus()
      event.preventDefault()
    }
  }
}

onMounted(async () => {
  if (checkFirstVisit()) {
    await nextTick()
    isVisible.value = true
    disableBodyScroll()

    await nextTick()
    closeButtonRef.value?.focus()
  }

  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  enableBodyScroll()
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.9);
  opacity: 0;
}
</style>
