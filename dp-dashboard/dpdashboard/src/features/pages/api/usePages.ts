import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface PageSectionSummary {
  id: number
  title: string | Translatable
  description?: string | Translatable
  sort_order: number
  icon_url?: string | null
}

export interface Page {
  id: number
  key: string
  title: string | Translatable
  description: string | Translatable
  sort_order: number
  sections?: PageSectionSummary[]
  created_at?: string
}

export interface PageFormData {
  titleEn: string
  titleAr: string
  contentEn: string
  contentAr: string
}

function isTranslatable(value: string | Translatable | undefined): value is Translatable {
  return typeof value === 'object' && value !== null && 'en' in value && 'ar' in value
}

export function getTranslatable(value: string | Translatable | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[lang] || ''
}

export function usePagesList() {
  return useQuery({
    queryKey: ['pages-list'],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<Page[]>>('/pages')
      return response.data.data
    },
  })
}

export function usePage(id: number | null) {
  return useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<Page>>(`/pages/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function usePageByKey(key: string) {
  const listQuery = usePagesList()
  const pageFromList = listQuery.data?.find((p) => p.key === key)
  const detailQuery = usePage(pageFromList?.id ?? null)

  return {
    pageId: pageFromList?.id ?? null,
    pageKey: key,
    data: detailQuery.data,
    isLoading: listQuery.isLoading || (!!pageFromList?.id && detailQuery.isLoading),
    isNotFound: !listQuery.isLoading && !pageFromList,
    refetch: () => {
      listQuery.refetch()
      detailQuery.refetch()
    },
  }
}

export function useUpdatePage(setError?: UseFormSetError<PageFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: PageFormData }) => {
      const formData = createPutFormData({})
      appendTranslatable(formData, 'title', { en: payload.titleEn, ar: payload.titleAr })
      appendTranslatable(formData, 'description', { en: payload.contentEn, ar: payload.contentAr })

      const response = await api.post<SuccessResponse<Page>>(`/pages/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['pages-list'] })
      qc.invalidateQueries({ queryKey: ['page', variables.id] })
      toast.success(res.message || 'Page updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update page.'))
    },
  })
}

export function pageToFormValues(page: Page | undefined): PageFormData {
  if (!page) {
    return { titleEn: '', titleAr: '', contentEn: '', contentAr: '' }
  }

  return {
    titleEn: getTranslatable(page.title, 'en'),
    titleAr: getTranslatable(page.title, 'ar'),
    contentEn: getTranslatable(page.description, 'en'),
    contentAr: getTranslatable(page.description, 'ar'),
  }
}

export { isTranslatable }
