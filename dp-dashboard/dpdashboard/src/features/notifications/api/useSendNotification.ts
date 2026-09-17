import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'

export interface SendNotificationPayload {
  target_type: 'all' | 'single'
  user_id?: number | null
  title: {
    en: string
    ar: string
  }
  body: {
    en: string
    ar: string
  }
  type?: string
  icon?: string
  icon_bg_color?: string
  action_type?: string | null
  action_id?: number | string | null
  action_url?: string | null
  data?: Record<string, unknown> | null
}

export interface SendNotificationResponse {
  success: boolean
  message: string
  data?: {
    id?: string
    target_type?: 'all' | 'single'
    recipients_count?: number
    title?: string
    body?: string
    [key: string]: unknown
  }
}

export function useSendNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SendNotificationPayload): Promise<SendNotificationResponse> => {
      const formData = new FormData()
      formData.append('target_type', payload.target_type)

      if (payload.target_type === 'single' && payload.user_id) {
        formData.append('user_id', String(payload.user_id))
      }

      formData.append('title[en]', payload.title.en.trim())
      formData.append('title[ar]', payload.title.ar.trim())
      formData.append('body[en]', payload.body.en.trim())
      formData.append('body[ar]', payload.body.ar.trim())

      if (payload.type) {
        formData.append('type', payload.type)
      }
      if (payload.icon) {
        formData.append('icon', payload.icon)
      }
      if (payload.icon_bg_color) {
        formData.append('icon_bg_color', payload.icon_bg_color)
      }
      if (payload.action_type) {
        formData.append('action_type', payload.action_type)
      }
      if (payload.action_id !== undefined && payload.action_id !== null && String(payload.action_id).trim() !== '') {
        formData.append('action_id', String(payload.action_id))
      }
      if (payload.action_url && payload.action_url.trim() !== '') {
        formData.append('action_url', payload.action_url.trim())
      }
      if (payload.data && Object.keys(payload.data).length > 0) {
        formData.append('data', JSON.stringify(payload.data))
      }

      const res = await api.post<SendNotificationResponse>('/notifications/send', formData)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notification-logs-list'] })
      queryClient.invalidateQueries({ queryKey: ['notification-logs'] })

      if (data?.data?.recipients_count) {
        toast.success(
          i18n.t('notificationSentToUsers', { count: data.data.recipients_count }) ||
            data.message ||
            'Notification sent successfully.'
        )
      } else {
        toast.success(data?.message || i18n.t('notificationSentSuccess') || 'Notification sent successfully.')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('sendNotificationFailed')))
    },
  })
}
