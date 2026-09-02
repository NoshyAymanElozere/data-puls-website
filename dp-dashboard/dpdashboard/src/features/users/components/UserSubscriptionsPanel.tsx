import { Badge, type BadgeProps } from '@/shared/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import type { ColDef } from 'ag-grid-community'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubscriptionStatus } from '@/features/subscription-packages/api/useSubscriptionPackages'
import type { UserDetail, UserSubscription } from '../api/useUsers'
import { getLocalizedValue } from '@/shared/utils/localized-value'

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

function DetailField({
  label,
  value,
  t,
}: {
  label: string
  value?: string | number | boolean | null
  t: (key: string) => string
}) {
  if (value === null || value === undefined || value === '') return null
  const display =
    typeof value === 'boolean' ? (value ? t('yes') : t('no')) : String(value)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-foreground">{display}</span>
    </div>
  )
}

interface UserSubscriptionsPanelProps {
  user: UserDetail
}

export function UserSubscriptionsPanel({ user }: UserSubscriptionsPanelProps) {
  const { t, i18n } = useTranslation()
  const active = user.active_subscription
  const history = user.subscriptions ?? []

  const columnDefs = useMemo<ColDef<UserSubscription>[]>(
    () => [
      {
        headerName: t('subscriptionPackages'),
        filter: false,
        sortable: false,
        flex: 1.2,
        minWidth: 160,
        valueGetter: (params) => params.data?.package?.name ?? '—',
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
        cellRenderer: (params: { data?: UserSubscription }) => {
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
        width: 120,
        valueGetter: (params) => {
          const days = params.data?.remaining_days
          return days == null ? '—' : String(days)
        },
      },
      {
        headerName: t('autoRenewal'),
        filter: false,
        sortable: false,
        width: 110,
        valueGetter: (params) => (params.data?.auto_renewal ? t('yes') : t('no')),
      },
      {
        headerName: t('startsAt'),
        filter: false,
        sortable: false,
        width: 150,
        valueGetter: (params) => params.data?.starts_at ?? '—',
      },
      {
        headerName: t('endsAt'),
        filter: false,
        sortable: false,
        width: 150,
        valueGetter: (params) => params.data?.ends_at ?? '—',
      },
    ],
    [t]
  )

  return (
    <div className="space-y-4 pt-2 border-t border-border/40">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{t('subscriptions')}</h3>
        <Badge variant={user.is_subscribed ? 'success' : 'secondary'} dot>
          {user.is_subscribed ? t('subscribed') : t('notSubscribed')}
        </Badge>
      </div>

      {user.is_subscribed && active ? (
        <Card className="border-main/20 bg-main/5 shadow-none rounded-xl">
          <CardHeader className="px-4 py-3 border-b border-border/30">
            <CardTitle className="text-sm font-bold">{t('activeSubscription')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-foreground">{active.package.name}</p>
                {active.package.description ? (
                  <p className="text-xs text-muted-foreground mt-1">{active.package.description}</p>
                ) : null}
              </div>
              <Badge variant={getSubscriptionStatusVariant(active.status)} dot>
                {active.status_label}
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DetailField label={t('billingPeriod')} value={active.billing_option.billing_period_label} t={t} />
              <DetailField
                label={t('price')}
                value={`${active.billing_option.final_price} ${active.billing_option.currency}`}
                t={t}
              />
              <DetailField label={t('remainingDays')} value={active.remaining_days ?? '—'} t={t} />
              <DetailField label={t('autoRenewal')} value={active.auto_renewal} t={t} />
              <DetailField label={t('startsAt')} value={active.starts_at ?? '—'} t={t} />
              <DetailField label={t('endsAt')} value={active.ends_at ?? '—'} t={t} />
              <DetailField label={t('trialEndsAt')} value={active.trial_ends_at ?? '—'} t={t} />
              <DetailField
                label={t('maximumFamilyMembers')}
                value={active.package.maximum_family_members}
                t={t}
              />
            </div>
            {(active.package.features?.length ?? 0) > 0 && (
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t('features')}
                </p>
                <ul className="space-y-1">
                  {active.package.features!.map((feature) => (
                    <li key={feature.id ?? getLocalizedValue(feature.name, i18n.language)} className="text-xs font-semibold text-foreground/90">
                      • {getLocalizedValue(feature.name, i18n.language)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {t('subscriptionHistory')}
        </p>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{t('noSubscriptions')}</p>
        ) : (
          <GenericDataGrid
            rowData={history}
            columnDefs={columnDefs}
            rowHeight={48}
            headerHeight={44}
            height={Math.min(320, 44 + 48 + history.length * 48 + 16)}
            defaultColDef={{ filter: false, sortable: false }}
          />
        )}
      </div>
    </div>
  )
}
