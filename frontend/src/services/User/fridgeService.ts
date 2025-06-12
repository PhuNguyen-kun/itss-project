import axiosInstance from '@/utils/axiosInstance'

interface FridgeItem {
  id: number
  family_id: number
  ingredient_id: number
  quantity: number
  unit: number
  expiry_date: string | null
  createdAt: string
  updatedAt: string
  ingredient: {
    id: number
    name: string
    image_url: string
  }
}

/**
 * Get all fridge items for a family
 * @param familyId - The family ID
 */
export const getFamilyFridgeItems = async (familyId: number) => {
  const response = await axiosInstance.get(`/user/fridge/family/${familyId}`)
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
 * Delete an ingredient from fridge
 * @param data - Delete data including family_id, ingredient_id, and unit
 */
export const deleteFromFridge = async (data: {
  family_id: number
  ingredient_id: number
  unit: number
}) => {
  const response = await axiosInstance.delete('/user/fridge', { data })
  return response.data
}

export type { FridgeItem }
