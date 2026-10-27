import { useState } from 'react'
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
  ShieldAlert,
  UserPlus,
  Smartphone,
  Wallet,
  Info,
} from 'lucide-react'
import { WeeklyPillChart } from '@/features/dashboard/components/WeeklyPillChart'
import { ExpiringWarrantiesCard } from '@/features/dashboard/components/ExpiringWarrantiesCard'
import { SubscriberFollowUpCard } from '@/features/dashboard/components/SubscriberFollowUpCard'
import { ProjectProgressGauge } from '@/features/dashboard/components/ProjectProgressGauge'
import {
  useDashboardStats,
  useDashboardAnalytics,
  useDashboardProgressGauge,
  useExportDashboardSummary,
  useDashboardMenuCounts,
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
  const menuCounts = useDashboardMenuCounts(stats)
  const isMenuCountsLoading = menuCounts.isLoading || (isStatsLoading && !stats)
  const exportMutation = useExportDashboardSummary()

  const currencyLabel = isRtl ? 'ر.س' : 'SAR'
  const activeUsersSubtitle =
    stats?.active_users?.active_in_period !== undefined
      ? t('activeUsersInPeriod', { count: stats.active_users.active_in_period })
      : t('activeUsersDefinition')

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Tabs for Top Stats */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            {(['this_month', 'last_month', 'this_year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setStatsPeriod(period)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  statsPeriod === period
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
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
        <div className="bg-main text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[9.5rem]">
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
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              {stats?.total_invoices?.change_percentage !== undefined && (
                <span className="flex-shrink-0 flex h-5 items-center justify-center gap-0.5 rounded-md bg-white/20 px-2 text-[10px] font-bold text-white">
                  {stats.total_invoices.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.total_invoices.change_percentage > 0 ? `+` : ''}
                  {stats.total_invoices.change_percentage}%
                </span>
              )}
              <span
                className="text-[10px] opacity-80 font-medium truncate"
                title={translateMetricText(stats?.total_invoices?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              >
                {translateMetricText(stats?.total_invoices?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              </span>
            </div>
          </div>
        </div>

        {/* Active Warranties */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">{t('activeWarranties')}</span>
            <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {stats?.active_warranties?.total?.toLocaleString() ?? 0}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              <span className="flex-shrink-0 flex h-5 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-500/15 px-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/30">
                {translateMetricText(stats?.active_warranties?.status, t, isRtl, 'active')}
              </span>
              <span
                className="text-[10px] text-muted-foreground font-semibold truncate"
                title={
                  translateMetricText(stats?.active_warranties?.subtitle, t, isRtl) ||
                  (stats?.active_warranties?.expiring_soon_count !== undefined
                    ? `${stats.active_warranties.expiring_soon_count} ${t('expiringWithin30Days')}`
                    : '')
                }
              >
                {translateMetricText(stats?.active_warranties?.subtitle, t, isRtl) ||
                  (stats?.active_warranties?.expiring_soon_count !== undefined
                    ? `${stats.active_warranties.expiring_soon_count} ${t('expiringWithin30Days')}`
                    : '')}
              </span>
            </div>
          </div>
        </div>

        {/* Total Spending */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">{t('totalSpending')}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center">
              <Coins className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-32 bg-muted rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h2 className="text-2xl xl:text-3xl font-extrabold text-foreground tracking-tight">
                  {stats?.total_spending?.formatted
                    ? stats.total_spending.formatted
                    : (stats?.total_spending?.total ?? 0).toLocaleString()}
                </h2>
                <span className="text-xs font-bold text-muted-foreground">
                  {isRtl ? 'ر.س' : 'SAR'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              {stats?.total_spending?.change_percentage !== undefined && (
                <span className="flex-shrink-0 flex h-5 items-center justify-center gap-0.5 rounded-md bg-green-50 dark:bg-green-500/15 px-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/30">
                  {stats.total_spending.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.total_spending.change_percentage > 0 ? `+` : ''}
                  {stats.total_spending.change_percentage}%
                </span>
              )}
              <span
                className="text-[10px] text-muted-foreground font-semibold truncate"
                title={translateMetricText(stats?.total_spending?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              >
                {translateMetricText(stats?.total_spending?.subtitle, t, isRtl, 'increaseFromLastMonth')}
              </span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span
              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground min-w-0"
              title={t('activeUsersDefinition')}
            >
              <span className="truncate">{t('activeUsers')}</span>
              <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label={t('activeUsersDefinition')} />
            </span>
            <div className="h-8 w-8 shrink-0 rounded-full bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {stats?.active_users?.total?.toLocaleString() ?? 0}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              {stats?.active_users?.change_percentage !== undefined && (
                <span className="flex-shrink-0 flex h-5 items-center justify-center gap-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 px-2 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/30">
                  {stats.active_users.change_direction === 'decrease' ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stats.active_users.change_percentage > 0 ? `+` : ''}
                  {stats.active_users.change_percentage}%
                </span>
              )}
              <span
                className="text-[10px] text-muted-foreground font-semibold truncate"
                title={activeUsersSubtitle}
              >
                {activeUsersSubtitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary KPI Cards: users growth, downloads, subscription revenue */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">{t('totalUsers')}</span>
            <div className="h-8 w-8 shrink-0 rounded-full bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-violet-600 dark:text-violet-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {(stats?.total_users?.total ?? 0).toLocaleString()}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              {stats?.total_users?.change_percentage !== undefined && (
                <ChangeBadge
                  direction={stats.total_users.change_direction}
                  percentage={stats.total_users.change_percentage}
                  className="bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/30"
                />
              )}
              <span
                className="text-[10px] text-muted-foreground font-semibold truncate"
                title={t('newUsersInPeriod', { count: stats?.total_users?.new_in_period ?? 0 })}
              >
                {t('newUsersInPeriod', { count: stats?.total_users?.new_in_period ?? 0 })}
              </span>
            </div>
          </div>
        </div>

        {/* App Downloads (entered manually from settings) */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span
              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground min-w-0"
              title={t('downloadsManualHint')}
            >
              <span className="truncate">{t('appDownloads')}</span>
              <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label={t('downloadsManualHint')} />
            </span>
            <div className="h-8 w-8 shrink-0 rounded-full bg-sky-50 dark:bg-sky-500/15 flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {(stats?.downloads?.total ?? 0).toLocaleString()}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              <span className="flex-shrink-0 flex h-5 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-500/15 px-2 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-500/30">
                {t('iosLabel')}: {(stats?.downloads?.ios ?? 0).toLocaleString()}
              </span>
              <span className="flex-shrink-0 flex h-5 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-500/15 px-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/30">
                {t('androidLabel')}: {(stats?.downloads?.android ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold truncate" title={t('downloadsManualHint')}>
                {t('enteredManuallyFromSettings')}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[9.5rem]">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-muted-foreground">{t('subscriptionRevenue')}</span>
            <div className="h-8 w-8 shrink-0 rounded-full bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
          <div>
            {isStatsLoading ? (
              <div className="h-9 w-32 bg-muted rounded animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h2 className="text-2xl xl:text-3xl font-extrabold text-foreground tracking-tight">
                  {stats?.subscription_revenue?.formatted
                    ? stats.subscription_revenue.formatted
                    : (stats?.subscription_revenue?.total ?? 0).toLocaleString()}
                </h2>
                <span className="text-xs font-bold text-muted-foreground">{currencyLabel}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 min-w-0">
              {stats?.subscription_revenue?.change_percentage !== undefined && (
                <ChangeBadge
                  direction={stats.subscription_revenue.change_direction}
                  percentage={stats.subscription_revenue.change_percentage}
                  className="bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-500/30"
                />
              )}
              <span
                className="text-[10px] text-muted-foreground font-semibold truncate"
                title={t('paidTransactionsInPeriod', {
                  count: stats?.subscription_revenue?.paid_transactions_count ?? 0,
                })}
              >
                {t('paidTransactionsInPeriod', {
                  count: stats?.subscription_revenue?.paid_transactions_count ?? 0,
                })}
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

          {/* Quick Domain Management Shortcuts with Live Counts */}
          <Card className="border border-border rounded-2xl shadow-xs bg-card">
            <div className="p-6 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-base">
                  {t('menu')}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('dashboardMenuSubtitle')}
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Users */}
                <Link
                  to="/users"
                  className="relative flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100/60 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    {isMenuCountsLoading ? (
                      <div className="h-7 w-14 bg-muted rounded animate-pulse mb-1" />
                    ) : (
                      <div className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-blue-600 transition-colors">
                        {menuCounts.users.toLocaleString()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {t('users')}
                    </span>
                  </div>
                </Link>

                {/* Warranty Periods */}
                <Link
                  to="/warranty-periods"
                  className="relative flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 border border-amber-100/60 text-amber-600 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 dark:text-amber-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    {isMenuCountsLoading ? (
                      <div className="h-7 w-14 bg-muted rounded animate-pulse mb-1" />
                    ) : (
                      <div className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-amber-600 transition-colors">
                        {menuCounts.warrantyPeriods.toLocaleString()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {t('warrantyPeriods')}
                    </span>
                  </div>
                </Link>

                {/* Categories */}
                <Link
                  to="/categories"
                  className="relative flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-100/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <FolderTree className="h-5 w-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    {isMenuCountsLoading ? (
                      <div className="h-7 w-14 bg-muted rounded animate-pulse mb-1" />
                    ) : (
                      <div className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-emerald-600 transition-colors">
                        {menuCounts.categories.toLocaleString()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {t('categories')}
                    </span>
                  </div>
                </Link>

                {/* Reports */}
                <Link
                  to="/reports"
                  className="relative flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 border border-purple-100/60 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 dark:text-purple-300">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    {isMenuCountsLoading ? (
                      <div className="h-7 w-14 bg-muted rounded animate-pulse mb-1" />
                    ) : (
                      <div className="text-2xl font-extrabold text-foreground tracking-tight group-hover:text-purple-600 transition-colors">
                        {menuCounts.reports.toLocaleString()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {t('reports')}
                    </span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Expiring Warranties + Progress Gauge */}
        <div className="space-y-6">
          {/* Subscriber follow-up: expiring soon / active / expired-not-renewed */}
          <SubscriberFollowUpCard />

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

function ChangeBadge({
  direction,
  percentage,
  className,
}: {
  direction: 'increase' | 'decrease'
  percentage: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex-shrink-0 flex h-5 items-center justify-center gap-0.5 rounded-md px-2 text-[10px] font-bold border',
        className
      )}
      dir="ltr"
    >
      {direction === 'decrease' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
      {percentage > 0 ? '+' : ''}
      {percentage}%
    </span>
  )
}
