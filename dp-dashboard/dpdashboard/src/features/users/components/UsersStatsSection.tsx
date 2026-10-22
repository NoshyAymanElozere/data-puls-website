import { StatCard } from '@/shared/components/stat-card'
import { Skeleton } from '@/shared/components/misc'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { formatNumber } from '@/shared/utils/utils'
import { Ban, CreditCard, Gift, MapPin, UserCheck, UserPlus, Users, UserX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UsersStats } from '../api/useUsers'

interface UsersStatsSectionProps {
  stats: UsersStats | undefined
  loading: boolean
}

interface TopListItem {
  id: number
  label: string
  sublabel?: string
  count: number
}

function TopList({
  title,
  items,
  loading,
  emptyLabel,
}: {
  title: string
  items: TopListItem[]
  loading: boolean
  emptyLabel: string
}) {
  const max = items.reduce((acc, item) => Math.max(acc, item.count), 0)

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" /> {title}
      </h4>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs font-semibold text-muted-foreground py-2">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item.id} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 truncate font-semibold text-foreground">
                  {item.label}
                  {item.sublabel && (
                    <span className="text-muted-foreground font-normal"> · {item.sublabel}</span>
                  )}
                </span>
                <span className="shrink-0 font-bold text-foreground tabular-nums">{formatNumber(item.count)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-main"
                  style={{ width: `${max > 0 ? Math.max(4, (item.count / max) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function UsersStatsSection({ stats, loading }: UsersStatsSectionProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const cards = [
    { key: 'total', title: t('totalUsers'), value: stats?.total, icon: <Users className="h-5 w-5 text-main" />, iconBg: 'bg-main/10' },
    { key: 'active', title: t('activeUsers'), value: stats?.active, icon: <UserCheck className="h-5 w-5 text-success" />, iconBg: 'bg-success/10' },
    { key: 'suspended', title: t('suspendedUsers'), value: stats?.suspended, icon: <UserX className="h-5 w-5 text-action" />, iconBg: 'bg-action/10' },
    { key: 'subscribed', title: t('subscribedUsers'), value: stats?.subscribed, icon: <CreditCard className="h-5 w-5 text-success" />, iconBg: 'bg-success/10' },
    { key: 'in_trial', title: t('usersInTrial'), value: stats?.in_trial, icon: <Gift className="h-5 w-5 text-brand-active" />, iconBg: 'bg-brand-active/10' },
    { key: 'no_access', title: t('usersNoAccess'), value: stats?.no_access, icon: <Ban className="h-5 w-5 text-muted-foreground" />, iconBg: 'bg-muted' },
    { key: 'new_this_month', title: t('newUsersThisMonth'), value: stats?.new_this_month, icon: <UserPlus className="h-5 w-5 text-main" />, iconBg: 'bg-main/10' },
  ]

  const topCountries: TopListItem[] = (stats?.by_country ?? []).slice(0, 5).map((row) => ({
    id: row.id,
    label: getLocalizedValue(row.name, lang) || '-',
    count: row.count,
  }))

  const topCities: TopListItem[] = (stats?.by_city ?? []).slice(0, 5).map((row) => ({
    id: row.id,
    label: getLocalizedValue(row.name, lang) || '-',
    sublabel: getLocalizedValue(row.country_name, lang) || undefined,
    count: row.count,
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-3">
        {cards.map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.value ?? 0}
            format="number"
            icon={card.icon}
            iconBg={card.iconBg}
            loading={loading}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TopList title={t('topCountries')} items={topCountries} loading={loading} emptyLabel={t('noDataFound')} />
        <TopList title={t('topCities')} items={topCities} loading={loading} emptyLabel={t('noDataFound')} />
      </div>
    </div>
  )
}
