import type { RouteRecordRaw } from 'vue-router'

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
