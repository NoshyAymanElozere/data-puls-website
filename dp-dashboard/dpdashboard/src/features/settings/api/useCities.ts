import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface CityCountry {
  id: number
  name: string | Translatable
  iso_code: string
}

export interface City {
  id: number
  name: string | Translatable
  country_id: number
  is_active: boolean
  country?: CityCountry
  created_at?: string
  updated_at?: string
}

export interface CityFormData {
  nameEn: string
  nameAr: string
  country_id: string
  is_active: boolean
}

function toCityFormData(payload: CityFormData, isUpdate = false): FormData {
  const formData = createPutFormData({
    country_id: payload.country_id,
    is_active: payload.is_active,
  })

  if (!isUpdate) {
    formData.delete('_method')
  }

  appendTranslatable(formData, 'name', { en: payload.nameEn, ar: payload.nameAr })
  return formData
}

export function useCitiesList(
  page = 1,
  countryId?: number | string,
  search = '',
  isActive = ''
) {
  return useQuery({
    queryKey: ['cities-list', page, countryId, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        country_id: countryId,
        is_active: isActive,
      })
      const response = await api.get<LaravelPaginatedResponse<City>>(`/cities?${params}`)
      return response.data
    },
  })
}

export function useActiveCities(countryId?: number | string) {
  return useQuery({
    queryKey: ['cities-active', countryId],
    queryFn: async () => {
      const params = buildQueryParams({ is_active: 'true', per_page: '100', country_id: countryId })
      const response = await api.get<LaravelPaginatedResponse<City>>(`/cities?${params}`)
      return response.data.data
    },
  })
}

/** @deprecated Use useActiveCities */
export function useAllCities() {
  return useActiveCities()
}

export function useCity(id: number | null) {
  return useQuery({
    queryKey: ['city', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<City>>(`/cities/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateCity(setError?: UseFormSetError<CityFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CityFormData) => {
      const response = await api.post<SuccessResponse<City>>('/cities', toCityFormData(payload))
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['cities-list'] })
      qc.invalidateQueries({ queryKey: ['cities-active'] })
      toast.success(res.message || 'City created successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to create city.'))
    },
  })
}

export function useUpdateCity(setError?: UseFormSetError<CityFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CityFormData }) => {
      const response = await api.post<SuccessResponse<City>>(`/cities/${id}`, toCityFormData(payload, true))
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['cities-list'] })
      qc.invalidateQueries({ queryKey: ['cities-active'] })
      qc.invalidateQueries({ queryKey: ['city', variables.id] })
      toast.success(res.message || 'City updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update city.'))
    },
  })
}

export function useToggleCityStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<City>>(`/cities/${id}/status`)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['cities-list'] })
      qc.invalidateQueries({ queryKey: ['cities-active'] })
      if (res.data?.country_id) {
        qc.invalidateQueries({ queryKey: ['country', res.data.country_id] })
      }
      toast.success(res.message || 'City status updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to toggle city status.'))
    },
  })
}

export function useDeleteCity() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cities/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cities-list'] })
      qc.invalidateQueries({ queryKey: ['cities-active'] })
      toast.success('City deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete city.'))
    },
  })
}

export function getCityName(name: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(name, lang)
}
