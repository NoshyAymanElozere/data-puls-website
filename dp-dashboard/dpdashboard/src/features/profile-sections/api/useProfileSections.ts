import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'

export type ProfileSectionKey =
  | 'subscription'
  | 'financial_analysis'
  | 'app_settings'
  | 'biometric_login'
  | 'categories'
  | 'herz_partners'
  | 'privacy_policy'
  | 'contact_us'
  | 'terms_and_conditions'

export interface ProfileSection {
  id: number
  key: ProfileSectionKey
  /** Localized by the backend from Accept-Language. */
  title: string
  is_active: boolean
  status: 'active' | 'inactive'
  status_label: string
  sort_order: number
}

const QUERY_KEY = 'profile-sections'

export function useProfileSections() {
  const { i18n: instance } = useTranslation()

  return useQuery({
    // Titles come translated from the backend, so each language has its own cache entry.
    queryKey: [QUERY_KEY, instance.language],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<ProfileSection[]>>('/profile-sections')
      return response.data.data
    },
  })
}

export function useToggleProfileSectionStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<SuccessResponse<ProfileSection>>(`/profile-sections/${id}/status`)
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(i18n.t('profileSectionStatusUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('profileSectionStatusFailed')))
    },
  })
}

/** Takes the sections in their new order. The list moves at once and returns to the old order if saving fails. */
export function useSortProfileSections() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (sections: ProfileSection[]) => {
      const response = await api.put<SuccessResponse<ProfileSection[]>>('/profile-sections/sort', {
        ids: sections.map((section) => section.id),
      })
      return response.data
    },
    onMutate: async (sections) => {
      const queryKey = [QUERY_KEY, i18n.language]
      await qc.cancelQueries({ queryKey: [QUERY_KEY] })
      const previous = qc.getQueryData<ProfileSection[]>(queryKey)
      qc.setQueryData(queryKey, sections)
      return { queryKey, previous }
    },
    onSuccess: () => {
      toast.success(i18n.t('profileSectionsSorted'))
    },
    onError: (error, _sections, context) => {
      if (context) qc.setQueryData(context.queryKey, context.previous)
      toast.error(getErrorMessage(error, i18n.t('profileSectionsSortFailed')))
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
