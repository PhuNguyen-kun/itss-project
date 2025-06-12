import axiosInstance from '@/utils/axiosInstance'

interface Ingredient {
  id: number
  name: string
  image_url: string
}

interface MealPlan {
  id: number
  dish: {
    id: number
    name: string
    image_url: string
  }
}

interface CartItem {
  id: number
  meal_plan_id: number
  user_id: number
  ingredient_id: number
  quantity: number
  unit: number
  status: number
  completed_at: string | null
  createdAt: string
  updatedAt: string
  ingredient: Ingredient
  meal_plan: MealPlan
}

interface FamilyMember {
  id: number
  full_name: string
  email: string
  avatar_url: string
  role: number
  cart_items: CartItem[]
}

interface CartResponse {
  family: {
    id: number
    name: string
  }
  members: FamilyMember[]
}

/**
 * Get cart items for the current logged-in user
 */
export const getMyCartItems = async () => {
  const response = await axiosInstance.get('/user/cart')
  return response.data
}

/**
 * Get cart items for a specific family
 * @param familyId - The ID of the family
 */
export const getCartItemsByFamilyId = async (familyId: number) => {
  const response = await axiosInstance.get(`/user/cart/family/${familyId}`)
  return response.data
}

/**
 * Assign ingredients to family members from meal plans
 * @param data - Assignment data including familyId, mealPlanIds and memberIds
 */
export const assignIngredientsToFamilyMembers = async (data: {
  familyId: number
  mealPlanIds: number[]
  memberIds: number[]
}) => {
  const response = await axiosInstance.post('/user/cart/assign', data)
  return response.data
}

/**
 * Format unit to readable string
 * @param unitCode - The unit code
 */
export const formatUnit = (unitCode: number): string => {
  switch (unitCode) {
    case 1:
      return 'g'
    case 2:
      return 'ml'
    case 3:
      return 'cái'
    case 4:
      return 'lát'
    case 5:
      return 'thìa cà phê'
    default:
      return ''
  }
}

/**
 * Update cart item status
 * @param id - Cart item ID
 * @param status - New status (0: not purchased, 1: purchased)
 * @param familyId - Family ID for adding to fridge
 */
export const updateCartItemStatus = async (id: number, status: number, familyId: number) => {
  const response = await axiosInstance.patch(`/user/cart/${id}/status`, {
    status,
    family_id: familyId,
  })
  return response.data
}

export type { CartItem, CartResponse, FamilyMember }
