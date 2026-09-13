import React, { useState } from 'react'
import {
  FileText,
  ShieldCheck,
  Coins,
  Users,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  FolderTree,
  FileSpreadsheet,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react'
import { WeeklyPillChart } from '@/features/dashboard/components/WeeklyPillChart'
import { ExpiringWarrantiesCard } from '@/features/dashboard/components/ExpiringWarrantiesCard'
import { ProjectProgressGauge } from '@/features/dashboard/components/ProjectProgressGauge'
import {
  useDashboardStats,
  useDashboardAnalytics,
  useDashboardProgressGauge,
  useExportDashboardSummary,
  type DashboardPeriod,
  type DashboardAnalyticsPeriod,
} from '../api/useDashboard'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/card'
import { translateMetricText } from '@/shared/utils/translateMetric'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [statsPeriod, setStatsPeriod] = useState<DashboardPeriod>('this_month')
  const [analyticsPeriod, setAnalyticsPeriod] = useState<DashboardAnalyticsPeriod>('weekly')

  const { data: stats, isLoading: isStatsLoading } = useDashboardStats(statsPeriod)
  const { data: analytics, isLoading: isAnalyticsLoading } = useDashboardAnalytics(analyticsPeriod)
  const { data: progressGauge, isLoading: isGaugeLoading } = useDashboardProgressGauge()
  const exportMutation = useExportDashboardSummary()

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t('dashboardSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Tabs for Top Stats */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(['this_month', 'last_month', 'this_year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setStatsPeriod(period)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  statsPeriod === period
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {t(period === 'this_month' ? 'thisMonth' : period === 'last_month' ? 'lastMonth' : 'thisYear')}
              </button>
            ))}
          </div>

          {/* Export Summary Action Button */}
          <button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-main text-white font-semibold text-xs rounded-xl hover:bg-main/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {exportMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{exportMutation.isPending ? t('exporting') : t('exportSummary')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoices */}
        <div className="bg-main text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold opacity-90">{t('totalInvoices')}</span>
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-white/20 rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {stats?.total_invoices?.total?.toLocaleString() ?? 0}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5">
              {stats?.total_invoices?.change_percentage !== undefined && (
                <span className="flex h-5 items-center justify-center gap-0.5 rounded-md bg-white/20 px-2 text-[10px] font-bold text-white">
                  {stats.total_invoices.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.total_invoices.change_percentage > 0 ? `+` : ''}
                  {stats.total_invoices.change_percentage}%
                </span>
              )}
              <span className="text-[10px] opacity-80 font-medium truncate">
                {translateMetricText(stats?.total_invoices?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              </span>
            </div>
          </div>
        </div>

        {/* Active Warranties */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-500">{t('activeWarranties')}</span>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                {stats?.active_warranties?.total?.toLocaleString() ?? 0}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="flex h-5 items-center justify-center rounded-md bg-emerald-50 px-2 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                {translateMetricText(stats?.active_warranties?.status, t, isRtl, 'active')}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold truncate">
                {translateMetricText(stats?.active_warranties?.subtitle, t, isRtl) ||
                  (stats?.active_warranties?.expiring_soon_count !== undefined
                    ? `${stats.active_warranties.expiring_soon_count} ${t('expiringWithin30Days')}`
                    : '')}
              </span>
            </div>
          </div>
        </div>

        {/* Total Spending */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-500">{t('totalSpending')}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <Coins className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-32 bg-gray-100 rounded animate-pulse" />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {stats?.total_spending?.formatted
                  ? `${stats.total_spending.formatted} SAR`
                  : `${(stats?.total_spending?.total ?? 0).toLocaleString()} SAR`}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5">
              {stats?.total_spending?.change_percentage !== undefined && (
                <span className="flex h-5 items-center justify-center gap-0.5 rounded-md bg-green-50 px-2 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                  {stats.total_spending.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.total_spending.change_percentage > 0 ? `+` : ''}
                  {stats.total_spending.change_percentage}%
                </span>
              )}
              <span className="text-[10px] text-gray-400 font-semibold truncate">
                {translateMetricText(stats?.total_spending?.subtitle, t, isRtl, 'increaseInSpendingFromLastMonth')}
              </span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-500">{t('activeUsers')}</span>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                {stats?.active_users?.total?.toLocaleString() ?? 0}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5">
              {stats?.active_users?.change_percentage !== undefined && (
                <span className="flex h-5 items-center justify-center gap-0.5 rounded-md bg-blue-50 px-2 text-[10px] font-bold text-blue-700 border border-blue-100">
                  {stats.active_users.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.active_users.change_percentage > 0 ? `+` : ''}
                  {stats.active_users.change_percentage}%
                </span>
              )}
              <span className="text-[10px] text-gray-400 font-semibold truncate">
                {translateMetricText(stats?.active_users?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Activity Analytics + Quick Shortcuts */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Day-by-Day Activity Pill Chart with live backend data */}
          <WeeklyPillChart
            period={analyticsPeriod}
            onPeriodChange={(p) => setAnalyticsPeriod(p)}
            data={analytics?.items}
            isLoading={isAnalyticsLoading}
          />

          {/* Quick Domain Management Shortcuts */}
          <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
            <div className="p-6 pb-3 border-b border-gray-50">
              <h3 className="font-bold text-[#111827] text-base">
                {t('menu')}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('dashboardSubtitle')}
              </p>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link
                  to="/users"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-main/5 hover:border-main/20 hover:text-main transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-main text-center">
                    {t('users')}
                  </span>
                </Link>

                <Link
                  to="/warranty-periods"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-main/5 hover:border-main/20 hover:text-main transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-main text-center">
                    {t('warrantyPeriods')}
                  </span>
                </Link>

                <Link
                  to="/categories"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-main/5 hover:border-main/20 hover:text-main transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-main text-center">
                    {t('categories')}
                  </span>
                </Link>

                <Link
                  to="/reports"
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-main/5 hover:border-main/20 hover:text-main transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-main text-center">
                    {t('reports')}
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Expiring Warranties + Progress Gauge */}
        <div className="space-y-6">
          {/* Urgent Expiring Warranties Card (real backend data) */}
          <ExpiringWarrantiesCard />

          {/* Categorization & Tracking Progress Gauge (real backend data) */}
          <ProjectProgressGauge
            percentage={progressGauge?.percentage ?? 82}
            label={progressGauge?.status_label}
            breakdown={progressGauge?.breakdown}
            isLoading={isGaugeLoading}
          />
        </div>
      </div>
    </div>
  )
}
