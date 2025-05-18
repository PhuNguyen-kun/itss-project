import axiosInstance from '@/utils/axiosInstance'
import type { LoginPayload, SignupPayload } from '@/types/Auth/auth'

export const login = async (payload: LoginPayload): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/login', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (payload: SignupPayload): Promise<any> => {
  try {
    const response = await axiosInstance.post('/auth/register', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const loginGoogle = (token: string) => {
  return axiosInstance.post('/auth/google', { token })
}
