import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { ContactSubject } from './useContactSubjects'

export interface ContactMessageUser {
  id: number
  name?: string | null
  email?: string | null
  phone?: string | null
  avatar_url?: string | null
}

export interface RepliedByAdmin {
  id: number
  name: string
  email: string
}

export interface ContactMessage {
  id: number
  name?: string | null
  email?: string | null
  phone?: string | null
  user_id?: number | null
  subject_id: number
  subject_name?: string
  message: string
  reply?: string | null
  is_replied: boolean
  replied_at?: string | null
  replied_by?: number | null
  replied_by_admin?: RepliedByAdmin | null
  user?: ContactMessageUser | null
  subject?: Pick<ContactSubject, 'id' | 'name' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>
  created_at: string
  updated_at?: string
}

export function useContactMessagesList(
  page = 1,
  search = '',
  subjectId = '',
  createdFrom = '',
  createdTo = '',
  isReplied?: boolean | string
) {
  return useQuery({
    queryKey: ['contact-messages-list', page, search, subjectId, createdFrom, createdTo, isReplied],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        subject_id: subjectId,
        created_from: createdFrom,
        created_to: createdTo,
        is_replied: isReplied,
      })
      const response = await api.get<LaravelPaginatedResponse<ContactMessage>>(`/contact-messages?${params}`)
      return response.data
    },
  })
}

export function useContactMessageDetails(id: number | null) {
  return useQuery({
    queryKey: ['contact-message', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<ContactMessage>>(`/contact-messages/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useReplyContactMessage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reply }: { id: number; reply: string }) => {
      const response = await api.post<SuccessResponse<ContactMessage>>(`/contact-messages/${id}/reply`, { reply })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['contact-messages-list'] })
      qc.invalidateQueries({ queryKey: ['contact-message', variables.id] })
      toast.success(i18n.t('contactMessageReplied'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('contactMessageReplyFailed')))
    },
  })
}

export function useDeleteContactMessage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contact-messages/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-messages-list'] })
      toast.success(i18n.t('contactMessageDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('contactMessageDeleteFailed')))
    },
  })
}
