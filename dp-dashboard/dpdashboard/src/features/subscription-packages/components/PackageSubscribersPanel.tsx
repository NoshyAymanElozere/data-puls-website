import { Badge, type BadgeProps } from '@/shared/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { Avatar } from '@/shared/components/misc'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import type { ColDef } from 'ag-grid-community'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  SubscriptionPackageSubscriber,
  SubscriptionStatus,
} from '../api/useSubscriptionPackages'

function getSubscriptionStatusVariant(status: SubscriptionStatus): BadgeProps['variant'] {
  switch (status) {
    case 'active':
      return 'success'
    case 'trial':
      return 'info'
    case 'pending_payment':
      return 'warning'
    case 'cancelled':
      return 'secondary'
    case 'expired':
      return 'destructive'
    default:
      return 'outline'
  }
}

interface PackageSubscribersPanelProps {
  subscribers?: SubscriptionPackageSubscriber[]
  subscribersCount?: number
}

export function PackageSubscribersPanel({ subscribers = [], subscribersCount = 0 }: PackageSubscribersPanelProps) {
  const { t } = useTranslation()

  const columnDefs = useMemo<ColDef<SubscriptionPackageSubscriber>[]>(
    () => [
      {
        headerName: t('subscribers'),
        filter: false,
        sortable: false,
        flex: 1.4,
        minWidth: 220,
        cellRenderer: (params: { data?: SubscriptionPackageSubscriber }) => {
          const item = params.data
          if (!item?.user) return null
          const avatarSrc = resolveMediaUrl(item.user.avatar_url)
          return (
            <div className="flex items-center gap-3 h-full">
              <Avatar
                src={avatarSrc}
                name={item.user.email}
                size="sm"
                className="h-8 w-8 text-xs"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.user.email}</p>
                <p className="text-xs text-muted-foreground truncate">{item.user.phone || '—'}</p>
              </div>
            </div>
          )
        },
      },
      {
        headerName: t('billingPeriod'),
        filter: false,
        sortable: false,
        width: 130,
        valueGetter: (params) => params.data?.billing_option?.billing_period_label ?? '—',
      },
      {
        headerName: t('status'),
        filter: false,
        sortable: false,
        width: 140,
        cellRenderer: (params: { data?: SubscriptionPackageSubscriber }) => {
          const item = params.data
          if (!item) return null
          return (
            <Badge variant={getSubscriptionStatusVariant(item.status)} dot>
              {item.status_label}
            </Badge>
          )
        },
      },
      {
        headerName: t('remainingDays'),
        filter: false,
        sortable: false,
        width: 130,
        valueGetter: (params) => {
          const days = params.data?.remaining_days
          return days == null ? '—' : String(days)
        },
      },
      {
        headerName: t('autoRenewal'),
        filter: false,
        sortable: false,
        width: 120,
        valueGetter: (params) => (params.data?.auto_renewal ? t('yes') : t('no')),
      },
    ],
    [t]
  )

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
      <CardHeader className="border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold text-foreground">{t('subscribers')}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t('activeSubscribers')}: {subscribersCount} · {subscribers.length} {t('records')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t('noSubscribers')}</p>
        ) : (
          <GenericDataGrid
            rowData={subscribers}
            columnDefs={columnDefs}
            rowHeight={56}
            headerHeight={48}
            height={Math.min(400, 56 + 48 + subscribers.length * 56 + 16)}
            defaultColDef={{ filter: false, sortable: false }}
          />
        )}
      </CardContent>
    </Card>
  )
}
