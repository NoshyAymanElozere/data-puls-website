import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import type { UseFormSetError } from 'react-hook-form'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { PartnerSectorFormValues } from '../pages/validationSchema'

export interface PartnerSector {
  id: number
  slug?: string
  /** Current-locale string on list/store/update; `{ en, ar }` on show. */
  name: string | Translatable
  partners_count: number
  is_active: boolean
  status: 'active' | 'inactive'
  status_label: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

/** Maps Laravel validation keys to form field names. */
const FIELD_MAP: Record<string, string> = { 'name.en': 'nameEn', 'name.ar': 'nameAr' }

function toPayload(values: PartnerSectorFormValues) {
  return {
    name: { en: values.nameEn, ar: values.nameAr },
    is_active: values.is_active,
    sort_order: Number(values.sort_order) || 0,
  }
}

export function usePartnerSectorsList(page = 1, search = '', isActive = '') {
  return useQuery({
    queryKey: ['partner-sectors-list', page, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive })
      const response = await api.get<LaravelPaginatedResponse<PartnerSector>>(`/partner-sectors?${params}`)
      return response.data
    },
  })
}

/** All sectors (max 100) for select inputs and filters. */
export function usePartnerSectorOptions(options?: { activeOnly?: boolean }) {
  const activeOnly = options?.activeOnly ?? false
  return useQuery({
    queryKey: ['partner-sectors-options', activeOnly],
    queryFn: async () => {
      const params = buildQueryParams({ per_page: 100, is_active: activeOnly ? 'true' : undefined })
      const response = await api.get<LaravelPaginatedResponse<PartnerSector>>(`/partner-sectors?${params}`)
      return response.data.data
    },
    staleTime: 60 * 1000,
  })
}

export function usePartnerSector(id: number | null) {
  return useQuery({
    queryKey: ['partner-sector', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<PartnerSector>>(`/partner-sectors/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

function invalidateSectorLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['partner-sectors-list'] })
  qc.invalidateQueries({ queryKey: ['partner-sectors-options'] })
}

export function useCreatePartnerSector(setError?: UseFormSetError<PartnerSectorFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (values: PartnerSectorFormValues) => {
      const response = await api.post<SuccessResponse<PartnerSector>>('/partner-sectors', toPayload(values))
      return response.data
    },
    onSuccess: () => {
      invalidateSectorLists(qc)
      toast.success(i18n.t('partnerSectorCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError, FIELD_MAP)) return
      toast.error(getErrorMessage(error, i18n.t('partnerSectorCreateFailed')))
    },
  })
}

export function useUpdatePartnerSector(setError?: UseFormSetError<PartnerSectorFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: PartnerSectorFormValues }) => {
      const response = await api.put<SuccessResponse<PartnerSector>>(`/partner-sectors/${id}`, toPayload(values))
      return response.data
    },
    onSuccess: (_res, variables) => {
      invalidateSectorLists(qc)
      qc.invalidateQueries({ queryKey: ['partner-sector', variables.id] })
      qc.invalidateQueries({ queryKey: ['partners-list'] })
      toast.success(i18n.t('partnerSectorUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError, FIELD_MAP)) return
      toast.error(getErrorMessage(error, i18n.t('partnerSectorUpdateFailed')))
    },
  })
}

export function useTogglePartnerSectorStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<PartnerSector>>(`/partner-sectors/${id}/status`)
      return response.data
    },
    onSuccess: (_res, id) => {
      invalidateSectorLists(qc)
      qc.invalidateQueries({ queryKey: ['partner-sector', id] })
      toast.success(i18n.t('partnerSectorStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('partnerSectorStatusFailed')))
    },
  })
}

export function useDeletePartnerSector() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/partner-sectors/${id}`)
    },
    onSuccess: () => {
      invalidateSectorLists(qc)
      toast.success(i18n.t('partnerSectorDeleted'))
    },
    onError: (error) => {
      // 422 (sector still has partners) is already toasted by the axios interceptor
      // with the backend message (errors.partner_sector); avoid a duplicate toast.
      if ((error as AxiosError)?.response?.status === 422) return
      toast.error(getErrorMessage(error, i18n.t('partnerSectorDeleteFailed')))
    },
  })
}
