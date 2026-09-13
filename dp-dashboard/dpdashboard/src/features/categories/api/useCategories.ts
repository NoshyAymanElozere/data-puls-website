import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage, getValidationErrors } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { Path, UseFormSetError } from 'react-hook-form'
import type { CategoryFormValues } from '../pages/validationSchema'

export const NATHRIAT_SLUG = 'nathriat'

export interface CategoryUser {
  id: number
  name: string
  email: string
}

export interface Category {
  id: number
  name: string | Translatable
  description?: string | Translatable | null
  icon?: string | null
  icon_bg_color?: string | null
  icon_url?: string | null
  slug: string
  is_default: boolean
  creator_name?: string | null
  user_id?: number | null
  user?: CategoryUser | null
  parent_id: number | null
  parent_name?: string | Translatable | null
  allows_subcategories: boolean
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

function applyCategoryValidationErrors(
  error: unknown,
  setError: UseFormSetError<CategoryFormValues>
): boolean {
  const errors = getValidationErrors(error)
  if (!errors) return false

  const fieldMap: Record<string, keyof CategoryFormValues> = {
    'name.en': 'nameEn',
    'name.ar': 'nameAr',
    'description.en': 'descriptionEn',
    'description.ar': 'descriptionAr',
    icon: 'icon',
    icon_bg_color: 'icon_bg_color',
    bg_color: 'icon_bg_color',
    background_color: 'icon_bg_color',
    slug: 'slug',
    sort_order: 'sort_order',
    is_active: 'is_active',
    parent_id: 'parent_id',
  }

  let matched = false
  Object.entries(errors).forEach(([field, messages]) => {
    const targetKey = fieldMap[field] || (field as keyof CategoryFormValues)
    if (targetKey) {
      setError(targetKey as Path<CategoryFormValues>, { type: 'server', message: messages[0] })
      matched = true
    }
  })
  return matched
}

function toCreatePayload(payload: CategoryFormValues) {
  return {
    name: {
      en: payload.nameEn,
      ar: payload.nameAr,
    },
    description: {
      en: payload.descriptionEn || '',
      ar: payload.descriptionAr || '',
    },
    icon: payload.icon,
    icon_bg_color: payload.icon_bg_color,
    ...(payload.slug ? { slug: payload.slug } : {}),
    ...(payload.sort_order != null ? { sort_order: Number(payload.sort_order) } : {}),
    is_active: Boolean(payload.is_active),
    parent_id: payload.parent_id != null ? Number(payload.parent_id) : null,
  }
}

function toUpdatePayload(payload: CategoryFormValues) {
  return {
    _method: 'PUT',
    name: {
      en: payload.nameEn,
      ar: payload.nameAr,
    },
    description: {
      en: payload.descriptionEn || '',
      ar: payload.descriptionAr || '',
    },
    icon: payload.icon,
    icon_bg_color: payload.icon_bg_color,
    ...(payload.sort_order != null ? { sort_order: Number(payload.sort_order) } : {}),
    is_active: Boolean(payload.is_active),
  }
}

export function isNathriatCategory(category: Pick<Category, 'slug'> | { slug?: string; id?: number }): boolean {
  if ('id' in category && category.id === 1) return true
  return category.slug === NATHRIAT_SLUG
}

export function useCategoriesList(
  page = 1,
  search = '',
  isActive = '',
  parentId: number | null | undefined = null,
  isDefault = ''
) {
  return useQuery({
    queryKey: ['categories-list', page, search, isActive, parentId, isDefault],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        is_active: isActive,
        is_default: isDefault,
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
      const body = toCreatePayload(payload)
      const response = await api.post<SuccessResponse<Category>>('/categories', body)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success(res.message || 'Category created successfully.')
    },
    onError: (error) => {
      if (setError && applyCategoryValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to create category.'))
    },
  })
}

export function useUpdateCategory(setError?: UseFormSetError<CategoryFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CategoryFormValues }) => {
      const body = toUpdatePayload(payload)
      const response = await api.post<SuccessResponse<Category>>(
        `/categories/${id}`,
        body
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['categories-list'] })
      qc.invalidateQueries({ queryKey: ['category', variables.id] })
      toast.success(res.message || 'Category updated successfully.')
    },
    onError: (error) => {
      if (setError && applyCategoryValidationErrors(error, setError)) return
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
