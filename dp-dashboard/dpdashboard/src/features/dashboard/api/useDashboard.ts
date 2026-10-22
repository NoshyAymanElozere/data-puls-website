import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import i18n from '@/shared/i18n/i18n'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { LaravelPaginatedResponse, SuccessResponse } from '@/shared/types/laravel'
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
  /** `users_with_at_least_one_invoice` — active users are users who added ≥ 1 invoice */
  definition?: string
  /** Users who added invoices within the selected period */
  active_in_period?: number
}

export interface TotalUsersStatMetric {
  total: number
  new_in_period: number
  change_percentage: number
  change_direction: 'increase' | 'decrease'
  subtitle: string
}

export interface DownloadsStatMetric {
  total: number
  ios: number
  android: number
  source: 'manual' | string
}

export interface SubscriptionRevenueStatMetric {
  total: number
  formatted: string
  currency: string
  paid_transactions_count: number
  change_percentage: number
  change_direction: 'increase' | 'decrease'
  subtitle: string
}

export interface SubscribersStatMetric {
  active: number
  expiring_soon: number
  expired_not_renewed: number
  expiring_soon_days: number
}

export interface DashboardMenuCounts {
  users?: number
  warranty_periods?: number
  categories?: number
  reports?: number
}

export interface DashboardStatsData {
  total_invoices: InvoiceStatMetric
  active_warranties: WarrantyStatMetric
  total_spending: SpendingStatMetric
  active_users: UserStatMetric
  total_users?: TotalUsersStatMetric
  downloads?: DownloadsStatMetric
  subscription_revenue?: SubscriptionRevenueStatMetric
  subscribers?: SubscribersStatMetric
  menu_counts?: DashboardMenuCounts
}

export type SubscriberFollowUpStatus = 'expiring_soon' | 'active' | 'expired'

export const SUBSCRIBER_FOLLOW_UP_STATUSES: SubscriberFollowUpStatus[] = ['expiring_soon', 'active', 'expired']

export interface SubscriberFollowUpRow {
  subscription_id: number
  status: string
  status_label: string
  user: { id: number; name: string; phone: string | null; email: string | null } | null
  package: { id: number; name: string } | null
  billing_period: string | null
  billing_period_label: string | null
  price: number | null
  currency: string | null
  auto_renewal: boolean
  starts_at: string | null
  ends_at: string | null
  days_remaining: number | null
  days_since_expired: number | null
}

export interface SubscriberFollowUpList {
  count: number
  items: SubscriberFollowUpRow[]
}

export interface SubscriberFollowUpOverview {
  expiring_soon_days: number
  lists: Record<SubscriberFollowUpStatus, SubscriberFollowUpList>
}

export interface SubscribersListParams {
  status: SubscriberFollowUpStatus
  search?: string
  page?: number
  per_page?: number
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
  store_name?: string
  due_date: string
  formatted_due_date: string
  category: string
  icon_type?: string
  days_remaining: number
  invoice_id?: number
  user_id?: number
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

/** Hook to fetch the subscriber follow-up widget (counts + first 5 rows per list) */
export function useSubscriberFollowUp() {
  return useQuery({
    queryKey: ['dashboard-subscriber-follow-up'],
    queryFn: async () => {
      const res = await api.get<SuccessResponse<SubscriberFollowUpOverview>>('/dashboard/subscriber-follow-up')
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch the paginated subscribers list for the follow-up page */
export function useDashboardSubscribers({ status, search = '', page = 1, per_page = 15 }: SubscribersListParams) {
  return useQuery({
    queryKey: ['dashboard-subscribers', status, search, page, per_page],
    queryFn: async () => {
      const params = buildQueryParams({ status, search, page, per_page })
      const res = await api.get<LaravelPaginatedResponse<SubscriberFollowUpRow>>(`/dashboard/subscribers?${params}`)
      return res.data
    },
    placeholderData: (previous) => previous,
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
      toast.success(i18n.t('dashboardCsvDownloaded'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, i18n.t('dashboardExportFailed')))
    },
  })
}

/**
 * Hook to retrieve aggregated counts for the 4 main menu domains:
 * Users, Warranty Periods, Categories, and Reports.
 * Prioritizes `stats.menu_counts` from backend.
 * Falls back to active_users and paginated endpoints if backend hasn't deployed menu_counts yet.
 */
export function useDashboardMenuCounts(stats?: DashboardStatsData) {
  const hasBackendMenuCounts =
    stats?.menu_counts?.users !== undefined &&
    stats?.menu_counts?.warranty_periods !== undefined &&
    stats?.menu_counts?.categories !== undefined &&
    stats?.menu_counts?.reports !== undefined

  const fallbackWarrantyPeriods = useQuery({
    queryKey: ['dashboard-fallback-warranty-periods-count'],
    queryFn: async () => {
      const res = await api.get('/warranty-periods?per_page=1')
      return res.data?.meta?.total ?? res.data?.data?.meta?.total ?? res.data?.total ?? 0
    },
    enabled: !hasBackendMenuCounts && stats?.menu_counts?.warranty_periods === undefined,
    staleTime: 60_000,
  })

  const fallbackCategories = useQuery({
    queryKey: ['dashboard-fallback-categories-count'],
    queryFn: async () => {
      const res = await api.get('/categories?per_page=1')
      return res.data?.meta?.total ?? res.data?.data?.meta?.total ?? res.data?.total ?? 0
    },
    enabled: !hasBackendMenuCounts && stats?.menu_counts?.categories === undefined,
    staleTime: 60_000,
  })

  // active_users now means "users with ≥ 1 invoice", so prefer the registered-users total
  const usersCount = stats?.menu_counts?.users ?? stats?.total_users?.total ?? stats?.active_users?.total ?? 0
  const warrantyPeriodsCount =
    stats?.menu_counts?.warranty_periods ?? fallbackWarrantyPeriods.data ?? 0
  const categoriesCount =
    stats?.menu_counts?.categories ?? fallbackCategories.data ?? 0
  const reportsCount = stats?.menu_counts?.reports ?? 5

  const isLoading =
    !hasBackendMenuCounts &&
    ((stats?.menu_counts?.warranty_periods === undefined && fallbackWarrantyPeriods.isLoading) ||
      (stats?.menu_counts?.categories === undefined && fallbackCategories.isLoading))

  return {
    users: usersCount,
    warrantyPeriods: warrantyPeriodsCount,
    categories: categoriesCount,
    reports: reportsCount,
    isLoading,
  }
}
