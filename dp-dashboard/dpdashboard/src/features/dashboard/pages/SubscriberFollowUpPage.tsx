import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ColDef } from 'ag-grid-community'
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Phone,
  RefreshCw,
  UserRound,
  UserX,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import { cn } from '@/shared/utils/utils'
import {
  SUBSCRIBER_FOLLOW_UP_STATUSES,
  useDashboardSubscribers,
  SUBSCRIBER_EXPIRING_PERIODS,
  type SubscriberExpiringPeriod,
  useSubscriberFollowUp,
  type SubscriberFollowUpRow,
  type SubscriberFollowUpStatus,
} from '../api/useDashboard'
import {
  getFollowUpDaysBadge,
  getFollowUpStatusLabel,
  isSubscriberFollowUpStatus,
} from '../utils/subscriberFollowUp'

const PER_PAGE = 15

const STATUS_STYLES: Record<SubscriberFollowUpStatus, { icon: typeof Users; active: string; text: string; iconBox: string }> = {
  expiring_soon: {
    icon: CalendarClock,
    active: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20',
    text: 'text-amber-600 dark:text-amber-400',
    iconBox: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30',
  },
  active: {
    icon: CheckCircle2,
    active: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBox: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30',
  },
  expired: {
    icon: UserX,
    active: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20',
    text: 'text-rose-600 dark:text-rose-400',
    iconBox: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30',
  },
}

