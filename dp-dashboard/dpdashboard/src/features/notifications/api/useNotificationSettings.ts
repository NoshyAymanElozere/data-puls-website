import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { SuccessResponse, Translatable } from '@/shared/types/laravel'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface NotificationSettingConfig {
  days_before?: number
  [key: string]: unknown
}

export interface NotificationSettingListItem {
  id: number
  key: string
  name: string | Translatable
  title: string | Translatable
  body: string | Translatable
  icon: string
  icon_bg_color: string
  is_active: boolean
  channels: string[]
  config: NotificationSettingConfig | null
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface NotificationSettingDetail {
  id: number
  key: string
  name: string | Translatable
  title: Translatable
  body: Translatable
  icon: string
  icon_bg_color: string
  is_active: boolean
  channels: string[]
  config: NotificationSettingConfig | null
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface NotificationSettingFormValues {
  title_en: string
  title_ar: string
  body_en: string
  body_ar: string
  icon: string
  icon_bg_color: string
  days_before?: number | null
  is_active: boolean
}

export function useNotificationSettingsList() {
  return useQuery({
    queryKey: ['notification-settings-list'],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<NotificationSettingListItem[]>>('/notification-settings')
      return response.data.data
    },
  })
}

export function useNotificationSetting(id: number | null) {
  return useQuery({
    queryKey: ['notification-setting', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<NotificationSettingDetail>>(`/notification-settings/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useUpdateNotificationSetting(setError?: UseFormSetError<NotificationSettingFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: NotificationSettingFormValues }) => {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      if (payload.title_en !== undefined) formData.append('title[en]', payload.title_en)
      if (payload.title_ar !== undefined) formData.append('title[ar]', payload.title_ar)
      if (payload.body_en !== undefined) formData.append('body[en]', payload.body_en)
      if (payload.body_ar !== undefined) formData.append('body[ar]', payload.body_ar)
      if (payload.icon !== undefined) formData.append('icon', payload.icon)
      if (payload.icon_bg_color !== undefined) formData.append('icon_bg_color', payload.icon_bg_color)
      if (payload.days_before !== undefined && payload.days_before !== null) {
        formData.append('days_before', String(payload.days_before))
      }
      formData.append('is_active', payload.is_active ? '1' : '0')

      const response = await api.post<SuccessResponse<NotificationSettingListItem>>(
        `/notification-settings/${id}`,
        formData
      )
      return response.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['notification-settings-list'] })
      qc.invalidateQueries({ queryKey: ['notification-setting', id] })
      toast.success(i18n.t('settingUpdatedSuccessfully'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('settingUpdateFailed')))
    },
  })
}

export function useToggleNotificationSettingStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const formData = new FormData()
      formData.append('_method', 'PATCH')
      formData.append('is_active', is_active ? '1' : '0')

      const response = await api.post<SuccessResponse<{ id: number; is_active: boolean }>>(
        `/notification-settings/${id}/status`,
        formData
      )
      return response.data
    },
    onMutate: async ({ id, is_active }) => {
      await qc.cancelQueries({ queryKey: ['notification-settings-list'] })
      const previousList = qc.getQueryData<NotificationSettingListItem[]>(['notification-settings-list'])

      if (previousList) {
        qc.setQueryData<NotificationSettingListItem[]>(['notification-settings-list'], (old) =>
          old?.map((item) => (item.id === id ? { ...item, is_active } : item))
        )
      }

      return { previousList }
    },
    onError: (error, _, context) => {
      if (context?.previousList) {
        qc.setQueryData(['notification-settings-list'], context.previousList)
      }
      toast.error(getErrorMessage(error, i18n.t('settingStatusFailed')))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-settings-list'] })
      toast.success(i18n.t('settingStatusUpdated'))
    },
  })
}
