import axios from 'axios'
import toast from 'react-hot-toast'
import { getCookie, eraseCookie } from '@/shared/utils/cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.example.com/v1',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token and lang headers
api.interceptors.request.use(
  (config) => {
    const token = getCookie('dpulse-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Language'] = localStorage.getItem('lang') || 'en'
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message: string =
      error?.response?.data?.message ?? error?.message ?? 'Something went wrong'

    if (status === 401) {
      eraseCookie('dpulse-token')
      if (error?.config?.url && !error.config.url.includes('/admin/login')) {
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
