import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface CountryCity {
  id: number
  name: string | Translatable
  country_id: number
  is_active: boolean
}

export interface Country {
  id: number
  name: string | Translatable
  iso_code: string
  currency_code: string
  phone_code: string
  is_active: boolean
  cities?: CountryCity[]
  created_at?: string
  updated_at?: string
}

export interface CountryFormData {
  nameEn: string
  nameAr: string
  iso_code: string
  currency_code: string
  phone_code: string
  is_active: boolean
}

function toCountryFormData(payload: CountryFormData, isUpdate = false): FormData {
  const formData = createPutFormData({
    iso_code: payload.iso_code,
    currency_code: payload.currency_code,
    phone_code: payload.phone_code,
    is_active: payload.is_active,
  })

  if (!isUpdate) {
    formData.delete('_method')
  }

  appendTranslatable(formData, 'name', { en: payload.nameEn, ar: payload.nameAr })
  return formData
}

export function useCountriesList(page = 1, search = '', isActive = '') {
  return useQuery({
    queryKey: ['countries-list', page, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive })
      const response = await api.get<LaravelPaginatedResponse<Country>>(`/countries?${params}`)
      return response.data
    },
  })
}

export function useActiveCountries() {
  return useQuery({
    queryKey: ['countries-active'],
    queryFn: async () => {
      const params = new URLSearchParams({ is_active: 'true', per_page: '100' })
      const response = await api.get<LaravelPaginatedResponse<Country>>(`/countries?${params}`)
      return response.data.data
    },
  })
}

/** @deprecated Use useActiveCountries */
export function useAllCountries() {
  return useActiveCountries()
}

export function useCountry(id: number | null) {
  return useQuery({
    queryKey: ['country', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<Country>>(`/countries/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateCountry(setError?: UseFormSetError<CountryFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CountryFormData) => {
      const response = await api.post<SuccessResponse<Country>>('/countries', toCountryFormData(payload))
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['countries-list'] })
      qc.invalidateQueries({ queryKey: ['countries-active'] })
      toast.success(res.message || i18n.t('countryCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('countryCreateFailed')))
    },
  })
}

export function useUpdateCountry(setError?: UseFormSetError<CountryFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CountryFormData }) => {
      const response = await api.post<SuccessResponse<Country>>(
        `/countries/${id}`,
        toCountryFormData(payload, true)
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['countries-list'] })
      qc.invalidateQueries({ queryKey: ['countries-active'] })
      qc.invalidateQueries({ queryKey: ['country', variables.id] })
      toast.success(res.message || i18n.t('countryUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('countryUpdateFailed')))
    },
  })
}

export function useToggleCountryStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<Country>>(`/countries/${id}/status`)
      return response.data
    },
    onSuccess: (res, id) => {
      qc.invalidateQueries({ queryKey: ['countries-list'] })
      qc.invalidateQueries({ queryKey: ['country', id] })
      qc.invalidateQueries({ queryKey: ['countries-active'] })
      toast.success(res.message || i18n.t('countryStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('countryStatusFailed')))
    },
  })
}

export function useDeleteCountry() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/countries/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['countries-list'] })
      qc.invalidateQueries({ queryKey: ['countries-active'] })
      toast.success(i18n.t('countryDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('countryDeleteFailed')))
    },
  })
}

export function getCountryName(name: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(name, lang)
}
