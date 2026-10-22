import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { DiscountCodeFormValues } from '../pages/validationSchema'

export type DiscountCodeType = 'percentage' | 'fixed_amount' | 'free_period'
export type DiscountCodeAvailability = 'active' | 'scheduled' | 'expired' | 'inactive'
export type DiscountCodeBillingPeriod = 'monthly' | 'yearly'
export type DiscountRedemptionStatus = 'pending' | 'completed' | 'cancelled'

export interface DiscountCode {
  id: number
  code: string
  name?: string | Translatable | null
  description?: string | Translatable | null
  owner_name?: string | null
  owner_contact?: string | null
  type: DiscountCodeType
  type_label?: string
  value: number | null
  free_months: number | null
  subscription_package_id: number | null
  package?: { id: number; name: string | Translatable } | null
  billing_period: DiscountCodeBillingPeriod | null
  billing_period_label?: string | null
  max_uses: number | null
  max_uses_per_user: number
  uses_count: number
  pending_uses_count: number
  remaining_uses: number | null
  starts_at: string | null
  expires_at: string | null
  /** "YYYY-MM-DDTHH:mm" in the app timezone, for datetime-local inputs */
  starts_at_value?: string | null
  expires_at_value?: string | null
  availability: DiscountCodeAvailability
  availability_label?: string
  is_active: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface DiscountCodeRedemption {
  id: number
  status: DiscountRedemptionStatus
  status_label: string
  original_amount: number
  discount_amount: number
  final_amount: number
  currency: string
  user?: { id: number; name: string | null; email: string | null; phone: string | null } | null
  subscription?: {
    id: number
    status: string
    status_label: string
    package_name: string | null
    starts_at: string | null
    ends_at: string | null
  } | null
  redeemed_at: string | null
  created_at: string
}

/** Empty strings from the form mean "not set" for the API. */
function nullable<T>(value: T | '' | null | undefined): T | null {
  return value === '' || value === undefined ? null : value
}

function toApiBody(payload: DiscountCodeFormValues) {
  const isFree = payload.type === 'free_period'

  return {
    code: payload.code.trim().toUpperCase(),
    name: { en: payload.nameEn || null, ar: payload.nameAr || null },
    description: { en: payload.descriptionEn || null, ar: payload.descriptionAr || null },
    owner_name: payload.owner_name || null,
    owner_contact: payload.owner_contact || null,
    type: payload.type,
    value: isFree ? null : nullable(payload.value),
    free_months: isFree ? nullable(payload.free_months) : null,
    subscription_package_id: payload.subscription_package_id ? Number(payload.subscription_package_id) : null,
    billing_period: nullable(payload.billing_period),
    max_uses: nullable(payload.max_uses),
    max_uses_per_user: payload.max_uses_per_user,
    starts_at: payload.starts_at || null,
    expires_at: payload.expires_at || null,
    is_active: payload.is_active,
  }
}

export function useDiscountCodesList(page = 1, search = '', isActive = '', type = '', ownerName = '') {
  return useQuery({
    queryKey: ['discount-codes-list', page, search, isActive, type, ownerName],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, is_active: isActive, type, owner_name: ownerName })
      const response = await api.get<LaravelPaginatedResponse<DiscountCode>>(`/discount-codes?${params}`)
      return response.data
    },
  })
}

export function useDiscountCode(id: number | null) {
  return useQuery({
    queryKey: ['discount-code', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<DiscountCode>>(`/discount-codes/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useDiscountCodeRedemptions(id: number | null, page = 1) {
  return useQuery({
    queryKey: ['discount-code-redemptions', id, page],
    queryFn: async () => {
      const params = buildQueryParams({ page })
      const response = await api.get<LaravelPaginatedResponse<DiscountCodeRedemption>>(
        `/discount-codes/${id}/redemptions?${params}`
      )
      return response.data
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
  })
}

export function useCreateDiscountCode(setError?: UseFormSetError<DiscountCodeFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: DiscountCodeFormValues) => {
      const response = await api.post<SuccessResponse<DiscountCode>>('/discount-codes', toApiBody(payload))
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discount-codes-list'] })
      toast.success(i18n.t('discountCodeCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('discountCodeCreateFailed')))
    },
  })
}

export function useUpdateDiscountCode(setError?: UseFormSetError<DiscountCodeFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: DiscountCodeFormValues }) => {
      const response = await api.put<SuccessResponse<DiscountCode>>(`/discount-codes/${id}`, toApiBody(payload))
      return response.data
    },
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['discount-codes-list'] })
      qc.invalidateQueries({ queryKey: ['discount-code', variables.id] })
      toast.success(i18n.t('discountCodeUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('discountCodeUpdateFailed')))
    },
  })
}

export function useDeleteDiscountCode() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/discount-codes/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discount-codes-list'] })
      toast.success(i18n.t('discountCodeDeleted'))
    },
    onError: (error) => {
      // 422 when the code already has completed redemptions — the API message explains it
      toast.error(getErrorMessage(error, i18n.t('discountCodeDeleteFailed')))
    },
  })
}

export function useToggleDiscountCodeStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<DiscountCode>>(`/discount-codes/${id}/status`)
      return response.data
    },
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ['discount-codes-list'] })
      qc.invalidateQueries({ queryKey: ['discount-code', id] })
      toast.success(i18n.t('discountCodeStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('discountCodeStatusFailed')))
    },
  })
}

export function getDiscountCodeName(code: DiscountCode, lang = 'en'): string {
  return getLocalizedValue(code.name ?? null, lang)
}

export const DISCOUNT_TYPE_LABEL_KEYS: Record<DiscountCodeType, string> = {
  percentage: 'discountTypePercentage',
  fixed_amount: 'discountTypeFixedAmount',
  free_period: 'discountTypeFreePeriod',
}

export const AVAILABILITY_LABEL_KEYS: Record<DiscountCodeAvailability, string> = {
  active: 'active',
  scheduled: 'discountCodeScheduled',
  expired: 'expired',
  inactive: 'inactive',
}

export const AVAILABILITY_BADGE_VARIANTS: Record<DiscountCodeAvailability, 'success' | 'info' | 'warning' | 'secondary'> = {
  active: 'success',
  scheduled: 'info',
  expired: 'warning',
  inactive: 'secondary',
}

/** "25%", "50 SAR" or "2 Months" depending on the code type. */
export function formatDiscountValue(
  code: Pick<DiscountCode, 'type' | 'value' | 'free_months'>,
  t: (key: string) => string
): string {
  if (code.type === 'free_period') return code.free_months ? `${code.free_months} ${t('months')}` : '—'
  if (code.value == null) return '—'
  return code.type === 'percentage' ? `${Number(code.value)}%` : `${Number(code.value)} ${t('discountCodeCurrency')}`
}
