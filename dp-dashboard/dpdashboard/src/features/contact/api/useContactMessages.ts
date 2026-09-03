import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { ContactSubject } from './useContactSubjects'

export interface ContactMessageUser {
  id: number
  email: string
  phone?: string
  avatar_url?: string | null
}

export interface ContactMessage {
  id: number
  user_id: number
  subject_id: number
  message: string
  user?: ContactMessageUser
  subject?: Pick<ContactSubject, 'id' | 'name' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>
  created_at: string
  updated_at?: string
}

export function useContactMessagesList(
  page = 1,
  search = '',
  subjectId = '',
  createdFrom = '',
  createdTo = ''
) {
  return useQuery({
    queryKey: ['contact-messages-list', page, search, subjectId, createdFrom, createdTo],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        subject_id: subjectId,
        created_from: createdFrom,
        created_to: createdTo,
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

export function useDeleteContactMessage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contact-messages/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-messages-list'] })
      toast.success('Message deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete message.'))
    },
  })
}
