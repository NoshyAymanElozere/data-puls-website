import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface ContactSubject {
  id: number
  name: string | Translatable
  sort_order: number
  is_active: boolean
  created_at?: string
}

export interface ContactSubjectFormData {
  nameEn: string
  nameAr: string
  sort_order: number
  is_active: boolean
}

function toApiPayload(payload: ContactSubjectFormData) {
  return {
    name: { en: payload.nameEn, ar: payload.nameAr },
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  }
}

export function useContactSubjectsList(page = 1, search = '', isActive = '') {
  return useQuery({
    queryKey: ['contact-subjects-list', page, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive })
      const response = await api.get<LaravelPaginatedResponse<ContactSubject>>(`/contact-subjects?${params}`)
      return response.data
    },
  })
}

export function useActiveContactSubjects() {
  return useQuery({
    queryKey: ['contact-subjects-active'],
    queryFn: async () => {
      const params = new URLSearchParams({ is_active: 'true', per_page: '100' })
      const response = await api.get<LaravelPaginatedResponse<ContactSubject>>(`/contact-subjects?${params}`)
      return response.data.data
    },
  })
}

export function useContactSubject(id: number | null) {
  return useQuery({
    queryKey: ['contact-subject', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<ContactSubject>>(`/contact-subjects/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateContactSubject(setError?: UseFormSetError<ContactSubjectFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ContactSubjectFormData) => {
      const response = await api.post<SuccessResponse<ContactSubject>>('/contact-subjects', toApiPayload(payload))
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['contact-subjects-list'] })
      qc.invalidateQueries({ queryKey: ['contact-subjects-active'] })
      toast.success(res.message || 'Contact subject created successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to create contact subject.'))
    },
  })
}

export function useUpdateContactSubject(setError?: UseFormSetError<ContactSubjectFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ContactSubjectFormData }) => {
      const response = await api.put<SuccessResponse<ContactSubject>>(`/contact-subjects/${id}`, toApiPayload(payload))
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['contact-subjects-list'] })
      qc.invalidateQueries({ queryKey: ['contact-subjects-active'] })
      qc.invalidateQueries({ queryKey: ['contact-subject', variables.id] })
      toast.success(res.message || 'Contact subject updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update contact subject.'))
    },
  })
}

export function useDeleteContactSubject() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contact-subjects/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-subjects-list'] })
      qc.invalidateQueries({ queryKey: ['contact-subjects-active'] })
      toast.success('Contact subject deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete contact subject.'))
    },
  })
}

export function useToggleContactSubjectStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<ContactSubject>>(`/contact-subjects/${id}/status`)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['contact-subjects-list'] })
      qc.invalidateQueries({ queryKey: ['contact-subjects-active'] })
      toast.success(res.message || 'Status updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status.'))
    },
  })
}

export function getSubjectName(name: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(name, lang)
}
