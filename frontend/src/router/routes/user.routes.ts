import type { RouteRecordRaw } from 'vue-router'
import { requireAuth } from '@/router/guards/auth.guard'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'user',
    component: () => import('@/components/User/Layout/Layout.vue'),
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'homepage',
        component: () => import('@/views/User/Homepage.vue'),
      },
      {
        path: '/dishes',
        name: 'dishes',
        component: () => import('@/views/User/Dishes.vue'),
      },
      {
        path: '/dishes/:slug',
        name: 'dish-detail',
        component: () => import('@/views/User/DishDetail.vue'),
      },
      {
        path: '/family-manager',
        name: 'family-manager',
        component: () => import('@/views/User/FamilyManager.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/meal-plan',
        name: 'meal-plan',
        component: () => import('@/views/User/MealPlan.vue'),
        beforeEnter: requireAuth,
      },
    ],
  },
  {
    path: '/login',
    name: 'user-login',
    component: () => import('@/views/User/Login.vue'),
  },
  {
    path: '/register',
    name: 'user-register',
    component: () => import('@/views/User/Register.vue'),
  },
]

export default userRoutes
