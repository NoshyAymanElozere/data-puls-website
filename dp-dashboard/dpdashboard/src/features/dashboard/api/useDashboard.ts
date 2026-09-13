import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'

export type DashboardPeriod = 'this_month' | 'last_month' | 'this_year'
export type DashboardAnalyticsPeriod = 'weekly' | 'monthly' | 'yearly'

export interface InvoiceStatMetric {
  total: number
  change_percentage: number
  change_direction: 'increase' | 'decrease'
  subtitle: string
}

export interface WarrantyStatMetric {
  total: number
  status: string
  expiring_soon_count: number
  subtitle: string
}

export interface SpendingStatMetric {
  total: number
  formatted: string
  change_percentage: number
  change_direction: 'increase' | 'decrease'
  subtitle: string
}

export interface UserStatMetric {
  total: number
  change_percentage: number
  change_direction: 'increase' | 'decrease'
  subtitle: string
}

export interface DashboardStatsData {
  total_invoices: InvoiceStatMetric
  active_warranties: WarrantyStatMetric
  total_spending: SpendingStatMetric
  active_users: UserStatMetric
}

export interface DashboardAnalyticsItem {
  day: string
  val: string
  type: 'striped' | 'solid' | 'light' | 'dark-solid'
  tooltip?: string
}

export interface DashboardAnalyticsData {
  period: DashboardAnalyticsPeriod
  items: DashboardAnalyticsItem[]
}

export interface ExpiringWarranty {
  id: number
  title: string
  store_name: string
  due_date: string
  formatted_due_date: string
  category: string
  icon_type?: string
  days_remaining: number
}

export interface DashboardProgressGaugeData {
  percentage: number
  status_label: string
  breakdown: {
    completed: number
    in_progress: number
    pending: number
  }
}

/** Hook to fetch Dashboard KPI Stats */
export function useDashboardStats(period: DashboardPeriod = 'this_month') {
  return useQuery({
    queryKey: ['dashboard-stats', period],
    queryFn: async () => {
      const params = buildQueryParams({ period })
      const res = await api.get<SuccessResponse<DashboardStatsData>>(`/dashboard/stats?${params}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Dashboard Activity Analytics */
export function useDashboardAnalytics(period: DashboardAnalyticsPeriod = 'weekly') {
  return useQuery({
    queryKey: ['dashboard-analytics', period],
    queryFn: async () => {
      const params = buildQueryParams({ period })
      const res = await api.get<SuccessResponse<DashboardAnalyticsData>>(`/dashboard/analytics?${params}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Expiring Warranties list */
export function useExpiringWarranties() {
  return useQuery({
    queryKey: ['dashboard-expiring-warranties'],
    queryFn: async () => {
      const res = await api.get<SuccessResponse<ExpiringWarranty[]>>('/dashboard/expiring-warranties')
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Invoice & Warranty Categorization Progress Gauge */
export function useDashboardProgressGauge() {
  return useQuery({
    queryKey: ['dashboard-progress-gauge'],
    queryFn: async () => {
      const res = await api.get<SuccessResponse<DashboardProgressGaugeData>>('/dashboard/progress-gauge')
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to export dashboard summary as CSV */
export function useExportDashboardSummary() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get('/dashboard/export', {
        responseType: 'blob',
      })
      
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl

      // Extract filename from header if present
      const disposition = response.headers['content-disposition']
      let filename = `dashboard-stats-${new Date().toISOString().split('T')[0]}.csv`
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '')
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      return true
    },
    onSuccess: () => {
      toast.success('Dashboard CSV summary downloaded successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to export dashboard summary.'))
    },
  })
}
