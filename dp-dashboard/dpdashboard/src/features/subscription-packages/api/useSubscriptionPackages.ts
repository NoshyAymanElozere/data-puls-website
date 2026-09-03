import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import {
  appendIndexedFields,
  appendIndexedTranslatable,
  appendTranslatable,
  createPutFormData,
} from '@/shared/utils/form-data'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export type BillingPeriod = 'monthly' | 'yearly'
export type FeatureType = 'main_feature' | 'sharing_feature'
export type SubscriptionStatus = 'pending_payment' | 'trial' | 'active' | 'cancelled' | 'expired'

export interface SubscriptionPackageSubscriberUser {
  id: number
  avatar_url?: string | null
  email: string
  phone?: string | null
  gender?: string
  gender_label?: string
  status?: string
  status_label?: string
}

export interface SubscriptionPackageBillingOption {
  id: number
  billing_period: BillingPeriod
  billing_period_label: string
  price: string
  final_price: string
  currency: string
  discount_percentage: number
  is_active: boolean
}

export interface SubscriptionPackageSubscriber {
  id: number
  status: SubscriptionStatus
  status_label: string
  auto_renewal: boolean
  starts_at: string
  trial_ends_at?: string | null
  ends_at?: string | null
  cancelled_at?: string | null
  remaining_days?: number | null
  user: SubscriptionPackageSubscriberUser
  billing_option: SubscriptionPackageBillingOption
  created_at?: string
  updated_at?: string
}

export interface SubscriptionPackageFeatureForm {
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  type: FeatureType
  is_active: boolean
}

export interface SubscriptionPackageFormValues {
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  maximum_family_members: number
  sort_order: number
  is_active: boolean
  monthly_price: number
  yearly_price: number
  features: SubscriptionPackageFeatureForm[]
}

export interface SubscriptionPackagePrice {
  id?: number
  billing_period: BillingPeriod
  price: number | string
  currency: string
  discount_percentage?: number
  is_active: boolean
}

export interface SubscriptionPackageFeature {
  id?: number
  name: string | Translatable
  description?: string | Translatable
  type: FeatureType
  is_active: boolean
}

export interface SubscriptionPackage {
  id: number
  name: string | Translatable
  description?: string | Translatable
  maximum_family_members: number
  sort_order: number
  is_active: boolean
  subscribers_count?: number
  subscribers?: SubscriptionPackageSubscriber[]
  prices?: SubscriptionPackagePrice[]
  features?: SubscriptionPackageFeature[]
  created_at?: string
  updated_at?: string
}

function toSubscriptionPackageFormData(payload: SubscriptionPackageFormValues, isUpdate = false): FormData {
  const formData = createPutFormData({
    maximum_family_members: payload.maximum_family_members,
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  })

  if (!isUpdate) {
    formData.delete('_method')
  }

  appendTranslatable(formData, 'name', { en: payload.nameEn, ar: payload.nameAr })
  appendTranslatable(formData, 'description', {
    en: payload.descriptionEn || '',
    ar: payload.descriptionAr || '',
  })

  const prices = [
    {
      billing_period: 'monthly',
      price: payload.monthly_price,
      currency: 'SAR',
      discount_percentage: 0,
      is_active: true,
    },
    {
      billing_period: 'yearly',
      price: payload.yearly_price,
      currency: 'SAR',
      discount_percentage: 0,
      is_active: true,
    },
  ]

  prices.forEach((price, index) => {
    appendIndexedFields(formData, 'prices', index, {
      billing_period: price.billing_period,
      price: price.price,
      currency: price.currency,
      discount_percentage: price.discount_percentage ?? 0,
      is_active: price.is_active,
    })
  })

  payload.features.forEach((feature, index) => {
    appendIndexedTranslatable(formData, 'features', index, 'name', {
      en: feature.nameEn,
      ar: feature.nameAr,
    })
    appendIndexedTranslatable(formData, 'features', index, 'description', {
      en: feature.descriptionEn || '',
      ar: feature.descriptionAr || '',
    })
    appendIndexedFields(formData, 'features', index, {
      type: feature.type,
      is_active: feature.is_active,
    })
  })

  return formData
}

export function useSubscriptionPackagesList(page = 1, search = '', isActive = '') {
  return useQuery({
    queryKey: ['subscription-packages-list', page, search, isActive],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive })
      const response = await api.get<LaravelPaginatedResponse<SubscriptionPackage>>(
        `/subscription-packages?${params}`
      )
      return response.data
    },
  })
}

export function useSubscriptionPackage(id: number | null) {
  return useQuery({
    queryKey: ['subscription-package', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<SubscriptionPackage>>(`/subscription-packages/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateSubscriptionPackage(setError?: UseFormSetError<SubscriptionPackageFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SubscriptionPackageFormValues) => {
      const response = await api.post<SuccessResponse<SubscriptionPackage>>(
        '/subscription-packages',
        toSubscriptionPackageFormData(payload, false)
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['subscription-packages-list'] })
      toast.success(res.message || 'Subscription package created successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to create subscription package.'))
    },
  })
}

export function useUpdateSubscriptionPackage(setError?: UseFormSetError<SubscriptionPackageFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: SubscriptionPackageFormValues }) => {
      const response = await api.post<SuccessResponse<SubscriptionPackage>>(
        `/subscription-packages/${id}`,
        toSubscriptionPackageFormData(payload, true)
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['subscription-packages-list'] })
      qc.invalidateQueries({ queryKey: ['subscription-package', variables.id] })
      toast.success(res.message || 'Subscription package updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update subscription package.'))
    },
  })
}

export function useDeleteSubscriptionPackage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/subscription-packages/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscription-packages-list'] })
      toast.success('Subscription package deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete subscription package.'))
    },
  })
}

export function useToggleSubscriptionPackageStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<SubscriptionPackage>>(
        `/subscription-packages/${id}/status`
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['subscription-packages-list'] })
      toast.success(res.message || 'Status updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status.'))
    },
  })
}

export function getPackageName(name: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(name, lang)
}
