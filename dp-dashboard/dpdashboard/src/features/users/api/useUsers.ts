import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { UserFormValues } from '../pages/validationSchema'
import type { UserSubscription } from '../types/subscriptions'

import type { AccountOwnerInfo, FamilyMemberPermissions, FamilyRelationBasic } from '../types/family'

export type { UserSubscription, UserSubscriptionDiscount, UserSubscriptionPackage } from '../types/subscriptions'
export type { AccountOwnerInfo, FamilyMemberPermissions, FamilyRelationBasic } from '../types/family'

export type UserStatus = 'active' | 'suspended'
export type UserGender = 'male' | 'female'
export type PreferredLanguage = 'ar' | 'en'
export type UserAccessType = 'subscription' | 'trial' | 'none'

export interface UserLocationRef {
  id: number
  name: string | Translatable | null
}

export interface UserSubscriptionAccess {
  access_type: UserAccessType
  has_access: boolean
  is_subscribed: boolean
  is_in_trial: boolean
  trial_enabled: boolean
  trial_months: number | null
  trial_starts_at: string | null
  trial_ends_at: string | null
  trial_days_remaining: number | null
  trial_ended: boolean
  package: {
    id: number
    name: string
    maximum_invoices: number | null
    maximum_family_members: number
  } | null
}

export interface UsersFilters {
  search?: string
  status?: string
  gender?: string
  registeredFrom?: string
  registeredTo?: string
  countryId?: string
  cityId?: string
  /** Only `true` is sent (as is_subscribed=1); false means "no filter". */
  isSubscribed?: boolean
  accessType?: UserAccessType | ''
}

export interface UsersStatsBreakdownItem {
  id: number
  name: string | Translatable | null
  count: number
}

export interface UsersStatsCityItem extends UsersStatsBreakdownItem {
  country_name: string | Translatable | null
}

export interface UsersStats {
  total: number
  active: number
  suspended: number
  subscribed: number
  in_trial: number
  no_access: number
  new_this_month: number
  without_city: number
  by_country: UsersStatsBreakdownItem[]
  by_city: UsersStatsCityItem[]
}

export interface UserListItem {
  id: number
  name?: string | null
  phone: string
  status: UserStatus
  is_subscribed: boolean
  access_type?: UserAccessType | null
  city?: UserLocationRef | null
  country?: UserLocationRef | null
  invoices_count?: number
  family_members_count?: number
}

export interface UserDetail extends UserListItem {
  name?: string | null
  email: string
  gender: UserGender | null
  age: number | null
  created_at: string
  avatar_url: string
  date_of_birth: string | null
  gender_label: string | null
  preferred_language: PreferredLanguage | null
  status_label: string
  registration_completed_at: string | null
  phone_verified_at: string | null
  last_login_at: string | null
  updated_at: string
  categories_count?: number
  account_owner_id?: number | null
  account_owner?: AccountOwnerInfo | null
  family_relation_id?: number | null
  family_relation?: FamilyRelationBasic | null
  permissions?: FamilyMemberPermissions | null
  active_subscription: UserSubscription | null
  subscription_access?: UserSubscriptionAccess | null
  subscriptions: UserSubscription[]
}

export interface UserFormPayload {
  name?: string | null
  email: string
  phone: string
  password?: string
  password_confirmation?: string
  date_of_birth?: string | null
  gender?: UserGender | null
  preferred_language?: PreferredLanguage | null
  status?: UserStatus
}

function toApiPayload(formData: UserFormValues, isUpdate = false): UserFormPayload {
  const payload: UserFormPayload = {
    email: formData.email,
    phone: formData.phone,
    status: formData.status,
  }

  const trimmedName = formData.name?.trim()
  if (trimmedName) {
    payload.name = trimmedName
  } else if (isUpdate) {
    payload.name = null
  }

  if (formData.date_of_birth) {
    payload.date_of_birth = formData.date_of_birth
  } else if (isUpdate) {
    payload.date_of_birth = null
  }

  if (formData.gender) payload.gender = formData.gender
  if (formData.preferred_language) payload.preferred_language = formData.preferred_language
  if (formData.password) {
    payload.password = formData.password
    payload.password_confirmation = formData.password_confirmation
  }

  return payload
}

