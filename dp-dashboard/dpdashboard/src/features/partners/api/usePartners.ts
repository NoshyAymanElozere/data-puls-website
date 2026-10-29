import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { UseFormSetError } from 'react-hook-form'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendOptionalFile, appendTranslatable, resolveUploadFile } from '@/shared/utils/form-data'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { PartnerFormValues } from '../pages/validationSchema'

export interface PartnerRelation {
  id: number
  name: string | Translatable
}

/** Row from `GET /partners` (lean, current-locale strings). */
export interface PartnerListItem {
  id: number
  name: string
  logo_url: string | null
  sector: string | null
  city: string | null
  is_active: boolean
  status: 'active' | 'inactive'
  status_label: string
  sort_order: number
  created_at?: string
}

/** Detail from `GET /partners/{id}` (`{ en, ar }` translatable fields). */
export interface PartnerDetail {
  id: number
  name: Translatable | string
  description: Translatable | string | null
  address: Translatable | string | null
  map_url: string | null
  logo_url: string | null
  partner_sector_id: number
  sector: PartnerRelation | null
  city_id: number
  city: PartnerRelation | null
  is_active: boolean
  status: 'active' | 'inactive'
  status_label: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface PartnersFilters {
  page: number
  search: string
  sectorId: string
  cityId: string
  isActive: string
}

/** Maps Laravel validation keys (`name.en`) to form field names (`nameEn`). */
const FIELD_MAP: Record<string, string> = {
  'name.en': 'nameEn',
  'name.ar': 'nameAr',
  'description.en': 'descriptionEn',
  'description.ar': 'descriptionAr',
  'address.en': 'addressEn',
  'address.ar': 'addressAr',
}

function buildPartnerFormData(values: PartnerFormValues, isUpdate: boolean): FormData {
  const formData = new FormData()
  // Laravel needs method spoofing for multipart updates; `_method` goes first.
  if (isUpdate) formData.append('_method', 'PUT')

  formData.append('partner_sector_id', values.partner_sector_id)
  formData.append('city_id', values.city_id)
  appendTranslatable(formData, 'name', { en: values.nameEn, ar: values.nameAr })
  appendTranslatable(formData, 'description', { en: values.descriptionEn ?? '', ar: values.descriptionAr ?? '' })
  appendTranslatable(formData, 'address', { en: values.addressEn ?? '', ar: values.addressAr ?? '' })
  formData.append('map_url', values.map_url ?? '')
  formData.append('is_active', values.is_active ? '1' : '0')
  formData.append('sort_order', String(Number(values.sort_order) || 0))
  appendOptionalFile(formData, 'logo', values.logo)

  // A newly uploaded logo replaces the old one, so only ask for removal when no file is sent.
  if (isUpdate && values.remove_logo && !resolveUploadFile(values.logo)) {
    formData.append('remove_logo', '1')
  }

  return formData
}

export function usePartnersList(filters: PartnersFilters) {
  return useQuery({
    queryKey: ['partners-list', filters],
    queryFn: async () => {
      const params = buildQueryParams({
        page: filters.page,
        search: filters.search,
        partner_sector_id: filters.sectorId,
        city_id: filters.cityId,
        is_active: filters.isActive,
      })
      const response = await api.get<LaravelPaginatedResponse<PartnerListItem>>(`/partners?${params}`)
      return response.data
    },
  })
}

export function usePartner(id: number | null) {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<PartnerDetail>>(`/partners/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

function invalidatePartnerLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['partners-list'] })
  // Sector rows expose partners_count.
  qc.invalidateQueries({ queryKey: ['partner-sectors-list'] })
}

export function useCreatePartner(setError?: UseFormSetError<PartnerFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (values: PartnerFormValues) => {
      const response = await api.post<SuccessResponse<PartnerDetail>>(
        '/partners',
        buildPartnerFormData(values, false),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data
    },
    onSuccess: () => {
      invalidatePartnerLists(qc)
      toast.success(i18n.t('partnerCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError, FIELD_MAP)) return
      toast.error(getErrorMessage(error, i18n.t('partnerCreateFailed')))
    },
  })
}

export function useUpdatePartner(setError?: UseFormSetError<PartnerFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, values }: { id: number; values: PartnerFormValues }) => {
      const response = await api.post<SuccessResponse<PartnerDetail>>(
        `/partners/${id}`,
        buildPartnerFormData(values, true),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data
    },
    onSuccess: (_res, variables) => {
      invalidatePartnerLists(qc)
      qc.invalidateQueries({ queryKey: ['partner', variables.id] })
      toast.success(i18n.t('partnerUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError, FIELD_MAP)) return
      toast.error(getErrorMessage(error, i18n.t('partnerUpdateFailed')))
    },
  })
}

export function useTogglePartnerStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<PartnerDetail>>(`/partners/${id}/status`)
      return response.data
    },
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ['partners-list'] })
      qc.invalidateQueries({ queryKey: ['partner', id] })
      toast.success(i18n.t('partnerStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('partnerStatusFailed')))
    },
  })
}

export function useDeletePartner() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/partners/${id}`)
    },
    onSuccess: () => {
      invalidatePartnerLists(qc)
      toast.success(i18n.t('partnerDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('partnerDeleteFailed')))
    },
  })
}
