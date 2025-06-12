import axiosInstance from '@/utils/axiosInstance'
import type { Dish } from '@/types/User/dish'

interface FavoriteResponse {
  id: number
  user_id: number
  dish_id: number
  dish: Dish
  createdAt: string
  updatedAt: string
}

/**
 * Get all favorite dishes for the current user
 */
export const getUserFavorites = async () => {
  const response = await axiosInstance.get('/user/favorites')
  return response.data
}

/**
 * Get favorite dishes for a specific user
 * @param userId - The ID of the user
 */
export const getFavoritesByUserId = async (userId: number) => {
  const response = await axiosInstance.get(`/user/favorites/user/${userId}`)
  return response.data
}

/**
 * Add a dish to favorites
 * @param dishId - The ID of the dish to add to favorites
 */
export const addToFavorites = async (dishId: number) => {
  const response = await axiosInstance.post('/user/favorites', { dish_id: dishId })
  return response.data
}

/**
 * Remove a dish from favorites
 * @param dishId - The ID of the dish to remove from favorites
 */
export const removeFromFavorites = async (dishId: number) => {
  const response = await axiosInstance.delete(`/user/favorites/${dishId}`)
  return response.data
}

/**
 * Check if a dish is in the user's favorites
 * @param dishId - The ID of the dish to check
 */
export const checkIsFavorite = async (dishId: number) => {
  const response = await axiosInstance.get(`/user/favorites/check/${dishId}`)
  return response.data
}

export type { FavoriteResponse }
