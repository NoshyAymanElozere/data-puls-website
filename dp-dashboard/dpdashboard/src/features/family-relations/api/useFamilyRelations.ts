import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { FamilyRelationDetail, FamilyRelationListItem, FamilyRelationName } from '../types/family-relations'

export interface FamilyRelationFormValues {
  name: {
    en: string
    ar: string
  }
  sort_order: number
  is_active?: boolean
}

export function useFamilyRelationsList(
  page = 1,
  search = '',
  isActive: boolean | string = '',
  perPage = 15
) {
  return useQuery({
    queryKey: ['family-relations-list', page, search, isActive, perPage],
    queryFn: async () => {
      const params = buildQueryParams({
        page,
        search,
        is_active: isActive !== '' ? isActive : undefined,
        per_page: perPage,
      })
      const response = await api.get<LaravelPaginatedResponse<FamilyRelationListItem>>(
        `/family-relations?${params}`
      )
      return response.data
    },
  })
}

export function useFamilyRelation(id: number | null | undefined) {
  return useQuery({
    queryKey: ['family-relation', id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<SuccessResponse<FamilyRelationDetail>>(
        `/family-relations/${id}`
      )
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateFamilyRelation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FamilyRelationFormValues) => {
      const response = await api.post<SuccessResponse<FamilyRelationDetail>>(
        '/family-relations',
        payload
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['family-relations-list'] })
      toast.success(res?.message || i18n.t('familyRelationCreated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('familyRelationCreateFailed')))
    },
  })
}

export function useUpdateFamilyRelation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: FamilyRelationFormValues
    }) => {
      const response = await api.put<SuccessResponse<FamilyRelationDetail>>(
        `/family-relations/${id}`,
        payload
      )
      return response.data
    },
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['family-relations-list'] })
      qc.invalidateQueries({ queryKey: ['family-relation', variables.id] })
      toast.success(res?.message || i18n.t('familyRelationUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('familyRelationUpdateFailed')))
    },
  })
}

export function useToggleFamilyRelationStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const response = await api.patch<SuccessResponse<FamilyRelationDetail>>(
        `/family-relations/${id}/status`,
        { is_active }
      )
      return response.data
    },
    onMutate: async ({ id, is_active }) => {
      await qc.cancelQueries({ queryKey: ['family-relations-list'] })
      const previousQueries = qc.getQueriesData({ queryKey: ['family-relations-list'] })

      qc.setQueriesData<LaravelPaginatedResponse<FamilyRelationListItem>>(
        { queryKey: ['family-relations-list'] },
        (old) => {
          if (!old || !old.data) return old
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, is_active } : item
            ),
          }
        }
      )

      return { previousQueries }
    },
    onError: (error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          qc.setQueryData(key, data)
        })
      }
      toast.error(getErrorMessage(error, i18n.t('statusUpdateFailed')))
    },
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({ queryKey: ['family-relations-list'] })
      qc.invalidateQueries({ queryKey: ['family-relation', variables.id] })
    },
    onSuccess: (res) => {
      toast.success(res?.message || i18n.t('statusUpdated'))
    },
  })
}

export function useDeleteFamilyRelation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<SuccessResponse<unknown>>(`/family-relations/${id}`)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['family-relations-list'] })
      toast.success(res?.message || i18n.t('familyRelationDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('familyRelationDeleteFailed')))
    },
  })
}
