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
      path: '/themes',
      name: 'themes',
      component: () => import('../views/ThemesView.vue')
    },
    {
      path: '/themes/:themeId',
      name: 'theme',
      component: () => import('../views/ThemeView.vue')
    },
    {
      path: '/themes/:themeId/:techId',
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
