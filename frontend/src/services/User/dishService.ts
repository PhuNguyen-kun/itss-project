import axiosInstance from '@/utils/axiosInstance'
import type { DishResponse, DishDetailResponse } from '@/types/User/dish'

interface GetDishesParams {
  page?: number
  per_page?: number
  search?: string
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

/**
 * Upload a dish image
 * @param file - The image file to upload
 * @returns Promise with the image URL data
 */
export const uploadDishImage = async (
  file: File,
): Promise<{ imageUrl: string; fullImageUrl: string }> => {
  try {
    const formData = new FormData()
    formData.append('dish_image', file)

    const response = await axiosInstance.post('/uploads/dish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.data
  } catch (error) {
    throw error
  }
}

/**
 * Interface for creating a new dish
 */
export interface CreateDishData {
  name: string
  image_url: string
  description?: string
  instructions: string
  ingredients: {
    id: number
    quantity: number
    unit: number
    price: number
  }[]
}

/**
 * Create a new dish
 * @param dishData - Data for creating the dish
 * @returns Promise with the created dish data
 */
export const createDish = async (dishData: CreateDishData): Promise<DishDetailResponse> => {
  try {
    const response = await axiosInstance.post('/user/dishes', dishData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getFavoriteDishes = async (params?: GetDishesParams) => {
  try {
    const response = await axiosInstance.get('/user/favorites', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Delete a dish by id
 * @param id - Dish id
 * @returns Promise with success status
 */
export const deleteDish = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/user/dishes/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
