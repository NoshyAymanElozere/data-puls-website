import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import type { BillingPeriod, SubscriptionPackage } from '@/features/subscription-packages/api/useSubscriptionPackages'
import type { UserSubscription } from '../types/subscriptions'

export type AdminSubscriptionStatus = 'active' | 'cancelled' | 'expired'

export interface GrantSubscriptionPayload {
  subscription_package_id: number
  billing_period: BillingPeriod
  starts_at?: string | null
  ends_at?: string | null
  auto_renewal?: boolean
}

export interface UpdateSubscriptionPayload {
  subscription_package_id?: number
  billing_period?: BillingPeriod
  status?: AdminSubscriptionStatus
  starts_at?: string
  ends_at?: string
  auto_renewal?: boolean
}

/** Every package (active and inactive) the admin can assign to a user. */
export function useSubscriptionPackageOptions(enabled: boolean) {
  return useQuery({
    queryKey: ['subscription-package-options'],
    queryFn: async () => {
      const response = await api.get<LaravelPaginatedResponse<SubscriptionPackage>>(
        '/subscription-packages?per_page=100'
      )
      return response.data.data ?? []
    },
    enabled,
    staleTime: 60_000,
  })
}

function useInvalidateUser(userId: number) {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['user', userId] })
    qc.invalidateQueries({ queryKey: ['users-list'] })
    qc.invalidateQueries({ queryKey: ['users-stats'] })
  }
}

export function useGrantUserSubscription(userId: number) {
  const invalidate = useInvalidateUser(userId)

  return useMutation({
    mutationFn: async (payload: GrantSubscriptionPayload) => {
      const response = await api.post<SuccessResponse<UserSubscription>>(`/users/${userId}/subscriptions`, payload)
      return response.data
    },
    onSuccess: (res) => {
      invalidate()
      toast.success(res.message || i18n.t('subscriptionGranted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('subscriptionSaveFailed')))
    },
  })
}

export function useUpdateUserSubscription(userId: number) {
  const invalidate = useInvalidateUser(userId)

  return useMutation({
    mutationFn: async ({ subscriptionId, payload }: { subscriptionId: number; payload: UpdateSubscriptionPayload }) => {
      const response = await api.patch<SuccessResponse<UserSubscription>>(
        `/users/${userId}/subscriptions/${subscriptionId}`,
        payload
      )
      return response.data
    },
    onSuccess: (res) => {
      invalidate()
      toast.success(res.message || i18n.t('subscriptionUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('subscriptionSaveFailed')))
    },
  })
}
