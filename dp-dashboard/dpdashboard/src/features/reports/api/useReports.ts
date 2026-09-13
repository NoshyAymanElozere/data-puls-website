import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse } from '@/shared/types/laravel'
import { buildQueryParams } from '@/shared/utils/query-params'

export interface MoneyMetric {
  amount: number
  formatted_amount: string
  currency: string
}

export interface GrowthMetric {
  percentage: number
  type: string
  formatted: string
}

export interface TopMerchantMetric {
  id: number
  name: string
  sales_volume: number
  invoices_count?: number
  transactions_count?: number
  bookings_count?: number
}

export interface TopCategoryMetric {
  id: number
  name: string
  name_ar?: string
  sales_volume: number
  invoices_count: number
}

export interface ReportsSummaryData {
  total_sales: MoneyMetric
  total_spending: MoneyMetric
  booking_growth?: GrowthMetric
  invoice_growth?: GrowthMetric
  top_merchant?: TopMerchantMetric
  top_destination?: TopMerchantMetric
  top_category?: TopCategoryMetric
  currency?: string
  kpis?: {
    invoices?: {
      total_count: number
      total_amount: number
      formatted_amount: string
      average_amount: number
      growth_percentage: number
      sales_growth_percentage?: number
    }
    warranties?: {
      total_count: number
      active_count: number
      expiring_soon_count: number
      expired_count: number
    }
    subscriptions?: {
      active_subscribers: number
      trial_subscribers: number
      active_packages_count: number
      estimated_mrr: number
      formatted_mrr: string
    }
    users?: {
      total_users: number
      new_users_count: number
      account_owners_count: number
      family_members_count: number
    }
  }
}

export interface FinancialGrowthChartPoint {
  month: string
  period?: string
  revenue: number
  invoice_sales?: number
  subscription_revenue?: number
  expenses: number
  net_profit: number
  growth_rate?: number
}

export interface FinancialGrowthData {
  year: number
  period: string
  currency: string
  chart_data: FinancialGrowthChartPoint[]
}

export interface CategoryShareItem {
  category_id: number
  name: string
  name_ar?: string
  value: number
  total_sales: number
  invoices_count?: number
  average_invoice_value?: number
  stores_count?: number
}

export interface InvoicesReportParams {
  date_from?: string
  date_to?: string
  category_id?: number
  city_id?: number
  min_amount?: number
  max_amount?: number
  store_name?: string
  has_warranty?: boolean
}

export interface InvoicesReportData {
  summary: {
    total_invoices: number
    total_amount: number
    average_amount: number
    min_amount: number
    max_amount: number
    invoices_with_warranty: number
    warranty_attachment_rate: number
    currency: string
  }
  by_category: Array<{
    category_id: number
    name: string
    name_ar?: string
    total_sales: number
    invoices_count: number
    share_percentage: number
  }>
  top_stores: Array<{
    store_name: string
    sales_volume: number
    invoices_count: number
    average_invoice_value: number
    share_percentage: number
  }>
  amount_brackets: Array<{
    label: string
    count: number
  }>
}

export interface WarrantiesReportParams {
  date_from?: string
  date_to?: string
  warranty_period_id?: number
  status?: 'active' | 'expired' | 'expiring_soon' | 'all'
  expiring_days?: number
  category_id?: number
  store_name?: string
}

export interface WarrantiesReportData {
  summary: {
    total_warranties: number
    active_warranties: number
    expired_warranties: number
    expiring_soon_count: number
    expiring_7_days: number
    expiring_30_days: number
    expiring_90_days: number
    average_duration_months: number
  }
  by_period: Array<{
    warranty_period_id: number
    name: string
    name_ar?: string
    count: number
    percentage: number
  }>
  top_stores_covered: Array<{
    store_name: string
    warranties_count: number
  }>
  expiring_forecast: Array<{
    period: string
    count: number
  }>
}