export default function SubscriberFollowUpPage() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const statusParam = searchParams.get('status')
  const status: SubscriberFollowUpStatus = isSubscriberFollowUpStatus(statusParam) ? statusParam : 'expiring_soon'
  const periodParam = searchParams.get('period')
  const period: SubscriberExpiringPeriod | '' = SUBSCRIBER_EXPIRING_PERIODS.includes(periodParam as SubscriberExpiringPeriod)
    ? (periodParam as SubscriberExpiringPeriod)
    : ''

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Debounce the search box before hitting the API
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => window.clearTimeout(handle)
  }, [searchInput])

  const { data: overview } = useSubscriberFollowUp()
  const { data: paginated, isLoading, isFetching, refetch } = useDashboardSubscribers({
    status,
    search,
    period,
    page,
    per_page: PER_PAGE,
  })

  const rows = paginated?.data ?? []

  const handlePeriodChange = (next: SubscriberExpiringPeriod | '') => {
    const params = new URLSearchParams(searchParams)
    if (next) params.set('period', next)
    else params.delete('period')
    setSearchParams(params, { replace: true })
    setPage(1)
  }

  const handleStatusChange = (next: SubscriberFollowUpStatus) => {
    const params = new URLSearchParams(searchParams)
    params.set('status', next)
    setSearchParams(params, { replace: true })
    setPage(1)
  }

  const columnDefs = useMemo<ColDef<SubscriberFollowUpRow>[]>(
    () => [
      {
        headerName: t('name'),
        colId: 'user_name',
        valueGetter: (p) => p.data?.user?.name ?? '',
        minWidth: 180,
        flex: 1.2,
        cellRenderer: (p: { data?: SubscriberFollowUpRow }) => {
          const name = p.data?.user?.name
          return (
            <div className="flex items-center gap-2.5 h-full">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main font-bold text-xs border border-main/20">
                {name ? name.trim().charAt(0).toUpperCase() : <UserRound className="h-3.5 w-3.5" />}
              </div>
              <span className="font-bold text-foreground text-xs truncate">{name || '-'}</span>
            </div>
          )
        },
      },
      {
        headerName: t('phone'),
        colId: 'phone',
        valueGetter: (p) => p.data?.user?.phone ?? '',
        minWidth: 150,
        cellRenderer: (p: { data?: SubscriberFollowUpRow }) => {
          const phone = p.data?.user?.phone
          if (!phone) return <span className="text-muted-foreground">-</span>
          return (
            <a
              href={`tel:${phone}`}
              dir="ltr"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-main hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
          )
        },
      },
      {
        headerName: t('email'),
        colId: 'email',
        valueGetter: (p) => p.data?.user?.email || '-',
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: t('package'),
        colId: 'package',
        valueGetter: (p) => p.data?.package?.name || '-',
        minWidth: 140,
      },
      {
        headerName: t('billingPeriod'),
        colId: 'billing_period',
        valueGetter: (p) =>
          p.data?.billing_period_label || (p.data?.billing_period ? t(p.data.billing_period) : '-'),
        minWidth: 130,
      },
      {
        headerName: t('price'),
        colId: 'price',
        valueGetter: (p) =>
          p.data?.price !== null && p.data?.price !== undefined
            ? `${Number(p.data.price).toLocaleString()} ${p.data.currency ?? ''}`.trim()
            : '-',
        minWidth: 120,
      },
      {
        headerName: t('startsAt'),
        field: 'starts_at',
        valueFormatter: (p) => p.value || '-',
        minWidth: 170,
      },
      {
        headerName: t('endsAt'),
        field: 'ends_at',
        valueFormatter: (p) => p.value || '-',
        minWidth: 170,
      },
      {
        headerName: status === 'expired' ? t('daysSinceExpired') : t('daysRemainingColumn'),
        colId: 'days',
        minWidth: 160,
        cellRenderer: (p: { data?: SubscriberFollowUpRow }) => {
          if (!p.data) return null
          const badge = getFollowUpDaysBadge(p.data, t)
          return (
            <div className="flex items-center h-full">
              <Badge variant="outline" className={cn('text-[11px] font-bold px-2 py-0.5 border', badge.className)}>
                {badge.label}
              </Badge>
            </div>
          )
        },
      },
      {
        headerName: t('autoRenewal'),
        field: 'auto_renewal',
        minWidth: 120,
        cellRenderer: (p: { data?: SubscriberFollowUpRow }) => (
          <div className="flex items-center h-full">
            <span
              className={cn(
                'inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-bold border',
                p.data?.auto_renewal
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
              )}
            >
              {p.data?.auto_renewal ? t('yes') : t('no')}
            </span>
          </div>
        ),
      },
    ],
    [t, status]
  )

  const BackArrow = isRtl ? ArrowRight : ArrowLeft

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="h-9 w-9 p-0 rounded-xl border-gray-200 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 shrink-0"
            title={t('backToDashboard')}
          >
            <BackArrow className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t('subscriberFollowUp')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('subscriberFollowUpSubtitle')}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-end sm:self-auto rounded-xl border-gray-200 text-xs font-medium dark:border-gray-800 gap-1.5"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
          {t('refresh')}
        </Button>
      </div>

      {/* Status tabs with counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="tablist">
        {SUBSCRIBER_FOLLOW_UP_STATUSES.map((key) => {
          const style = STATUS_STYLES[key]
          const Icon = style.icon
          const isActive = status === key
          return (
            <Card
              key={key}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => handleStatusChange(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleStatusChange(key)
                }
              }}
              className={cn(
                'cursor-pointer transition-all border rounded-2xl p-4',
                isActive
                  ? cn(style.active, 'shadow-xs')
                  : 'border-gray-100 bg-white hover:border-gray-200 dark:bg-card dark:border-gray-800'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn('text-xs font-medium', style.text)}>
                  {getFollowUpStatusLabel(key, t, overview?.expiring_soon_days)}
                </span>
                <div className={cn('h-7 w-7 shrink-0 rounded-lg flex items-center justify-center', style.iconBox)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={cn('text-2xl font-bold', style.text)}>
                  {(overview?.lists?.[key]?.count ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">{t('subscribers')}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Table */}
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main/10 text-main border border-main/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {getFollowUpStatusLabel(status, t, overview?.expiring_soon_days)}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(paginated?.meta?.total ?? 0).toLocaleString()} {t('recordsCount')}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center" dir={isRtl ? 'rtl' : 'ltr'}>
            {status === 'expiring_soon' && (
              <select
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value as SubscriberExpiringPeriod | '')}
                aria-label={t('followUpExpiringWithin')}
                className="w-full sm:w-48 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
              >
                <option value="">
                  {t('followUpExpiringWithin')}: {t('followUpPeriodDefault', { count: overview?.expiring_soon_days ?? 7 })}
                </option>
                {SUBSCRIBER_EXPIRING_PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {t('followUpExpiringWithin')}: {t(`followUpPeriod_${p}`)}
                  </option>
                ))}
              </select>
            )}
            <div className="w-full sm:w-80">
            <SearchInput
              placeholder={t('searchSubscribersPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="rounded-xl overflow-hidden border border-border/60">
            <GenericDataGrid<SubscriberFollowUpRow>
              rowData={rows}
              columnDefs={columnDefs}
              loading={isLoading}
              isServerSide={true}
              currentPage={paginated?.meta?.current_page || 1}
              totalPages={paginated?.meta?.last_page || 1}
              onPageChange={(p) => setPage(p)}
              height={580}
              rowHeight={60}
              headerHeight={44}
              getRowId={(p) => String(p.data.subscription_id)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
