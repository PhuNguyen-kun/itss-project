import axiosInstance from '@/utils/axiosInstance'

interface Dish {
  id: number
  name: string
  image_url: string
  slug: string
  description: string
}

interface MealPlan {
  id: number
  family_id: number
  dish_id: number
  date: string
  meal_type: number
  createdAt: string
  updatedAt: string
  dish: Dish
}

/**
 * Get all meal plans
 */
export const getAllMealPlans = async () => {
  const response = await axiosInstance.get('/user/meal-plans')
  return response.data
}

/**
 * Get meal plans by family ID
 * @param familyId - The ID of the family
 * @param params - Optional query parameters (startDate, endDate)
 */
export const getMealPlansByFamilyId = async (
  familyId: number,
  params?: { startDate?: string; endDate?: string },
) => {
  const response = await axiosInstance.get(`/user/meal-plans/family/${familyId}`, {
    params,
  })
  return response.data
}

/**
 * Add a new meal plan
 * @param mealPlan - The meal plan data to add
 */
export const addMealPlan = async (mealPlan: {
  family_id: number
  dish_id: number
  date: string
  meal_type: number
}) => {
  const response = await axiosInstance.post('/user/meal-plans', mealPlan)
  return response.data
}

/**
 * Format meal type to readable string
 * @param mealType - The meal type code
 */
export const formatMealType = (mealType: number): string => {
  switch (mealType) {
    case 1:
      return 'Bữa sáng'
    case 2:
      return 'Bữa trưa'
    case 3:
      return 'Bữa tối'
    default:
      return 'Không xác định'
  }
}

export type { MealPlan, Dish }
