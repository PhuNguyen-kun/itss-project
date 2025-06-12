import axiosInstance from '@/utils/axiosInstance'
import type { Ingredient } from '@/types/User/dish'

interface PaginationData {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

interface GetIngredientsParams {
  page?: number
  per_page?: number
}

interface IngredientsResponse {
  success: boolean
  message: string
  data: Ingredient[]
  pagination?: PaginationData
}

/**
 * Get all ingredients with optional pagination
 * @param params - Pagination parameters
 * @returns Promise with ingredients data
 */
export const getAllIngredients = async (
  params?: GetIngredientsParams,
): Promise<IngredientsResponse> => {
  try {
    const response = await axiosInstance.get('/user/ingredients', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get ingredient by id
 * @param id - Ingredient id
 * @returns Promise with ingredient data
 */
export const getIngredientById = async (
  id: number,
): Promise<{ success: boolean; message: string; data: Ingredient }> => {
  try {
    const response = await axiosInstance.get(`/user/ingredients/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