export interface SubscriptionsReportParams {
  date_from?: string
  date_to?: string
  subscription_package_id?: number
  billing_period?: 'monthly' | 'yearly'
  status?: 'active' | 'trial' | 'cancelled' | 'expired' | 'all'
}

export interface SubscriptionsReportData {
  summary: {
    total_subscribers: number
    active_subscribers: number
    trial_subscribers: number
    cancelled_subscribers: number
    expired_subscribers: number
    estimated_mrr: number
    estimated_arr: number
    average_revenue_per_user: number
    currency: string
  }
  packages: Array<{
    package_id: number
    name: string
    name_ar?: string
    total_subscriptions: number
    active_subscribers: number
    monthly_mrr: number
  }>
  billing_cycles: {
    monthly: {
      count: number
      percentage: number
    }
    yearly: {
      count: number
      percentage: number
    }
  }
}

export interface UsersReportParams {
  date_from?: string
  date_to?: string
  city_id?: number
  country_id?: number
  status?: 'active' | 'inactive' | 'suspended' | 'all'
  has_family?: boolean
}

export interface UsersReportData {
  summary: {
    total_users: number
    active_users: number
    inactive_users: number
    phone_verified_count: number
    phone_verified_rate: number
    account_owners_count: number
    family_members_count: number
    average_family_size: number
  }
  geographic_distribution: Array<{
    city_id: number
    name: string
    name_ar?: string
    users_count: number
    percentage: number
  }>
  top_spenders: Array<{
    user_id: number
    name: string
    email: string
    phone: string
    city: string
    total_spent: number
    invoice_count: number
  }>
}

export interface MerchantsReportParams {
  date_from?: string
  date_to?: string
  search?: string
  category_id?: number
  limit?: number
}

export interface MerchantsReportData {
  summary: {
    total_unique_merchants: number
    total_sales_volume: number
    top_merchant_name: string
    top_merchant_sales: number
    average_sales_per_merchant: number
    currency: string
  }
  merchants: Array<{
    store_name: string
    total_sales: number
    invoices_count: number
    average_invoice_value: number
    unique_customers: number
    warranties_count: number
    market_share_percentage: number
  }>
}

export type ReportExportFormat = 'csv' | 'xlsx' | 'pdf'
export type ReportExportModule =
  | 'all'
  | 'invoices'
  | 'warranties'
  | 'subscriptions'
  | 'users'
  | 'merchants'
  | 'categories'
  | 'financial'

export interface ReportExportParams {
  format: ReportExportFormat
  module?: ReportExportModule
  date_from?: string
  date_to?: string
}

export interface ReportExportResult {
  download_url: string
  filename: string
  expires_at: string
  records_count: number
}

