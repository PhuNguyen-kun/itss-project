import axiosInstance from '@/utils/axiosInstance'

interface FamilyMember {
  id: number
  full_name: string
  email: string
  phone_number?: string
  gender?: number
  birth_date?: string
  avatar_url?: string
  family_role?: number
}

interface Family {
  id: number
  name: string
  users: FamilyMember[]
  createdAt: string
  updatedAt: string
}

/**
 * Get all families
 */
export const getAllFamilies = async () => {
  const response = await axiosInstance.get('/user/families')
  return response.data
}

/**
 * Get family by ID
 */
export const getFamilyById = async (id: number) => {
  const response = await axiosInstance.get(`/user/families/${id}`)
  return response.data
}

/**
 * Get family of the currently logged-in user
 */
export const getMyFamily = async () => {
  const response = await axiosInstance.get('/user/families/me')
  return response.data
}

export type { Family, FamilyMember }
