import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Components from '../views/Components.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/components',
      name: 'components',
      component: Components
    }
  ]
})

export default router 