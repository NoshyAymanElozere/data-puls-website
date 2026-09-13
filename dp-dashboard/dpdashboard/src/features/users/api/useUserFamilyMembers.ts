import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
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
      toast.success(res.message || 'Permissions updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update permissions.'))
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
      toast.success(res.message || 'Relation updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update relation.'))
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
      toast.success(res?.message || 'Family member unlinked successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to unlink family member.'))
    },
  })
}
