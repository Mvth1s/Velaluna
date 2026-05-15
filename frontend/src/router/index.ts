import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/technology/:id',
      name: 'technology',
      component: () => import('../views/TechnologyView.vue')
    },
    {
      path: '/node/:id',
      name: 'node',
      component: () => import('../views/NodeView.vue')
    }
  ]
})

export default router
