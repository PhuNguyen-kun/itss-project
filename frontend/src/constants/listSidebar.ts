interface MenuItems {
  name?: string
  icon?: any
  href?: string
  separator?: boolean
  action?: string
}

import DashboardIcon from '@/assets/img/Admin/dashboard.svg'
import OrderListsIcon from '@/assets/img/Admin/order-lists.svg'
import ProductStockIcon from '@/assets/img/Admin/product-stock.svg'
import ContactIcon from '@/assets/img/Admin/contact.svg'
import UiElementsIcon from '@/assets/img/Admin/ui-elements.svg'
import TeamIcon from '@/assets/img/Admin/team.svg'
import TableIcon from '@/assets/img/Admin/table.svg'
import LogoutIcon from '@/assets/img/Admin/logout.svg'

export const menuItems: MenuItems[] = [
  { name: 'Quản lý món ăn', icon: ContactIcon, href: '/admin/dishes' },
  { name: 'Quản lý nguyên liệu', icon: TeamIcon, href: '/admin/ingredients' },
  { name: 'Quản lý gia đình', icon: TeamIcon, href: '/admin/families' },
  { separator: true },
  { name: 'Đăng xuất', icon: LogoutIcon, action: 'logout' },
]
