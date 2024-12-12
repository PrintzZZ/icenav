import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'


const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL), //开发
  history: createWebHashHistory(import.meta.env.BASE_URL), //哈希模式
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MainContent.vue'),
    },{
      path: '/404',
      name: '404',
      component: () => import('../components/404.vue'),
    }
  ]
})

export default router
