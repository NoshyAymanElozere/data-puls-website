import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModalStatus from '@/shared/components/modal-status'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { BillingPeriod } from '@/features/subscription-packages/api/useSubscriptionPackages'
import type { UserSubscription } from '../types/subscriptions'
import {
  type AdminSubscriptionStatus,
  useGrantUserSubscription,
  useSubscriptionPackageOptions,
  useUpdateUserSubscription,
} from '../api/useUserSubscriptions'

interface UserSubscriptionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number
  /** null = grant a new subscription. */
  subscription: UserSubscription | null
}

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-main/40 disabled:opacity-60'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

function editableStatus(status: UserSubscription['status'] | undefined): AdminSubscriptionStatus {
  if (status === 'cancelled' || status === 'expired') return status
  return 'active'
}

export function UserSubscriptionFormModal({ open, onOpenChange, userId, subscription }: UserSubscriptionFormModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const isEdit = subscription !== null

  const { data: packages = [], isLoading: packagesLoading } = useSubscriptionPackageOptions(open)
  const grantMutation = useGrantUserSubscription(userId)
  const updateMutation = useUpdateUserSubscription(userId)

  const [packageId, setPackageId] = useState<string>('')
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [status, setStatus] = useState<AdminSubscriptionStatus>('active')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [autoRenewal, setAutoRenewal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPackageId(subscription?.package?.id ? String(subscription.package.id) : '')
    setBillingPeriod(subscription?.billing_option?.billing_period ?? 'monthly')
    setStatus(editableStatus(subscription?.status))
    setStartsAt(subscription?.starts_at_date ?? (isEdit ? '' : today()))
    setEndsAt(subscription?.ends_at_date ?? '')
    setAutoRenewal(subscription?.auto_renewal ?? false)
    setError(null)
  }, [open, subscription, isEdit])

  const selectedPackage = useMemo(
    () => packages.find((item) => String(item.id) === packageId),
    [packages, packageId]
  )

  const availablePeriods = useMemo<BillingPeriod[]>(() => {
    const periods = selectedPackage?.prices?.map((price) => price.billing_period)
    return periods && periods.length > 0 ? Array.from(new Set(periods)) : ['monthly', 'yearly']
  }, [selectedPackage])

  useEffect(() => {
    if (selectedPackage && !availablePeriods.includes(billingPeriod)) {
      setBillingPeriod(availablePeriods[0])
    }
  }, [selectedPackage, availablePeriods, billingPeriod])

  const isSaving = grantMutation.isPending || updateMutation.isPending

  const handleSubmit = () => {
    if (!packageId) {
      setError(t('selectPackageRequired'))
      return
    }
    if (startsAt && endsAt && endsAt <= startsAt) {
      setError(t('subscriptionEndAfterStart'))
      return
    }
    setError(null)

    const close = { onSuccess: () => onOpenChange(false) }

    if (!isEdit) {
      grantMutation.mutate(
        {
          subscription_package_id: Number(packageId),
          billing_period: billingPeriod,
          starts_at: startsAt || null,
          ends_at: endsAt || null,
          auto_renewal: autoRenewal,
        },
        close
      )
      return
    }

    const packageChanged =
      Number(packageId) !== subscription.package?.id || billingPeriod !== subscription.billing_option?.billing_period

    updateMutation.mutate(
      {
        subscriptionId: subscription.id,
        payload: {
          ...(packageChanged ? { subscription_package_id: Number(packageId), billing_period: billingPeriod } : {}),
          ...(status !== editableStatus(subscription.status) || subscription.status === 'pending_payment' ? { status } : {}),
          ...(startsAt && startsAt !== subscription.starts_at_date ? { starts_at: startsAt } : {}),
          ...(endsAt && endsAt !== subscription.ends_at_date ? { ends_at: endsAt } : {}),
          auto_renewal: autoRenewal,
        },
      },
      close
    )
  }

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('editSubscription') : t('grantSubscription')}
      description={isEdit ? undefined : t('grantSubscriptionHint')}
      agreeLabel={isEdit ? t('saveChanges') : t('grantSubscription')}
      cancelLabel={t('cancel')}
      onAgreeButtonClick={handleSubmit}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={isSaving}
      size="lg"
    >
      <div className="space-y-4 px-1 py-1" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('package')}>
            <select
              className={fieldClass}
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              disabled={packagesLoading}
            >
              <option value="">{packagesLoading ? t('loading') : t('selectPackage')}</option>
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {getLocalizedValue(item.name, i18n.language)}
                  {item.is_active ? '' : ` (${t('inactive')})`}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('billingPeriod')}>
            <select
              className={fieldClass}
              value={billingPeriod}
              onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
            >
              {availablePeriods.map((period) => (
                <option key={period} value={period}>
                  {t(period)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t('startsAt')}>
            <input type="date" className={fieldClass} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </Field>

          <Field label={t('endsAt')} hint={isEdit ? undefined : t('subscriptionEndsAtHint')}>
            <input
              type="date"
              className={fieldClass}
              value={endsAt}
              min={startsAt || undefined}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </Field>

          {isEdit ? (
            <Field label={t('status')}>
              <select
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminSubscriptionStatus)}
              >
                <option value="active">{t('active')}</option>
                <option value="cancelled">{t('cancelled')}</option>
                <option value="expired">{t('expired')}</option>
              </select>
            </Field>
          ) : null}

          <label className="flex items-center gap-2 self-end h-10 text-sm font-semibold text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRenewal}
              onChange={(e) => setAutoRenewal(e.target.checked)}
              className="h-4 w-4 rounded border-border text-main focus:ring-main cursor-pointer"
            />
            {t('autoRenewal')}
          </label>
        </div>

        {!isEdit ? (
          <p className="text-xs text-muted-foreground rounded-lg bg-muted/40 border border-border/50 p-3">
            {t('grantSubscriptionReplaceNote')}
          </p>
        ) : null}

        {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
      </div>
    </ModalStatus>
  )
}
