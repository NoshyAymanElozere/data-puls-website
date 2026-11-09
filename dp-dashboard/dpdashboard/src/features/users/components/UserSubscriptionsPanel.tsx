import { Badge, type BadgeProps } from '@/shared/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import type { ColDef } from 'ag-grid-community'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubscriptionStatus } from '@/features/subscription-packages/api/useSubscriptionPackages'
import type { UserDetail, UserSubscription, UserSubscriptionAccess, UserSubscriptionDiscount } from '../api/useUsers'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { Ban, Gift, Pencil, Plus, TicketPercent } from 'lucide-react'
import { AccessTypeBadge } from './AccessTypeBadge'
import { Button } from '@/shared/components/button'
import ModalStatus from '@/shared/components/modal-status'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { UserSubscriptionFormModal } from './UserSubscriptionFormModal'
import { useUpdateUserSubscription } from '../api/useUserSubscriptions'

export function isUnpaidSubscription(item: UserSubscription): boolean {
  return (
    item.status === 'pending_payment' ||
    (item as unknown as { status?: string }).status === 'unpaid' ||
    (item as unknown as { payment_status?: string }).payment_status === 'unpaid' ||
    (item as unknown as { is_paid?: boolean }).is_paid === false
  )
}

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

function formatAccessDate(value: string | null | undefined, lang: string): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatAmount(value: number | null | undefined): string {
  if (value == null) return '—'
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function DiscountInline({ discount }: { discount: UserSubscriptionDiscount }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
      <TicketPercent className="h-3.5 w-3.5 text-main shrink-0" />
      <span className="font-mono font-bold">{discount.code || '—'}</span>
      <span className="text-muted-foreground">(-{formatAmount(discount.discount_amount)})</span>
    </span>
  )
}

