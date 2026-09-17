import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage, getValidationErrors } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { Path, UseFormSetError } from 'react-hook-form'
import type { UserCategoryDetail, UserCategoryFormValues, UserCategoryItem } from '../types/categories'

function applyUserCategoryValidationErrors(
  error: unknown,
  setError: UseFormSetError<UserCategoryFormValues>
): boolean {
  const errors = getValidationErrors(error)
  if (!errors) return false

  const fieldMap: Record<string, keyof UserCategoryFormValues> = {
    'name.en': 'nameEn',
    'name.ar': 'nameAr',
    name: 'nameEn',
    'description.en': 'descriptionEn',
    'description.ar': 'descriptionAr',
    description: 'descriptionEn',
    icon: 'icon',
    icon_bg_color: 'icon_bg_color',
    bg_color: 'icon_bg_color',
    background_color: 'icon_bg_color',
    sort_order: 'sort_order',
    is_active: 'is_active',
    parent_id: 'parent_id',
  }

  let matched = false
  Object.entries(errors).forEach(([field, messages]) => {
    const targetKey = fieldMap[field] || (field as keyof UserCategoryFormValues)
    if (targetKey) {
      setError(targetKey as Path<UserCategoryFormValues>, { type: 'server', message: messages[0] })
      matched = true
    }
  })
  return matched
}

function toPayload(payload: UserCategoryFormValues) {
  return {
    name: {
      en: payload.nameEn,
      ar: payload.nameAr || payload.nameEn,
    },
    description: {
      en: payload.descriptionEn || '',
      ar: payload.descriptionAr || '',
    },
    icon: payload.icon,
    icon_bg_color: payload.icon_bg_color,
    is_active: Boolean(payload.is_active),
    ...(payload.sort_order != null ? { sort_order: Number(payload.sort_order) } : {}),
    ...(payload.parent_id != null ? { parent_id: Number(payload.parent_id) } : {}),
  }
}

export function useUserCategories(
  userId: number | null | undefined,
  page = 1,
  search = '',
  perPage = 15,
  isActive?: boolean | string,
  parentId?: number | null
) {
  return useQuery({
    queryKey: ['user-categories', userId, page, search, perPage, isActive, parentId],
    queryFn: async () => {
      if (!userId) return null
      const params = buildQueryParams({
        page,
        search,
        per_page: perPage,
        is_active: isActive === '' || isActive === undefined ? undefined : isActive,
        parent_id: parentId === null ? undefined : parentId,
      })
      const response = await api.get<LaravelPaginatedResponse<UserCategoryItem>>(
        `/users/${userId}/categories?${params}`
      )
      return response.data
    },
    enabled: !!userId,
  })
}

export function useUserCategoryDetail(
  userId: number | null | undefined,
  categoryId: number | null | undefined
) {
  return useQuery({
    queryKey: ['user-category-detail', userId, categoryId],
    queryFn: async () => {
      if (!userId || !categoryId) return null
      const response = await api.get<SuccessResponse<UserCategoryDetail>>(
        `/users/${userId}/categories/${categoryId}`
      )
      return response.data.data
    },
    enabled: !!userId && !!categoryId,
  })
}

export function useCreateUserCategory(
  userId: number | null | undefined,
  setError?: UseFormSetError<UserCategoryFormValues>
) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UserCategoryFormValues) => {
      const body = toPayload(payload)
      const response = await api.post<SuccessResponse<UserCategoryDetail>>(
        `/users/${userId}/categories`,
        body
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-categories', userId] })
      qc.invalidateQueries({ queryKey: ['user', userId] })
      qc.invalidateQueries({ queryKey: ['users-list'] })
      toast.success(res.message || i18n.t('categoryCreated'))
    },
    onError: (error) => {
      if (setError && applyUserCategoryValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('categoryCreateFailed')))
    },
  })
}

export function useUpdateUserCategory(
  userId: number | null | undefined,
  setError?: UseFormSetError<UserCategoryFormValues>
) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      categoryId,
      payload,
    }: {
      categoryId: number
      payload: UserCategoryFormValues
    }) => {
      const body = toPayload(payload)
      const response = await api.put<SuccessResponse<UserCategoryDetail>>(
        `/users/${userId}/categories/${categoryId}`,
        body
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['user-categories', userId] })
      qc.invalidateQueries({ queryKey: ['user-category-detail', userId, variables.categoryId] })
      toast.success(res.message || i18n.t('categoryUpdated'))
    },
    onError: (error) => {
      if (setError && applyUserCategoryValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('categoryUpdateFailed')))
    },
  })
}

export function useToggleUserCategoryStatus(userId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ categoryId, isActive }: { categoryId: number; isActive?: boolean }) => {
      const body = isActive !== undefined ? { is_active: isActive } : {}
      const response = await api.patch<SuccessResponse<{ id: number; is_active: boolean }>>(
        `/users/${userId}/categories/${categoryId}/status`,
        body
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-categories', userId] })
      toast.success(res.message || i18n.t('statusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('statusUpdateFailed')))
    },
  })
}

export function useDeleteUserCategory(userId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await api.delete<SuccessResponse<null>>(
        `/users/${userId}/categories/${categoryId}`
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-categories', userId] })
      qc.invalidateQueries({ queryKey: ['user', userId] })
      qc.invalidateQueries({ queryKey: ['users-list'] })
      toast.success(res?.message || i18n.t('categoryDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('categoryDeleteFailed')))
    },
  })
}
