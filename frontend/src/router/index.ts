import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [  
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/', redirect: '/login' }
  ],
})

export default router
