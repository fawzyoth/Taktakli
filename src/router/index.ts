import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/capture/:id',
      name: 'capture',
      component: () => import('@/views/CaptureMonitorView.vue')
    },
    {
      path: '/pages',
      name: 'pages',
      component: () => import('@/views/PagesView.vue')
    }
  ]
})

export default router
