import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'
import type { CategoryFormValues } from '../pages/validationSchema'

export const NATHRIAT_SLUG = 'nathriat'

export interface Category {
  id: number
  name: string | Translatable
  slug: string
  parent_id: number | null
  allows_subcategories: boolean
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CategoryFormData {
  nameEn: string
  nameAr: string
  slug?: string
  parent_id?: number | null
  sort_order: number
  is_active: boolean
}

function toApiPayload(payload: CategoryFormValues): CategoryFormData {
  return {
    nameEn: payload.nameEn,
    nameAr: payload.nameAr,
    slug: payload.slug || undefined,
    parent_id: payload.parent_id ?? undefined,
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  }
}

function toApiBody(payload: CategoryFormData) {
  const body: Record<string, unknown> = {
    name: { en: payload.nameEn, ar: payload.nameAr },
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  }
  if (payload.slug) body.slug = payload.slug
  if (payload.parent_id != null) body.parent_id = payload.parent_id
  return body
}

export function isNathriatCategory(category: Pick<Category, 'slug'>): boolean {
  return category.slug === NATHRIAT_SLUG
}

export function useCategoriesList(
  page = 1,
  search = '',
  isActive = '',
  parentId: number | null | undefined = null
) {
  return useQuery({
    queryKey: ['categories-list', page, search, isActive, parentId],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        is_active: isActive,
        parent_id: parentId === null ? 'null' : parentId,
      })
      const response = await api.get<LaravelPaginatedResponse<Category>>(`/categories?${params}`)
      return response.data
    },
  })
}

export function useCategory(id: number | null) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<Category>>(`/categories/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateCategory(setError?: UseFormSetError<CategoryFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CategoryFormValues) => {
      const response = await api.post<SuccessResponse<Category>>('/categories', toApiBody(toApiPayload(payload)))
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success(res.message || 'Category created successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to create category.'))
    },
  })
}

export function useUpdateCategory(setError?: UseFormSetError<CategoryFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CategoryFormValues }) => {
      const response = await api.put<SuccessResponse<Category>>(
        `/categories/${id}`,
        toApiBody(toApiPayload(payload))
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      qc.invalidateQueries({ queryKey: ['category', variables.id] })
      toast.success(res.message || 'Category updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update category.'))
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success('Category deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete category.'))
    },
  })
}

export function useToggleCategoryStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<Category>>(`/categories/${id}/status`)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success(res.message || 'Status updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status.'))
    },
  })
}

export function getCategoryName(name: string | Translatable, lang = 'en'): string {
  return getLocalizedValue(name, lang)
}
