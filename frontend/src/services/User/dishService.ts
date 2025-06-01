import axiosInstance from '@/utils/axiosInstance'
import type { DishResponse, DishDetailResponse } from '@/types/User/dish'

interface GetDishesParams {
  page?: number
  per_page?: number
}

/**
 * Get all dishes with optional pagination
 * @param params - Pagination parameters
 * @returns Promise with dish data
 */
export const getAllDishes = async (params?: GetDishesParams): Promise<DishResponse> => {
  try {
    const response = await axiosInstance.get('/user/dishes', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get dish by id
 * @param id - Dish id
 * @returns Promise with dish data
 */
export const getDishById = async (id: number): Promise<DishDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/user/dishes/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getDishBySlug = async (slug: string): Promise<DishDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/user/dishes/${slug}`)
    return response.data
  } catch (error) {
    throw error
  }
}
