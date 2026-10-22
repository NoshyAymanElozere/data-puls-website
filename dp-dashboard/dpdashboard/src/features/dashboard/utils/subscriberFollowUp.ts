import type { SubscriberFollowUpRow, SubscriberFollowUpStatus } from '../api/useDashboard'

type Translate = (key: string, options?: Record<string, unknown>) => string

/** Route of the full subscriber follow-up page (registered in App.tsx). */
export const SUBSCRIBER_FOLLOW_UP_PATH = '/subscriber-follow-up'

export function isSubscriberFollowUpStatus(value: string | null): value is SubscriberFollowUpStatus {
  return value === 'expiring_soon' || value === 'active' || value === 'expired'
}

/** Label for each follow-up list; `expiring_soon` includes the configured window in days. */
export function getFollowUpStatusLabel(
  status: SubscriberFollowUpStatus,
  t: Translate,
  expiringSoonDays?: number
): string {
  if (status === 'expiring_soon') {
    return expiringSoonDays ? t('expiringSoonWithinDays', { count: expiringSoonDays }) : t('expiringSoon')
  }
  if (status === 'active') return t('activeSubscribers')
  return t('expiredNotRenewed')
}

/** Badge text + colour for the remaining / elapsed days of a follow-up row. */
export function getFollowUpDaysBadge(row: SubscriberFollowUpRow, t: Translate): { label: string; className: string } {
  if (row.days_since_expired !== null && row.days_since_expired !== undefined) {
    return {
      label: t('daysSinceExpiredCount', { count: row.days_since_expired }),
      className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    }
  }

  const days = Math.max(0, Math.ceil(Number(row.days_remaining) || 0))
  return {
    label: t('daysRemainingCount', { count: days }),
    className:
      days <= 7
        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  }
}