function buildUsersFilterParams(filters: UsersFilters, page?: number) {
  return buildQueryParams({
    page,
    search: filters.search,
    status: filters.status,
    gender: filters.gender,
    registered_from: filters.registeredFrom,
    registered_to: filters.registeredTo,
    country_id: filters.countryId,
    city_id: filters.cityId,
    is_subscribed: filters.isSubscribed ? 1 : undefined,
    access_type: filters.accessType,
  })
}

export function useUsersList(page = 1, filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ['users-list', page, filters],
    queryFn: async () => {
      const params = buildUsersFilterParams(filters, page)
      const response = await api.get<LaravelPaginatedResponse<UserListItem>>(`/users?${params}`)
      return response.data
    },
  })
}

export function useUsersStats(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: ['users-stats', filters],
    queryFn: async () => {
      const params = buildUsersFilterParams(filters)
      const response = await api.get<SuccessResponse<UsersStats>>(`/users/stats?${params}`)
      return response.data.data
    },
  })
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<UserDetail>>(`/users/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateUser(setError?: UseFormSetError<UserFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UserFormValues) => {
      const response = await api.post<SuccessResponse<UserDetail>>('/users', toApiPayload(payload, false))
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users-list'] })
      qc.invalidateQueries({ queryKey: ['users-stats'] })
      toast.success(res.message || i18n.t('userCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('userCreateFailed')))
    },
  })
}

export function useUpdateUser(setError?: UseFormSetError<UserFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UserFormValues }) => {
      const response = await api.put<SuccessResponse<UserDetail>>(`/users/${id}`, toApiPayload(payload, true))
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['users-list'] })
      qc.invalidateQueries({ queryKey: ['users-stats'] })
      qc.invalidateQueries({ queryKey: ['user', variables.id] })
      toast.success(res.message || i18n.t('userUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('userUpdateFailed')))
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users-list'] })
      qc.invalidateQueries({ queryKey: ['users-stats'] })
      toast.success(i18n.t('userDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('userDeleteFailed')))
    },
  })
}

function patchUserStatusInLists(
  qc: ReturnType<typeof useQueryClient>,
  id: number,
  status: UserStatus
) {
  qc.setQueriesData<LaravelPaginatedResponse<UserListItem>>(
    { queryKey: ['users-list'] },
    (old) => {
      if (!old?.data) return old
      return {
        ...old,
        data: old.data.map((user) => (user.id === id ? { ...user, status } : user)),
      }
    }
  )
}

export function useUpdateUserStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: UserStatus }) => {
      const response = await api.patch<SuccessResponse<UserDetail>>(`/users/${id}/status`, { status })
      return response.data
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['users-list'] })
      const previousLists = qc.getQueriesData<LaravelPaginatedResponse<UserListItem>>({
        queryKey: ['users-list'],
      })
      patchUserStatusInLists(qc, id, status)
      return { previousLists }
    },
    onError: (error, _, context) => {
      context?.previousLists?.forEach(([queryKey, data]) => {
        qc.setQueryData(queryKey, data)
      })
      toast.error(getErrorMessage(error, i18n.t('userStatusFailed')))
    },
    onSuccess: (res, { id, status }) => {
      // Keep list in sync even if a concurrent refetch raced the optimistic patch
      patchUserStatusInLists(qc, id, status)
      toast.success(res.message || i18n.t('userStatusUpdated'))
    },
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({ queryKey: ['users-list'] })
      qc.invalidateQueries({ queryKey: ['users-stats'] })
      if (variables?.id) {
        qc.invalidateQueries({ queryKey: ['user', variables.id] })
      }
    },
  })
}
