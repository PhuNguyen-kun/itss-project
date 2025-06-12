import axiosInstance from '@/utils/axiosInstance'

/**
 * Upload a file to the server
 * @param file - The file to upload
 * @param endpoint - The API endpoint for the upload
 * @returns Promise with the upload response
 */
export const uploadFile = async (file: File, endpoint: string) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await axiosInstance.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * Upload user avatar
 * @param file - The avatar image file to upload
 * @returns Promise with the upload response containing the avatar URL
 */
export const uploadAvatar = async (file: File) => {
  return uploadFile(file, '/uploads/avatar')
}
