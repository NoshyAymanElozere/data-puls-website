import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendOptionalFile, appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { buildQueryParams } from '@/shared/utils/query-params'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import type { UseFormSetError } from 'react-hook-form'

export interface PageSection {
  id: number
  page_id: number
  title: Translatable | string
  description: Translatable | string
  sort_order: number
  icon_url?: string | null
  created_at?: string
}

export interface PageSectionFormData {
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  sort_order: number
  icon?: File | null
}

export function usePageSectionsList(pageId: number | null, page = 1, search = '') {
  return useQuery({
    queryKey: ['page-sections-list', pageId, page, search],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, page_id: pageId ?? undefined })
      const response = await api.get<LaravelPaginatedResponse<PageSection>>(`/page-sections?${params}`)
      return response.data
    },
    enabled: !!pageId,
  })
}

export function usePageSection(id: number | null) {
  return useQuery({
    queryKey: ['page-section', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<PageSection>>(`/page-sections/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

function buildSectionFormData(payload: PageSectionFormData, pageId?: number, isUpdate = false) {
  const formData = isUpdate ? createPutFormData({ sort_order: payload.sort_order }) : new FormData()

  if (!isUpdate && pageId) {
    formData.append('page_id', String(pageId))
    formData.append('sort_order', String(payload.sort_order))
  }

  appendTranslatable(formData, 'title', { en: payload.titleEn, ar: payload.titleAr })
  appendTranslatable(formData, 'description', { en: payload.descriptionEn, ar: payload.descriptionAr })
  appendOptionalFile(formData, 'icon', payload.icon)

  return formData
}

export function useCreatePageSection(setError?: UseFormSetError<PageSectionFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId, payload }: { pageId: number; payload: PageSectionFormData }) => {
      const formData = buildSectionFormData(payload, pageId, false)
      const response = await api.post<SuccessResponse<PageSection>>('/page-sections', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['page-sections-list', variables.pageId] })
      qc.invalidateQueries({ queryKey: ['page', variables.pageId] })
      toast.success(res.message || i18n.t('sectionCreated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('sectionCreateFailed')))
    },
  })
}

export function useUpdatePageSection(setError?: UseFormSetError<PageSectionFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      pageId,
      payload,
    }: {
      id: number
      pageId: number
      payload: PageSectionFormData
    }) => {
      const formData = buildSectionFormData(payload, pageId, true)
      const response = await api.post<SuccessResponse<PageSection>>(`/page-sections/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['page-sections-list', variables.pageId] })
      qc.invalidateQueries({ queryKey: ['page-section', variables.id] })
      qc.invalidateQueries({ queryKey: ['page', variables.pageId] })
      toast.success(res.message || i18n.t('sectionUpdated'))
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, i18n.t('sectionUpdateFailed')))
    },
  })
}

export function useDeletePageSection() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, pageId }: { id: number; pageId: number }) => {
      await api.delete(`/page-sections/${id}`)
      return pageId
    },
    onSuccess: (pageId) => {
      qc.invalidateQueries({ queryKey: ['page-sections-list', pageId] })
      qc.invalidateQueries({ queryKey: ['page', pageId] })
      toast.success(i18n.t('sectionDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('sectionDeleteFailed')))
    },
  })
}

export function sectionToFormValues(section?: PageSection | null): PageSectionFormData {
  if (!section) {
    return { titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', sort_order: 0, icon: null }
  }

  const title = typeof section.title === 'string' ? { en: section.title, ar: section.title } : section.title
  const description =
    typeof section.description === 'string'
      ? { en: section.description, ar: section.description }
      : section.description

  return {
    titleEn: title.en || '',
    titleAr: title.ar || '',
    descriptionEn: description.en || '',
    descriptionAr: description.ar || '',
    sort_order: section.sort_order ?? 0,
    icon: null,
  }
}
