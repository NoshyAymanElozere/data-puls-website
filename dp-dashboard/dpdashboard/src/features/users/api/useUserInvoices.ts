import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { InvoiceDetail, InvoiceListItem } from '../types/invoices'

export function useUserInvoices(
  userId: number | null | undefined,
  page = 1,
  search = '',
  perPage = 15,
  includeFamily = false
) {
  return useQuery({
    queryKey: ['user-invoices', userId, page, search, perPage, includeFamily],
    queryFn: async () => {
      if (!userId) return null
      const params = buildQueryParams({
        page,
        search,
        per_page: perPage,
        include_family: includeFamily ? true : undefined,
      })
      const response = await api.get<LaravelPaginatedResponse<InvoiceListItem>>(
        `/users/${userId}/invoices?${params}`
      )
      return response.data
    },
    enabled: !!userId,
  })
}

export function useUserInvoiceDetail(
  userId: number | null | undefined,
  invoiceId: number | null | undefined
) {
  return useQuery({
    queryKey: ['user-invoice-detail', userId, invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null
      const url = userId
        ? `/users/${userId}/invoices/${invoiceId}`
        : `/invoices/${invoiceId}`
      const response = await api.get<SuccessResponse<InvoiceDetail>>(url)
      return response.data.data
    },
    enabled: !!invoiceId,
  })
}

export function useDeleteUserInvoice(userId: number | null | undefined) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (invoiceId: number) => {
      const response = await api.delete<SuccessResponse<unknown>>(
        `/users/${userId}/invoices/${invoiceId}`
      )
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['user-invoices', userId] })
      qc.invalidateQueries({ queryKey: ['user', userId] })
      toast.success(res?.message || i18n.t('invoiceDeleted'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('invoiceDeleteFailed')))
    },
  })
}