function SubscriptionAccessBlock({ access }: { access: UserSubscriptionAccess }) {
  const { t, i18n } = useTranslation()
  const trialStatusLabel = access.is_in_trial
    ? t('trialActive')
    : access.trial_ended
      ? t('trialEnded')
      : access.trial_enabled
        ? t('trialNotStarted')
        : t('trialDisabled')

  return (
    <Card className="border-border/60 bg-muted/20 shadow-none rounded-xl">
      <CardHeader className="px-4 py-3 border-b border-border/30 flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Gift className="h-4 w-4 text-main" /> {t('freeTrialAccess')}
        </CardTitle>
        <AccessTypeBadge value={access.access_type} />
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <DetailField label={t('trialStatus')} value={trialStatusLabel} t={t} />
          <DetailField label={t('trialStartsAt')} value={formatAccessDate(access.trial_starts_at, i18n.language) ?? '—'} t={t} />
          <DetailField label={t('trialEndsAt')} value={formatAccessDate(access.trial_ends_at, i18n.language) ?? '—'} t={t} />
          <DetailField
            label={t('trialDaysRemaining')}
            value={access.is_in_trial ? (access.trial_days_remaining ?? '—') : '—'}
            t={t}
          />
          <DetailField label={t('trialEnded')} value={access.trial_ended} t={t} />
          {access.package?.name ? (
            <DetailField label={t('package')} value={access.package.name} t={t} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

interface UserSubscriptionsPanelProps {
  user: UserDetail
  /** Show grant / edit / cancel controls (admins with users.update only). */
  manageable?: boolean
}

export function UserSubscriptionsPanel({ user, manageable = false }: UserSubscriptionsPanelProps) {
  const { t, i18n } = useTranslation()
  const [showUnpaid, setShowUnpaid] = useState(false)
  const { data: admin } = useProfile()
  const canManage = manageable && hasPermission(admin, 'users.update') && !user.account_owner_id
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<UserSubscription | null>(null)
  const [cancelling, setCancelling] = useState<UserSubscription | null>(null)
  const updateMutation = useUpdateUserSubscription(user.id)

  const openGrant = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (item: UserSubscription) => {
    setEditing(item)
    setFormOpen(true)
  }

  const confirmCancel = () => {
    if (!cancelling) return
    updateMutation.mutate(
      { subscriptionId: cancelling.id, payload: { status: 'cancelled' } },
      { onSuccess: () => setCancelling(null) }
    )
  }

  const active = user.active_subscription && !isUnpaidSubscription(user.active_subscription) ? user.active_subscription : null
  const allSubscriptions = user.subscriptions ?? []

  const unpaidCount = useMemo(
    () => allSubscriptions.filter(isUnpaidSubscription).length,
    [allSubscriptions]
  )

  const history = useMemo(() => {
    if (showUnpaid) return allSubscriptions
    return allSubscriptions.filter((item) => !isUnpaidSubscription(item))
  }, [allSubscriptions, showUnpaid])

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
        headerName: t('discountCode'),
        filter: false,
        sortable: false,
        width: 170,
        cellRenderer: (params: { data?: UserSubscription }) => {
          const discount = params.data?.discount
          if (!discount) return <span className="text-muted-foreground">—</span>
          return <DiscountInline discount={discount} />
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
      ...(canManage
        ? [
            {
              headerName: t('actions'),
              filter: false,
              sortable: false,
              width: 100,
              pinned: (i18n.language === 'ar' ? 'left' : 'right') as 'left' | 'right',
              cellRenderer: (params: { data?: UserSubscription }) => {
                const item = params.data
                if (!item) return null
                return (
                  <div className="flex items-center gap-1 h-full">
                    <Button size="icon-sm" variant="ghost" title={t('editSubscription')} onClick={() => openEdit(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {item.status === 'active' || item.status === 'trial' ? (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title={t('cancelSubscription')}
                        onClick={() => setCancelling(item)}
                      >
                        <Ban className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    ) : null}
                  </div>
                )
              },
            } satisfies ColDef<UserSubscription>,
          ]
        : []),
    ],
    [t, i18n.language, canManage]
  )

  return (
    <div className="space-y-4 pt-2 border-t border-border/40">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{t('subscriptions')}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={user.is_subscribed ? 'success' : 'secondary'} dot>
            {user.is_subscribed ? t('subscribed') : t('notSubscribed')}
          </Badge>
          {canManage ? (
            <Button size="sm" onClick={openGrant} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              {t('grantSubscription')}
            </Button>
          ) : null}
        </div>
      </div>

      {manageable && user.account_owner_id ? (
        <p className="text-xs text-muted-foreground rounded-lg bg-muted/40 border border-border/50 p-3">
          {t('familyMemberSubscriptionNote')}
        </p>
      ) : null}

      {user.subscription_access ? <SubscriptionAccessBlock access={user.subscription_access} /> : null}

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
              <div className="flex items-center gap-2">
                <Badge variant={getSubscriptionStatusVariant(active.status)} dot>
                  {active.status_label}
                </Badge>
                {canManage ? (
                  <>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEdit(active)}>
                      <Pencil className="h-3.5 w-3.5" />
                      {t('edit')}
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => setCancelling(active)}>
                      <Ban className="h-3.5 w-3.5" />
                      {t('cancelSubscription')}
                    </Button>
                  </>
                ) : null}
              </div>
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
              {active.discount ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {t('discountCode')}
                  </span>
                  <DiscountInline discount={active.discount} />
                  <span className="text-[11px] text-muted-foreground">
                    {t('discountAmount')}: {formatAmount(active.discount.discount_amount)} · {t('finalAmount')}:{' '}
                    {formatAmount(active.discount.final_amount)}
                  </span>
                </div>
              ) : null}
              <DetailField
                label={t('maximumFamilyMembers')}
                value={active.package.maximum_family_members}
                t={t}
              />
              <DetailField
                label={t('maximumInvoices')}
                value={
                  active.package.maximum_invoices === null || active.package.maximum_invoices === undefined
                    ? t('unlimited')
                    : active.package.maximum_invoices
                }
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
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('subscriptionHistory')}
          </p>

          {unpaidCount > 0 && (
            <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={showUnpaid}
                onChange={(e) => setShowUnpaid(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border text-main focus:ring-main cursor-pointer"
              />
              <span>{t('showUnpaidSubscriptions')}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                {unpaidCount}
              </span>
            </label>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-muted/10 p-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{t('noSubscriptions')}</p>
          </div>
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

      {canManage ? (
        <>
          <UserSubscriptionFormModal
            open={formOpen}
            onOpenChange={setFormOpen}
            userId={user.id}
            subscription={editing}
          />
          <ModalStatus
            open={cancelling !== null}
            onOpenChange={(open) => !open && setCancelling(null)}
            type="delete"
            title={t('cancelSubscription')}
            description={t('cancelSubscriptionConfirm')}
            agreeLabel={t('cancelSubscription')}
            cancelLabel={t('cancel')}
            onAgreeButtonClick={confirmCancel}
            onCancelButtonClick={() => setCancelling(null)}
            loading={updateMutation.isPending}
          />
        </>
      ) : null}
    </div>
  )
}
