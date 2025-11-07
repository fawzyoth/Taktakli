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
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/ShopView.vue')
    },
    {
      path: '/code-capture',
      name: 'code-capture',
      component: () => import('@/views/CodeCaptureView.vue')
    },
    {
      path: '/live-code-capture',
      name: 'live-code-capture',
      component: () => import('@/views/LiveCodeCaptureView.vue')
    }
  ]
})

export default router
