import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
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
      toast.success(res?.message || 'Family relation created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create family relation.'))
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
      toast.success(res?.message || 'Family relation updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update family relation.'))
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
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ['family-relations-list'] })
      qc.invalidateQueries({ queryKey: ['family-relation', variables.id] })
      toast.success(res?.message || 'Status updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status.'))
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
      toast.success(res?.message || 'Family relation deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete family relation.'))
    },
  })
}