/** Hook to fetch high-level reports performance metrics */
export function useReportsSummary(dateFrom?: string, dateTo?: string, categoryId?: number, cityId?: number) {
  return useQuery({
    queryKey: ['reports-summary', dateFrom, dateTo, categoryId, cityId],
    queryFn: async () => {
      const params = buildQueryParams({
        date_from: dateFrom,
        date_to: dateTo,
        category_id: categoryId,
        city_id: cityId,
      })
      const res = await api.get<SuccessResponse<ReportsSummaryData>>(`/reports/summary?${params}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch time-series financial growth data */
export function useFinancialGrowth(year?: number, period: 'monthly' | 'quarterly' | 'yearly' = 'monthly', categoryId?: number) {
  return useQuery({
    queryKey: ['reports-financial-growth', year, period, categoryId],
    queryFn: async () => {
      const params = buildQueryParams({
        year,
        period,
        category_id: categoryId,
      })
      const res = await api.get<SuccessResponse<FinancialGrowthData>>(`/reports/financial-growth?${params}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch category spending share percentages */
export function useCategoryShare(limit = 6, dateFrom?: string, dateTo?: string, parentId?: number) {
  return useQuery({
    queryKey: ['reports-category-share', limit, dateFrom, dateTo, parentId],
    queryFn: async () => {
      const params = buildQueryParams({
        limit,
        date_from: dateFrom,
        date_to: dateTo,
        parent_id: parentId,
      })
      const res = await api.get<SuccessResponse<CategoryShareItem[]>>(`/reports/category-share?${params}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Invoices & Spending analytics report */
export function useInvoicesReport(params?: InvoicesReportParams) {
  return useQuery({
    queryKey: ['reports-invoices', params],
    queryFn: async () => {
      const query = buildQueryParams({
        date_from: params?.date_from,
        date_to: params?.date_to,
        category_id: params?.category_id,
        city_id: params?.city_id,
        min_amount: params?.min_amount,
        max_amount: params?.max_amount,
        store_name: params?.store_name,
        has_warranty: params?.has_warranty,
      })
      const res = await api.get<SuccessResponse<InvoicesReportData>>(`/reports/invoices?${query}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Warranties Status & Expirations analytics report */
export function useWarrantiesReport(params?: WarrantiesReportParams) {
  return useQuery({
    queryKey: ['reports-warranties', params],
    queryFn: async () => {
      const query = buildQueryParams({
        date_from: params?.date_from,
        date_to: params?.date_to,
        warranty_period_id: params?.warranty_period_id,
        status: params?.status,
        expiring_days: params?.expiring_days,
        category_id: params?.category_id,
        store_name: params?.store_name,
      })
      const res = await api.get<SuccessResponse<WarrantiesReportData>>(`/reports/warranties?${query}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Subscriptions & Recurring Revenue analytics report */
export function useSubscriptionsReport(params?: SubscriptionsReportParams) {
  return useQuery({
    queryKey: ['reports-subscriptions', params],
    queryFn: async () => {
      const query = buildQueryParams({
        date_from: params?.date_from,
        date_to: params?.date_to,
        subscription_package_id: params?.subscription_package_id,
        billing_period: params?.billing_period,
        status: params?.status,
      })
      const res = await api.get<SuccessResponse<SubscriptionsReportData>>(`/reports/subscriptions?${query}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Users Growth & Demographics analytics report */
export function useUsersReport(params?: UsersReportParams) {
  return useQuery({
    queryKey: ['reports-users', params],
    queryFn: async () => {
      const query = buildQueryParams({
        date_from: params?.date_from,
        date_to: params?.date_to,
        city_id: params?.city_id,
        country_id: params?.country_id,
        status: params?.status,
        has_family: params?.has_family,
      })
      const res = await api.get<SuccessResponse<UsersReportData>>(`/reports/users?${query}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to fetch Merchants Ranking & Performance analytics report */
export function useMerchantsReport(params?: MerchantsReportParams) {
  return useQuery({
    queryKey: ['reports-merchants', params],
    queryFn: async () => {
      const query = buildQueryParams({
        date_from: params?.date_from,
        date_to: params?.date_to,
        search: params?.search,
        category_id: params?.category_id,
        limit: params?.limit,
      })
      const res = await api.get<SuccessResponse<MerchantsReportData>>(`/reports/merchants?${query}`)
      return res.data.data
    },
    staleTime: 60_000,
  })
}

/** Hook to generate downloadable CSV / XLSX / PDF reports */
export function useExportReport() {
  return useMutation({
    mutationFn: async (params: ReportExportParams) => {
      const query = buildQueryParams({
        format: params.format,
        module: params.module || 'all',
        date_from: params.date_from,
        date_to: params.date_to,
      })
      const res = await api.get<SuccessResponse<ReportExportResult>>(`/reports/export?${query}`)
      const data = res.data.data
      
      if (data?.download_url) {
        // Trigger browser download via the signed temporary URL
        const link = document.createElement('a')
        link.href = data.download_url
        link.setAttribute('download', data.filename || `report-${Date.now()}.${params.format}`)
        link.setAttribute('target', '_blank')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      return data
    },
    onSuccess: (data) => {
      toast.success(`Report "${data.filename}" generated successfully (${data.records_count} records).`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to generate report export.'))
    },
  })
}
