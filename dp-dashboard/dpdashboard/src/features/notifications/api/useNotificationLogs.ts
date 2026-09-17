import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'

export interface NotificationLogItem {
  id: string
  user_id: number
  user_name: string
  user_phone: string
  type: string
  type_label: string
  title: string
  body: string
  icon: string
  icon_bg_color: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface NotificationLogUser {
  id: number
  name: string
  phone: string
  email: string
}

export interface NotificationLogDetail {
  id: string
  type: string
  type_label: string
  title: string
  body: string
  icon: string
  icon_bg_color: string
  action_type: string | null
  action_id: number | string | null
  action_url: string | null
  data: Record<string, unknown> | null
  is_read: boolean
  read_at: string | null
  created_at: string
  user: NotificationLogUser
}

export interface NotificationLogFilterParams {
  user_id?: number | string
  type?: string
  is_read?: string | boolean
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}

export function useNotificationLogsList(filters: NotificationLogFilterParams) {
  const { page = 1, search = '', type = '', is_read = '', date_from = '', date_to = '', user_id = '', per_page = 15 } = filters

  return useQuery({
    queryKey: ['notification-logs-list', page, search, type, is_read, date_from, date_to, user_id, per_page],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        per_page,
        search,
        type,
        is_read: is_read === '' ? undefined : is_read,
        date_from,
        date_to,
        user_id,
      })
      const response = await api.get<LaravelPaginatedResponse<NotificationLogItem>>(`/notification-logs?${params}`)
      return response.data
    },
  })
}

export function useNotificationLog(id: string | null) {
  return useQuery({
    queryKey: ['notification-log', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<NotificationLogDetail>>(`/notification-logs/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useDeleteNotificationLog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<SuccessResponse<null>>(`/notification-logs/${id}`)
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-logs-list'] })
      toast.success(i18n.t('logDeletedSuccessfully'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('logDeleteFailed')))
    },
  })
}
