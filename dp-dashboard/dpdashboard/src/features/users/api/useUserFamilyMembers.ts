import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'
import type { FamilyMemberItem, FamilyMemberPermissions } from '../types/family'

export function useUserFamilyMembers(userId: number | null | undefined) {
  return useQuery({
    queryKey: ['user-family-members', userId],
    queryFn: async () => {
      if (!userId) return []
      const response = await api.get<SuccessResponse<FamilyMemberItem[]>>(
        `/users/${userId}/family-members`
      )
      return response.data.data ?? []
    },
    enabled: !!userId,
  })
}

export function useUpdateFamilyMemberPermissions(ownerId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberId,
      permissions,
    }: {
      memberId: number
      permissions: Partial<FamilyMemberPermissions>
    }) => {
      const response = await api.patch<SuccessResponse<FamilyMemberItem>>(
        `/users/${ownerId}/family-members/${memberId}/permissions`,
        permissions
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-family-members', ownerId] })
      toast.success(res.message || i18n.t('permissionsUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('permissionsUpdateFailed')))
    },
  })
}

export function useUpdateFamilyMemberRelation(ownerId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      memberId,
      familyRelationId,
    }: {
      memberId: number
      familyRelationId: number
    }) => {
      const response = await api.patch<SuccessResponse<FamilyMemberItem>>(
        `/users/${ownerId}/family-members/${memberId}/relation`,
        { family_relation_id: familyRelationId }
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-family-members', ownerId] })
      toast.success(res.message || i18n.t('relationUpdated'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('relationUpdateFailed')))
    },
  })
}

export function useUnlinkFamilyMember(ownerId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: number) => {
      const response = await api.delete<SuccessResponse<unknown>>(
        `/users/${ownerId}/family-members/${memberId}`
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-family-members', ownerId] })
      qc.invalidateQueries({ queryKey: ['user', ownerId] })
      toast.success(res?.message || i18n.t('familyMemberUnlinked'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('familyMemberUnlinkFailed')))
    },
  })
}
