import axios, { type AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { AUTH_TOKEN_KEY, eraseCookie, getCookie } from '@/shared/utils/cookies'
import { getAdminApiBaseUrl } from '@/shared/utils/public-api-url'

const api = axios.create({
  baseURL: getAdminApiBaseUrl(),
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type LaravelValidationErrors = Record<string, string[]>

export function getValidationErrors(error: unknown): LaravelValidationErrors | null {
  const axiosError = error as AxiosError<{ errors?: LaravelValidationErrors }>
  return axiosError?.response?.data?.errors ?? null
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<{ message?: string }>
  return axiosError?.response?.data?.message ?? axiosError?.message ?? fallback
}

api.interceptors.request.use(
  (config) => {
    const token = getCookie(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Language'] = localStorage.getItem('lang') || 'en'
    // Let the browser set multipart boundary when uploading files
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message = getErrorMessage(error)

    if (status === 401) {
      eraseCookie(AUTH_TOKEN_KEY)
      if (error?.config?.url && !String(error.config.url).includes('/login')) {
        toast.error('Session expired. Please log in again.')
      }
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (status === 422) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
