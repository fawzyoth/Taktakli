<template>
  <div class="max-w-4xl mx-auto p-8 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Phone Number Card Design Examples
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Production-ready component examples showing different states and activity levels
      </p>
    </div>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Single Session User</h2>
      <button
        class="w-full bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg text-left group"
        aria-label="Phone number +1 (555) 123-4567, john_doe, 1 session, 1 submission today, 1 this week"
      >
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              J
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900 bg-gray-500"
              aria-label="Status: Not called"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                john_doe
              </h3>
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 transition-all bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                1 session
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                +1 (555) 123-4567
              </span>
            </div>

            <div class="flex items-center gap-3 mb-2.5 text-xs font-semibold flex-wrap">
              <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300" aria-label="1 submission today">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Today: 1</span>
              </div>
              <div class="w-px h-3.5 bg-gray-300 dark:bg-gray-600"></div>
              <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300" aria-label="1 submission this week">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This week: 1</span>
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>First seen 2h ago</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-gray-500"></div>
                <span>Not Called</span>
              </div>
            </div>
          </div>

          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Multiple Sessions (Medium Activity)</h2>
      <button
        class="w-full bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg text-left group"
        aria-label="Phone number +1 (555) 987-6543, sarah_miller, 3 sessions, 2 submissions today, 5 this week"
      >
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              S
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900 bg-blue-500"
              aria-label="Status: Called"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                sarah_miller
              </h3>
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 transition-all bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                3 sessions
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                +1 (555) 987-6543
              </span>
            </div>

            <div class="flex items-center gap-3 mb-2.5 text-xs font-semibold flex-wrap">
              <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300" aria-label="2 submissions today">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Today: 2</span>
              </div>
              <div class="w-px h-3.5 bg-gray-300 dark:bg-gray-600"></div>
              <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400" aria-label="5 submissions this week">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This week: 5</span>
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>First seen 5d ago</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Called</span>
              </div>
            </div>
          </div>

          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">High Activity (4+ Sessions with Pulse)</h2>
      <button
        class="w-full bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg text-left group"
        aria-label="Phone number +1 (555) 456-7890, alex_johnson, 5 sessions, 3 submissions today, 8 this week"
      >
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              A
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900 bg-green-500"
              aria-label="Status: Confirmed"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                alex_johnson
              </h3>
              <span
                class="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 transition-all bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                style="animation: pulse-badge 2s infinite"
              >
                5 sessions
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                +1 (555) 456-7890
              </span>
            </div>

            <div class="flex items-center gap-3 mb-2.5 text-xs font-semibold flex-wrap">
              <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400" aria-label="3 submissions today">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Today: 3</span>
              </div>
              <div class="w-px h-3.5 bg-gray-300 dark:bg-gray-600"></div>
              <div class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400" aria-label="8 submissions this week">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This week: 8</span>
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>First seen 3d ago</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Confirmed</span>
              </div>
            </div>
          </div>

          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Anonymous User</h2>
      <button
        class="w-full bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all hover:shadow-lg text-left group"
        aria-label="Phone number +1 (555) 111-2222, Anonymous, 2 sessions, 1 submission today, 2 this week"
      >
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              📱
            </div>
            <div
              class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white dark:border-gray-900 bg-yellow-500"
              aria-label="Status: No answer"
            ></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                Anonymous
              </h3>
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 transition-all bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                2 sessions
              </span>
            </div>

            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                +1 (555) 111-2222
              </span>
            </div>

            <div class="flex items-center gap-3 mb-2.5 text-xs font-semibold flex-wrap">
              <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300" aria-label="1 submission today">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Today: 1</span>
              </div>
              <div class="w-px h-3.5 bg-gray-300 dark:bg-gray-600"></div>
              <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300" aria-label="2 submissions this week">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>This week: 2</span>
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>First seen 1d ago</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>No Answer</span>
              </div>
            </div>
          </div>

          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </section>
  </div>
</template>

<style scoped>
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
</style>
