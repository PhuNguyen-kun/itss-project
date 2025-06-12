import axiosInstance from '@/utils/axiosInstance'

interface ProfileUpdateData {
  full_name?: string
  phone_number?: string
  gender?: number
  birth_date?: string
  avatar_url?: string
  family_role?: number
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile')
  return response.data
}

/**
 * Update user profile
 * @param data - Profile data to update
 */
export const updateUserProfile = async (data: ProfileUpdateData) => {
  const response = await axiosInstance.put('/user/profile', data)
  return response.data
}

/**
 * Change user password
 * @param data - Password change data
 */
export const changePassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.put('/user/profile/change-password', data)
  return response.data
}

/**
 * Format gender to readable string
 * @param genderCode - Gender code (0: Male, 1: Female, 2: Other)
 */
export const formatGender = (genderCode: number | null | undefined): string => {
  switch (genderCode) {
    case 0:
      return 'Nam'
    case 1:
      return 'Nữ'
    case 2:
      return 'Khác'
    default:
      return 'Không xác định'
  }
}

/**
 * Format family role to readable string
 * @param roleCode - Family role code (0: Housekeeper, 1: Family member)
 */
export const formatFamilyRole = (roleCode: number | null | undefined): string => {
  switch (roleCode) {
    case 0:
      return 'Người quản lý'
    case 1:
      return 'Thành viên'
    default:
      return 'Không xác định'
  }
}

export type { ProfileUpdateData, ChangePasswordData }
