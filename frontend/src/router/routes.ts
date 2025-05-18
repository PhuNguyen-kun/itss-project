import type { RouteRecordRaw } from 'vue-router'
import adminRoutes from './routes/admin.routes'
import userRoutes from '@/router/routes/user.routes'

const routes: RouteRecordRaw[] = [...adminRoutes, ...userRoutes]

export default routes
