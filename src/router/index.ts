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
    },
    {
      path: '/livraison',
      name: 'livraison',
      component: () => import('@/views/LivraisonView.vue')
    },
    {
      path: '/verification',
      name: 'verification',
      component: () => import('@/views/VerificationView.vue')
    }
  ]
})

export default router
