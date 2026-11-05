import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { appendOptionalFile, createPutFormData } from '@/shared/utils/form-data'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { OnboardingFormValues } from '../pages/validationSchema'

export const ONBOARDING_IMAGE_FIELDS = [
  'image_ar_light',
  'image_ar_dark',
  'image_en_light',
  'image_en_dark',
] as const

export type OnboardingImageField = (typeof ONBOARDING_IMAGE_FIELDS)[number]

export interface Onboarding {
  id: number
  is_active: boolean
  sort_order: number
  image_ar_light_url?: string | null
  image_ar_dark_url?: string | null
  image_en_light_url?: string | null
  image_en_dark_url?: string | null
  created_at?: string
  updated_at?: string
}

export type OnboardingFormData = {
  sort_order: number
  is_active: boolean
} & Partial<Record<OnboardingImageField, File | null>>

function buildOnboardingFormData(payload: OnboardingFormData, isUpdate = false): FormData {
  const formData = createPutFormData({
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  })

  if (!isUpdate) {
    formData.delete('_method')
  }

  ONBOARDING_IMAGE_FIELDS.forEach((field) => appendOptionalFile(formData, field, payload[field]))

  return formData
}

export function useOnboardingsList(page = 1, isActive = '') {
  return useQuery({
    queryKey: ['onboardings-list', page, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, is_active: isActive })
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
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ['onboardings-list'] })
      qc.invalidateQueries({ queryKey: ['onboarding', id] })
      toast.success(i18n.t('onboardingStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('onboardingStatusFailed')))
    },
  })
}
