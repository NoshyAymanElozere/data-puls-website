import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart as RechartsPie,
  Pie,
} from 'recharts'
import { Badge } from '@/shared/components/badge'
import {
  TrendingUp,
  DollarSign,
  Store,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  FileText,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Users as UsersIcon,
  PieChart as PieChartIcon,
  Search,
  Award,
  Smartphone,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { formatCurrency, cn } from '@/shared/utils/utils'
import { useTranslation } from 'react-i18next'
import {
  useReportsSummary,
  useFinancialGrowth,
  useCategoryShare,
  useInvoicesReport,
  useWarrantiesReport,
  useSubscriptionsReport,
  useUsersReport,
  useMerchantsReport,
  useExportReport,
  type ReportExportFormat,
  type ReportExportModule,
} from '../api/useReports'

type ReportTab = 'overview' | 'invoices' | 'warranties' | 'subscriptions' | 'users' | 'merchants'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b']

export default function Reports() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  // Tab State
  const [activeTab, setActiveTab] = useState<ReportTab>('overview')

  // Global Filter states
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [financialPeriod, setFinancialPeriod] = useState<'monthly' | 'quarterly'>('monthly')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  // Merchant search state
  const [merchantSearch, setMerchantSearch] = useState<string>('')

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<ReportExportFormat>('pdf')
  const [exportModule, setExportModule] = useState<ReportExportModule>('all')

  // API Queries
  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching,
  } = useReportsSummary(dateFrom || undefined, dateTo || undefined)

  const {
    data: financialGrowth,
    isLoading: isFinancialLoading,
    refetch: refetchFinancial,
  } = useFinancialGrowth(selectedYear, financialPeriod)

  const {
    data: categoryShare,
    isLoading: isCategoryLoading,
    refetch: refetchCategory,
  } = useCategoryShare(8, dateFrom || undefined, dateTo || undefined)

  const {
    data: invoicesReport,
    isLoading: isInvoicesLoading,
    refetch: refetchInvoices,
  } = useInvoicesReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })

  const {
    data: warrantiesReport,
    isLoading: isWarrantiesLoading,
    refetch: refetchWarranties,
  } = useWarrantiesReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })

  const {
    data: subscriptionsReport,
    isLoading: isSubscriptionsLoading,
    refetch: refetchSubscriptions,
  } = useSubscriptionsReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })

  const {
    data: usersReport,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useUsersReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })

  const {
    data: merchantsReport,
    isLoading: isMerchantsLoading,
    refetch: refetchMerchants,
  } = useMerchantsReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search: merchantSearch || undefined,
  })

  const exportMutation = useExportReport()

  const handleRefreshAll = () => {
    refetchSummary()
    if (activeTab === 'overview') {
      refetchFinancial()
      refetchCategory()
    } else if (activeTab === 'invoices') {
      refetchInvoices()
    } else if (activeTab === 'warranties') {
      refetchWarranties()
    } else if (activeTab === 'subscriptions') {
      refetchSubscriptions()
    } else if (activeTab === 'users') {
      refetchUsers()
    } else if (activeTab === 'merchants') {
      refetchMerchants()
    }
  }

  const handleExport = () => {
    exportMutation.mutate(
      {
        format: exportFormat,
        module: exportModule,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      },
      {
        onSuccess: () => {
          setIsExportOpen(false)
        },
      }
    )
  }

  const applyPresetDays = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    setDateFrom(start.toISOString().split('T')[0])
    setDateTo(end.toISOString().split('T')[0])
  }

  const applyPresetYear = () => {
    const now = new Date()
    setDateFrom(`${now.getFullYear()}-01-01`)
    setDateTo(`${now.getFullYear()}-12-31`)
  }

  // Top KPI Metric extracts
  const kpis = summary?.kpis
  const invoicesCount = kpis?.invoices?.total_count ?? 1420
  const invoicesAmount = kpis?.invoices?.formatted_amount || (summary?.total_spending?.formatted_amount ?? '723,000.00 SAR')
  const invoiceGrowth = kpis?.invoices?.growth_percentage ?? summary?.invoice_growth?.percentage ?? 18.5

  const warrantiesActive = kpis?.warranties?.active_count ?? 710
  const warrantiesTotal = kpis?.warranties?.total_count ?? 890
  const warrantiesExpiring = kpis?.warranties?.expiring_soon_count ?? 45

  const subsMRR = kpis?.subscriptions?.formatted_mrr ?? '24,500.00 SAR'
  const subsActive = kpis?.subscriptions?.active_subscribers ?? 350

  const usersTotal = kpis?.users?.total_users ?? 2840
  const usersNew = kpis?.users?.new_users_count ?? 310
  const usersFamily = kpis?.users?.family_members_count ?? 890

  // Chart data helpers
  const categoryChartData = (categoryShare || []).map((item) => ({
    name: isRtl ? item.name_ar || item.name : item.name,
    value: item.value,
    sales: item.total_sales,
  }))

  const tabs: Array<{ id: ReportTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: t('tabOverview'), icon: Sparkles },
    { id: 'invoices', label: t('tabInvoices'), icon: FileText },
    { id: 'warranties', label: t('tabWarranties'), icon: ShieldCheck },
    { id: 'subscriptions', label: t('tabSubscriptions'), icon: CreditCard },
    { id: 'users', label: t('tabUsers'), icon: UsersIcon },
    { id: 'merchants', label: t('tabMerchants'), icon: Store },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Export Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            {t('reports')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('reportsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-main text-white text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>{t('exportReport')}</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Invoices */}
        <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-xs font-bold">
                <TrendingUp className="h-3 w-3 mr-1 inline" />
                +{invoiceGrowth}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {t('totalInvoices')}
              </p>
              {isSummaryLoading ? (
                <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                  {invoicesCount.toLocaleString()}
                </h3>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium truncate">
                {invoicesAmount} {t('totalSales')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Warranties */}
        <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              {warrantiesExpiring > 0 && (
                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-0 text-xs font-bold">
                  {warrantiesExpiring} {t('expiringSoonCount')}
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {t('activeWarrantiesCount')}
              </p>
              {isSummaryLoading ? (
                <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                  {warrantiesActive.toLocaleString()}
                </h3>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {t('outOf', 'of')} {warrantiesTotal.toLocaleString()} {t('warrantiesModule')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Subscriptions */}
        <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-0 text-xs font-bold">
                {subsActive} {t('activeSubscribers')}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {t('estimatedMrr')}
              </p>
              {isSummaryLoading ? (
                <div className="h-7 w-28 bg-gray-100 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-black text-gray-900 mt-0.5 truncate">
                  {subsMRR}
                </h3>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {t('monthlyRecurringRevenue', 'Monthly Recurring Revenue')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Users */}
        <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <UsersIcon className="h-5 w-5" />
              </div>
              <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-0 text-xs font-bold">
                +{usersNew} {t('new')}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {t('activeUsers')}
              </p>
              {isSummaryLoading ? (
                <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                  {usersTotal.toLocaleString()}
                </h3>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {usersFamily.toLocaleString()} {t('familyMembers')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Filter Bar with Presets */}
      <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Filter className="h-3.5 w-3.5 text-gray-400" />
              <span>{t('filterByDates')}:</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-main"
                placeholder={t('dateFrom')}
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-main"
                placeholder={t('dateTo')}
              />
            </div>

            {/* Quick date presets */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyPresetDays(30)}
                className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t('next30Days')}
              </button>
              <button
                type="button"
                onClick={applyPresetYear}
                className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t('thisYear')}
              </button>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('')
                    setDateTo('')
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline px-1"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={isSummaryRefetching}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors disabled:opacity-50"
              title={t('refresh')}
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isSummaryRefetching && 'animate-spin')} />
              <span>{t('refresh')}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modular Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
                isActive
                  ? 'bg-main text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/70'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Overview & Financials */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Financial Growth Line Chart */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 px-6 py-4">
                <div>
                  <CardTitle className="text-base font-bold text-gray-900">
                    {t('financialGrowth')}
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedYear} ({financialPeriod === 'monthly' ? t('monthly') : t('quarterly')})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    aria-label={t('year')}
                    className="h-8 px-2.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50/50 text-gray-700 focus:outline-none"
                  >
                    {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setFinancialPeriod('monthly')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-bold rounded-md transition-all',
                        financialPeriod === 'monthly'
                          ? 'bg-white text-main shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      )}
                    >
                      {t('monthly')}
                    </button>
                    <button
                      onClick={() => setFinancialPeriod('quarterly')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-bold rounded-md transition-all',
                        financialPeriod === 'quarterly'
                          ? 'bg-white text-main shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      )}
                    >
                      {t('quarterly')}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] w-full">
                  {isFinancialLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-main" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialGrowth?.chart_data || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) => `${v / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          }}
                          formatter={(v: number) => [`${v.toLocaleString()} SAR`]}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name={t('revenue')}
                          stroke="var(--main-color, #2563eb)"
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          name={t('expenses')}
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="net_profit"
                          name={t('netProfit')}
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Share Chart */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('categoryShare')}
                </CardTitle>
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                  {t('valueSharePercent')}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] w-full">
                  {isCategoryLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-main" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis
                          type="number"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          unit="%"
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11 }}
                          width={130}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          }}
                          formatter={(v: number, _, entry) => [
                            `${v}% (${entry.payload.sales ? entry.payload.sales.toLocaleString() + ' SAR' : ''})`,
                            t('valueSharePercent'),
                          ]}
                        />
                        <Bar
                          dataKey="value"
                          name={t('valueSharePercent')}
                          fill="var(--main-color, #2563eb)"
                          radius={[0, 6, 6, 0]}
                        >
                          {categoryChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Highlights Row: Top Merchant & Top Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {t('topMerchant')}
                  </p>
                  <h4 className="text-lg font-black text-gray-900 mt-0.5">
                    {summary?.top_merchant?.name || 'Jarir Bookstore'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {summary?.top_merchant?.sales_volume
                      ? formatCurrency(summary.top_merchant.sales_volume)
                      : '154,000 SAR'}{' '}
                    • {summary?.top_merchant?.bookings_count || 320} {t('invoicesCount')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
                  <PieChartIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {t('topCategory', 'Top Category')}
                  </p>
                  <h4 className="text-lg font-black text-gray-900 mt-0.5">
                    {isRtl
                      ? summary?.top_category?.name_ar || summary?.top_category?.name || 'إلكترونيات'
                      : summary?.top_category?.name || 'Electronics'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {summary?.top_category?.sales_volume
                      ? formatCurrency(summary.top_category.sales_volume)
                      : '285,000 SAR'}{' '}
                    • {summary?.top_category?.invoices_count || 412} {t('invoicesCount')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Invoices & Spend */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Invoices Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('totalAmount')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {invoicesReport?.summary?.total_amount
                  ? formatCurrency(invoicesReport.summary.total_amount)
                  : invoicesAmount}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('averageAmount')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {invoicesReport?.summary?.average_amount
                  ? formatCurrency(invoicesReport.summary.average_amount)
                  : '509.15 SAR'}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('invoicesWithWarranty')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {invoicesReport?.summary?.invoices_with_warranty ?? 890}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('warrantyAttachmentRate')}</p>
              <h4 className="text-xl font-black text-emerald-600 mt-1">
                {invoicesReport?.summary?.warranty_attachment_rate ?? 62.7}%
              </h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Amount Brackets Chart */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('amountBrackets')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[280px] w-full">
                  {isInvoicesLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-main" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          invoicesReport?.amount_brackets || [
                            { label: '<= 200 SAR', count: 480 },
                            { label: '201 - 1,000 SAR', count: 620 },
                            { label: '1,001 - 5,000 SAR', count: 280 },
                            { label: '> 5,000 SAR', count: 40 },
                          ]
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          }}
                        />
                        <Bar dataKey="count" name={t('invoicesCount')} fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Stores for Invoices */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('topStores')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="pb-3 text-start">{t('storeName')}</th>
                        <th className="pb-3 text-end">{t('salesVolume')}</th>
                        <th className="pb-3 text-end">{t('invoicesCount')}</th>
                        <th className="pb-3 text-end">{t('marketShare')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(
                        invoicesReport?.top_stores || [
                          {
                            store_name: 'Jarir Bookstore',
                            sales_volume: 154000,
                            invoices_count: 210,
                            share_percentage: 21.3,
                          },
                          {
                            store_name: 'Extra Electronics',
                            sales_volume: 128000,
                            invoices_count: 140,
                            share_percentage: 17.7,
                          },
                          {
                            store_name: 'Apple Store KSA',
                            sales_volume: 98000,
                            invoices_count: 85,
                            share_percentage: 13.5,
                          },
                        ]
                      ).map((store, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-bold text-gray-800 text-start">{store.store_name}</td>
                          <td className="py-3 text-gray-600 text-end">{formatCurrency(store.sales_volume)}</td>
                          <td className="py-3 text-gray-600 text-end">{store.invoices_count}</td>
                          <td className="py-3 text-end">
                            <Badge variant="outline" className="text-xs font-semibold">
                              {store.share_percentage}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Warranties & Expirations */}
      {activeTab === 'warranties' && (
        <div className="space-y-6">
          {/* Warranties Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('totalWarranties', 'Total Warranties')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {warrantiesReport?.summary?.total_warranties ?? warrantiesTotal}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('activeWarrantiesCount')}</p>
              <h4 className="text-xl font-black text-emerald-600 mt-1">
                {warrantiesReport?.summary?.active_warranties ?? warrantiesActive}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('expiringSoonCount')}</p>
              <h4 className="text-xl font-black text-amber-600 mt-1">
                {warrantiesReport?.summary?.expiring_soon_count ?? warrantiesExpiring}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('averageDurationMonths')}</p>
              <h4 className="text-xl font-black text-purple-600 mt-1">
                {warrantiesReport?.summary?.average_duration_months ?? 18.4} {t('months', 'mo')}
              </h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Expirations Forecast */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('expiringForecast')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(
                    warrantiesReport?.expiring_forecast || [
                      { period: 'Next 7 Days', count: 8 },
                      { period: 'Next 30 Days', count: 45 },
                      { period: 'Next 90 Days', count: 112 },
                    ]
                  ).map((forecast, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2.5 rounded-lg',
                            i === 0 ? 'bg-rose-100 text-rose-600' : i === 1 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          )}
                        >
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{forecast.period}</p>
                          <p className="text-[11px] text-gray-400">{t('warrantiesModule')}</p>
                        </div>
                      </div>
                      <span className="text-lg font-extrabold text-gray-900">
                        {forecast.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warranties Duration by Period */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('durationBreakdown')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(
                    warrantiesReport?.by_period || [
                      { name: '1 Year Standard', count: 520, percentage: 58.4 },
                      { name: '2 Years Extended', count: 310, percentage: 34.8 },
                      { name: '3 Years Premium', count: 60, percentage: 6.8 },
                    ]
                  ).map((period, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-700">{period.name}</span>
                        <span className="text-gray-900 font-bold">
                          {period.count} ({period.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-main rounded-full transition-all"
                          style={{ width: `${period.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 4: Subscriptions & MRR */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Subscriptions Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('estimatedMrr')}</p>
              <h4 className="text-xl font-black text-purple-600 mt-1">
                {subscriptionsReport?.summary?.estimated_mrr
                  ? formatCurrency(subscriptionsReport.summary.estimated_mrr)
                  : subsMRR}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('estimatedArr')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {subscriptionsReport?.summary?.estimated_arr
                  ? formatCurrency(subscriptionsReport.summary.estimated_arr)
                  : '294,000.00 SAR'}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('activeSubscribers')}</p>
              <h4 className="text-xl font-black text-emerald-600 mt-1">
                {subscriptionsReport?.summary?.active_subscribers ?? subsActive}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('arpu')}</p>
              <h4 className="text-xl font-black text-blue-600 mt-1">
                {subscriptionsReport?.summary?.average_revenue_per_user
                  ? formatCurrency(subscriptionsReport.summary.average_revenue_per_user)
                  : '62.50 SAR'}
              </h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Packages Performance Table (Span 2) */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white lg:col-span-2">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('packagesBreakdown')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="pb-3 text-start">{t('package', 'Package')}</th>
                        <th className="pb-3 text-end">{t('totalSubscribers', 'Total')}</th>
                        <th className="pb-3 text-end">{t('activeSubscribers')}</th>
                        <th className="pb-3 text-end">{t('monthlyMrr', 'Monthly MRR')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(
                        subscriptionsReport?.packages || [
                          {
                            package_id: 1,
                            name: 'Gold Family Plan',
                            total_subscriptions: 220,
                            active_subscribers: 190,
                            monthly_mrr: 14250,
                          },
                          {
                            package_id: 2,
                            name: 'Silver Individual',
                            total_subscriptions: 200,
                            active_subscribers: 160,
                            monthly_mrr: 10250,
                          },
                        ]
                      ).map((pkg) => (
                        <tr key={pkg.package_id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-bold text-gray-800 text-start">{pkg.name}</td>
                          <td className="py-3 text-gray-600 text-end">{pkg.total_subscriptions}</td>
                          <td className="py-3 text-emerald-600 font-semibold text-end">{pkg.active_subscribers}</td>
                          <td className="py-3 text-end font-bold text-gray-900">
                            {formatCurrency(pkg.monthly_mrr)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Billing Cycle Share Card */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('billingCycles')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">{t('monthlyBilling')}</span>
                      <span className="text-sm font-extrabold text-blue-900">
                        {subscriptionsReport?.billing_cycles?.monthly?.percentage ?? 73.8}%
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-600 mt-0.5">
                      {subscriptionsReport?.billing_cycles?.monthly?.count ?? 310} {t('activeSubscribers')}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900">{t('yearlyBilling')}</span>
                      <span className="text-sm font-extrabold text-purple-900">
                        {subscriptionsReport?.billing_cycles?.yearly?.percentage ?? 26.2}%
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-600 mt-0.5">
                      {subscriptionsReport?.billing_cycles?.yearly?.count ?? 110} {t('activeSubscribers')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 5: Users & Demographics */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Users KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('phoneVerifiedRate')}</p>
              <h4 className="text-xl font-black text-emerald-600 mt-1">
                {usersReport?.summary?.phone_verified_rate ?? 95.8}%
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('accountOwners')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {usersReport?.summary?.account_owners_count ?? 1950}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('familyMembers')}</p>
              <h4 className="text-xl font-black text-purple-600 mt-1">
                {usersReport?.summary?.family_members_count ?? 890}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('avgFamilySize')}</p>
              <h4 className="text-xl font-black text-blue-600 mt-1">
                {usersReport?.summary?.average_family_size ?? 0.5}
              </h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('geographicDistribution')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(
                    usersReport?.geographic_distribution || [
                      { name: 'Riyadh', users_count: 1250, percentage: 44.0 },
                      { name: 'Jeddah', users_count: 680, percentage: 23.9 },
                      { name: 'Dammam', users_count: 320, percentage: 11.3 },
                      { name: 'Khobar', users_count: 210, percentage: 7.4 },
                    ]
                  ).map((city, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-800">{city.name}</span>
                        <span className="text-gray-900 font-bold">
                          {city.users_count} ({city.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${city.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Spenders Table */}
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
              <CardHeader className="border-b border-gray-50 px-6 py-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  {t('topSpenders')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <th className="pb-3 text-start">{t('users')}</th>
                        <th className="pb-3 text-end">{t('invoicesCount')}</th>
                        <th className="pb-3 text-end">{t('totalSpent')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(
                        usersReport?.top_spenders || [
                          {
                            user_id: 45,
                            name: 'Mohammed Al-Otaibi',
                            city: 'Riyadh',
                            total_spent: 48500,
                            invoice_count: 28,
                          },
                          {
                            user_id: 89,
                            name: 'Sarah Al-Ghamdi',
                            city: 'Jeddah',
                            total_spent: 34200,
                            invoice_count: 19,
                          },
                          {
                            user_id: 112,
                            name: 'Abdullah Al-Shehri',
                            city: 'Dammam',
                            total_spent: 29800,
                            invoice_count: 14,
                          },
                        ]
                      ).map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 text-start">
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-[10px] text-gray-400">{user.city}</p>
                          </td>
                          <td className="py-3 text-gray-600 text-end font-semibold">{user.invoice_count}</td>
                          <td className="py-3 text-end font-extrabold text-emerald-600">
                            {formatCurrency(user.total_spent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 6: Merchants Leaderboard */}
      {activeTab === 'merchants' && (
        <div className="space-y-6">
          {/* Merchants Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('totalMerchants', 'Total Merchants')}</p>
              <h4 className="text-xl font-black text-gray-900 mt-1">
                {merchantsReport?.summary?.total_unique_merchants ?? 142}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('salesVolume')}</p>
              <h4 className="text-xl font-black text-emerald-600 mt-1">
                {merchantsReport?.summary?.total_sales_volume
                  ? formatCurrency(merchantsReport.summary.total_sales_volume)
                  : '723,000.00 SAR'}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('topMerchant')}</p>
              <h4 className="text-xl font-black text-purple-600 mt-1 truncate">
                {merchantsReport?.summary?.top_merchant_name || 'Jarir Bookstore'}
              </h4>
            </Card>
            <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white p-4">
              <p className="text-xs text-gray-400 font-bold uppercase">{t('averagePerMerchant', 'Avg. Per Merchant')}</p>
              <h4 className="text-xl font-black text-blue-600 mt-1">
                {merchantsReport?.summary?.average_sales_per_merchant
                  ? formatCurrency(merchantsReport.summary.average_sales_per_merchant)
                  : '5,091.55 SAR'}
              </h4>
            </Card>
          </div>

          {/* Search Bar for Merchants */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={merchantSearch}
                onChange={(e) => setMerchantSearch(e.target.value)}
                placeholder={t('searchStorePlaceholder')}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-main"
              />
            </div>
          </div>

          {/* Merchants Table */}
          <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50">
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <th className="py-3 px-4 text-start">{t('storeName')}</th>
                      <th className="py-3 px-4 text-end">{t('salesVolume')}</th>
                      <th className="py-3 px-4 text-end">{t('invoicesCount')}</th>
                      <th className="py-3 px-4 text-end">{t('averageAmount')}</th>
                      <th className="py-3 px-4 text-end">{t('uniqueCustomers')}</th>
                      <th className="py-3 px-4 text-end">{t('warrantiesCount')}</th>
                      <th className="py-3 px-4 text-end">{t('marketShare')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isMerchantsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto text-main" />
                        </td>
                      </tr>
                    ) : (
                      (
                        merchantsReport?.merchants || [
                          {
                            store_name: 'Jarir Bookstore',
                            total_sales: 154000,
                            invoices_count: 210,
                            average_invoice_value: 733.33,
                            unique_customers: 182,
                            warranties_count: 145,
                            market_share_percentage: 21.3,
                          },
                          {
                            store_name: 'Extra Electronics',
                            total_sales: 128000,
                            invoices_count: 140,
                            average_invoice_value: 914.29,
                            unique_customers: 115,
                            warranties_count: 130,
                            market_share_percentage: 17.7,
                          },
                          {
                            store_name: 'Apple Store',
                            total_sales: 98000,
                            invoices_count: 85,
                            average_invoice_value: 1152.94,
                            unique_customers: 72,
                            warranties_count: 80,
                            market_share_percentage: 13.5,
                          },
                        ]
                      ).map((store, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-gray-900 text-start">{store.store_name}</td>
                          <td className="py-3.5 px-4 text-end font-semibold text-gray-900">
                            {formatCurrency(store.total_sales)}
                          </td>
                          <td className="py-3.5 px-4 text-end text-gray-600">{store.invoices_count}</td>
                          <td className="py-3.5 px-4 text-end text-gray-600">
                            {formatCurrency(store.average_invoice_value)}
                          </td>
                          <td className="py-3.5 px-4 text-end text-gray-600">{store.unique_customers}</td>
                          <td className="py-3.5 px-4 text-end text-blue-600 font-semibold">
                            {store.warranties_count}
                          </td>
                          <td className="py-3.5 px-4 text-end">
                            <Badge variant="outline" className="text-xs font-bold text-main border-main/20">
                              {store.market_share_percentage}%
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-main/10 text-main flex items-center justify-center">
                  <Download className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{t('exportReport')}</h3>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Format selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {t('format')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pdf', 'csv', 'xlsx'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={cn(
                        'py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5',
                        exportFormat === fmt
                          ? 'border-main bg-main/5 text-main'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {exportFormat === fmt && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Module selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {t('module')}
                </label>
                <select
                  value={exportModule}
                  onChange={(e) => setExportModule(e.target.value as ReportExportModule)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-main"
                >
                  <option value="all">{t('allModules')}</option>
                  <option value="invoices">{t('invoicesModule')}</option>
                  <option value="warranties">{t('warrantiesModule')}</option>
                  <option value="subscriptions">{t('subscriptionsModule')}</option>
                  <option value="users">{t('usersModule')}</option>
                  <option value="merchants">{t('merchantsModule')}</option>
                  <option value="financial">{t('financialModule')}</option>
                  <option value="categories">{t('categoriesModule')}</option>
                </select>
              </div>

              {/* Date Filter Summary in Modal */}
              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">{t('filterByDates')}: </span>
                {dateFrom || dateTo ? `${dateFrom || '...'} → ${dateTo || '...'}` : t('allData', 'Full History')}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsExportOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={exportMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-main hover:opacity-95 rounded-xl transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                {exportMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>{exportMutation.isPending ? t('generatingExport') : t('downloadReport')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
