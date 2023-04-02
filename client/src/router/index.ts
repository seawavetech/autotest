import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Test from '../views/test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },{
      path: '/test',
      name: 'test',
      component: Test
    }
  ]
})

export default router
