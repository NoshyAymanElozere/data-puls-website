import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse } from '@/shared/types/laravel'
import { getEcho } from '@/shared/services/echo'
import { useProfile } from '@/features/auth/api/useAuth'

export interface AppNotification {
  id: string
  title: string
  message?: string
  read_at: string | null
  created_at: string
  data?: Record<string, unknown>
}

function formatRelativeTime(isoDate: string, lang: string) {
  const date = new Date(isoDate)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return lang === 'ar' ? 'الآن' : 'Just now'
  if (minutes < 60) return lang === 'ar' ? `منذ ${minutes} د` : `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return lang === 'ar' ? `منذ ${hours} س` : `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return lang === 'ar' ? `منذ ${days} ي` : `${days} d ago`
}

export function useNotifications() {
  const queryClient = useQueryClient()
  const { data: user } = useProfile()
  const lang = localStorage.getItem('lang') || 'en'

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get<LaravelPaginatedResponse<AppNotification>>('/notifications')
      return response.data
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (!user?.id) return

    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(`App.Models.User.${user.id}`)

    const handler = (payload: { notification?: AppNotification; id?: string; type?: string; data?: Record<string, unknown> }) => {
      const incoming: AppNotification = payload.notification ?? {
        id: payload.id ?? crypto.randomUUID(),
        title: String(payload.data?.title ?? 'New notification'),
        message: payload.data?.message ? String(payload.data.message) : undefined,
        read_at: null,
        created_at: new Date().toISOString(),
        data: payload.data,
      }

      queryClient.setQueryData<LaravelPaginatedResponse<AppNotification> | undefined>(['notifications'], (current) => {
        if (!current) return current
        return {
          ...current,
          data: [incoming, ...current.data],
          meta: { ...current.meta, total: current.meta.total + 1 },
        }
      })

      toast(incoming.title)
    }

    channel.notification(handler)

    return () => {
      channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated')
      echo.leave(`private-App.Models.User.${user.id}`)
    }
  }, [user?.id, queryClient])

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ message: string }>(`/notifications/${id}/read`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to mark notification as read.'))
    },
  })

  const markAllRead = useMutation({
    mutationFn: async () => {
      const response = await api.post<{ message: string }>('/notifications/read-all')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to mark all as read.'))
    },
  })

  const items = query.data?.data ?? []
  const unreadCount = items.filter((n) => !n.read_at).length

  return {
    notifications: items.map((n) => ({
      id: n.id,
      title: n.title,
      time: formatRelativeTime(n.created_at, lang),
      read: !!n.read_at,
    })),
    unreadCount,
    isLoading: query.isLoading,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
    isMarkingAll: markAllRead.isPending,
  }
}
