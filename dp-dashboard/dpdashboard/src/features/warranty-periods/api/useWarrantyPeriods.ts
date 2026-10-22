import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { WarrantyPeriodFormValues } from '../pages/validationSchema'

export interface WarrantyPeriod {
  id: number
  duration: number
  unit: 'month' | 'year'
  name?: string | Translatable | null
  sort_order: number
  is_active: boolean
  months: number // computed server-side
  created_at?: string
  updated_at?: string
}

function toApiBody(payload: WarrantyPeriodFormValues) {
  return {
    duration: payload.duration,
    unit: payload.unit,
    name: (payload.nameEn || payload.nameAr) ? { en: payload.nameEn || null, ar: payload.nameAr || null } : null,
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  }
}

export function useWarrantyPeriodsList(page = 1, search = '', isActive = '', unit = '') {
  return useQuery({
    queryKey: ['warranty-periods-list', page, search, isActive, unit],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive, unit })
      const response = await api.get<LaravelPaginatedResponse<WarrantyPeriod>>(`/warranty-periods?${params}`)
      return response.data
    },
  })
}

export function useWarrantyPeriod(id: number | null) {
  return useQuery({
    queryKey: ['warranty-period', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<WarrantyPeriod>>(`/warranty-periods/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateWarrantyPeriod(setError?: UseFormSetError<WarrantyPeriodFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: WarrantyPeriodFormValues) => {
      const response = await api.post<SuccessResponse<WarrantyPeriod>>(
        '/warranty-periods',
        toApiBody(payload)
      )
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warranty-periods-list'] })
      toast.success(i18n.t('warrantyPeriodCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('warrantyPeriodCreateFailed')))
    },
  })
}

export function useUpdateWarrantyPeriod(setError?: UseFormSetError<WarrantyPeriodFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: WarrantyPeriodFormValues }) => {
      const response = await api.put<SuccessResponse<WarrantyPeriod>>(
        `/warranty-periods/${id}`,
        toApiBody(payload)
      )
      return response.data
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['warranty-periods-list'] })
      qc.invalidateQueries({ queryKey: ['warranty-period', variables.id] })
      toast.success(i18n.t('warrantyPeriodUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('warrantyPeriodUpdateFailed')))
    },
  })
}

export function useDeleteWarrantyPeriod() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/warranty-periods/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warranty-periods-list'] })
      toast.success(i18n.t('warrantyPeriodDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('warrantyPeriodDeleteFailed')))
    },
  })
}

export function useToggleWarrantyPeriodStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<WarrantyPeriod>>(`/warranty-periods/${id}/status`)
      return response.data
    },
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ['warranty-periods-list'] })
      qc.invalidateQueries({ queryKey: ['warranty-period', id] })
      toast.success(i18n.t('warrantyPeriodStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('warrantyPeriodStatusFailed')))
    },
  })
}

export function getWarrantyPeriodName(period: WarrantyPeriod, lang = 'en'): string {
  if (period.name) {
    return getLocalizedValue(period.name, lang)
  }
  // Fallback to auto-generated label if name is not set
  if (lang === 'ar') {
    const unitStr = period.unit === 'year' ? 'سنة' : 'شهر'
    return `${period.duration} ${unitStr}`
  } else {
    const unitStr = period.unit === 'year' ? (period.duration > 1 ? 'Years' : 'Year') : (period.duration > 1 ? 'Months' : 'Month')
    return `${period.duration} ${unitStr}`
  }
}
