import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { Admin, ChangePasswordPayload } from '@/shared/types/admin'
import { AUTH_TOKEN_KEY, eraseCookie, getCookie, setCookie } from '@/shared/utils/cookies'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import { disconnectEcho } from '@/shared/services/echo'
import type { UseFormSetError } from 'react-hook-form'

interface LoginResponse {
  success: boolean
  message: string
  data: {
    admin: Admin
    token: string
    token_type: string
  }
}

interface ProfileResponse {
  success?: boolean
  data: Admin
}

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<LoginResponse>('/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      setCookie(AUTH_TOKEN_KEY, data.data.token)
      queryClient.setQueryData(['auth-user'], data.data.admin)
      toast.success(data.message || i18n.t('loggedInSuccessfully'))
      navigate('/')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('invalidCredentials')))
    },
  })
}

export function useProfile() {
  const token = getCookie(AUTH_TOKEN_KEY)

  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/me')
      return response.data.data
    },
    enabled: !!token,
    retry: false,
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ success: boolean; message: string }>('/logout')
      return response.data
    },
    onSuccess: (data) => {
      eraseCookie(AUTH_TOKEN_KEY)
      disconnectEcho()
      queryClient.clear()
      toast.success(data.message || i18n.t('loggedOutSuccessfully'))
      navigate('/login')
    },
    onError: () => {
      eraseCookie(AUTH_TOKEN_KEY)
      disconnectEcho()
      queryClient.clear()
      toast.success(i18n.t('loggedOutSuccessfully'))
      navigate('/login')
    },
  })
}

export function useChangePassword(setError?: UseFormSetError<ChangePasswordPayload>) {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await api.patch<{ success: boolean; message: string }>('/me/password', payload)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || i18n.t('passwordChangedSuccess'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('passwordChangeFailed')))
    },
  })
}

export type { Admin }
