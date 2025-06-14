import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('@/views/Admin/Login.vue'),
  },
  {
    path: '/admin/home',
    name: 'admin-home',
    component: () => import('@/components/Admin/Layout.vue'),
    redirect: '/admin/dishes',
    children: [
      {
        path: '/admin/dishes',
        name: 'admin-dishes',
        component: () => import('@/views/Admin/Dishes.vue'),
      },
      {
        path: '/admin/ingredients',
        name: 'admin-ingredients',
        component: () => import('@/views/Admin/Ingredients.vue'),
      },
      {
        path: '/admin/families',
        name: 'admin-families',
        component: () => import('@/views/Admin/Families.vue'),
      },
    ],
  },
]

export default adminRoutes
