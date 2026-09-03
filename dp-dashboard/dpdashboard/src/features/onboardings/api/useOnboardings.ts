import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendOptionalFile, appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { OnboardingFormValues } from '../pages/validationSchema'

export interface Onboarding {
  id: number
  title: string | Translatable
  description: string | Translatable
  is_active: boolean
  sort_order: number
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface OnboardingFormData {
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  sort_order: number
  is_active: boolean
  image?: File | null
}

function buildOnboardingFormData(payload: OnboardingFormData, isUpdate = false): FormData {
  const formData = createPutFormData({
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  })

  if (!isUpdate) {
    formData.delete('_method')
  }

  appendTranslatable(formData, 'title', { en: payload.titleEn, ar: payload.titleAr })
  appendTranslatable(formData, 'description', {
    en: payload.descriptionEn,
    ar: payload.descriptionAr,
  })
  appendOptionalFile(formData, 'image', payload.image)

  return formData
}

export function useOnboardingsList(page = 1, search = '', isActive = '') {
  return useQuery({
    queryKey: ['onboardings-list', page, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive })
      const response = await api.get<LaravelPaginatedResponse<Onboarding>>(`/onboardings?${params}`)
      return response.data
    },
  })
}

export function useOnboarding(id: number | null) {
  return useQuery({
    queryKey: ['onboarding', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<Onboarding>>(`/onboardings/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateOnboarding(setError?: UseFormSetError<OnboardingFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: OnboardingFormValues) => {
      const response = await api.post<SuccessResponse<Onboarding>>(
        '/onboardings',
        buildOnboardingFormData(payload),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onboardings-list'] })
      toast.success(i18n.t('onboardingCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('onboardingCreateFailed')))
    },
  })
}

export function useUpdateOnboarding(setError?: UseFormSetError<OnboardingFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: OnboardingFormValues }) => {
      const response = await api.post<SuccessResponse<Onboarding>>(
        `/onboardings/${id}`,
        buildOnboardingFormData(payload, true),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['onboardings-list'] })
      qc.invalidateQueries({ queryKey: ['onboarding', variables.id] })
      toast.success(i18n.t('onboardingUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('onboardingUpdateFailed')))
    },
  })
}

export function useDeleteOnboarding() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/onboardings/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onboardings-list'] })
      toast.success(i18n.t('onboardingDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('onboardingDeleteFailed')))
    },
  })
}

export function useToggleOnboardingStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<Onboarding>>(`/onboardings/${id}/status`)
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onboardings-list'] })
      toast.success(i18n.t('onboardingStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('onboardingStatusFailed')))
    },
  })
}

export function getOnboardingTitle(title: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(title, lang)
}
