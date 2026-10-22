import { useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarClock, Phone, UserRound, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/card'
import { Badge } from '@/shared/components/badge'
import { cn } from '@/shared/utils/utils'
import {
  SUBSCRIBER_FOLLOW_UP_STATUSES,
  useSubscriberFollowUp,
  type SubscriberFollowUpStatus,
} from '../api/useDashboard'
import {
  SUBSCRIBER_FOLLOW_UP_PATH,
  getFollowUpDaysBadge,
  getFollowUpStatusLabel,
} from '../utils/subscriberFollowUp'

export function SubscriberFollowUpCard() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SubscriberFollowUpStatus>('expiring_soon')
  const { data, isLoading, isError } = useSubscriberFollowUp()

  const currentList = data?.lists?.[activeTab]
  const rows = currentList?.items ?? []
  const viewAllHref = `${SUBSCRIBER_FOLLOW_UP_PATH}?status=${activeTab}`

  return (
    <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
      <div className="p-6 pb-3 flex justify-between items-center border-b border-gray-50 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[#111827] text-base leading-none truncate">
              {t('subscriberFollowUp')}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 truncate">{t('subscriberFollowUpSubtitle')}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(viewAllHref)}
          className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-main hover:opacity-80 transition-opacity"
        >
          {t('viewAll')} {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
        </button>
      </div>

      <CardContent className="p-6 pt-4 space-y-4">
        {/* Segments with counts */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200" role="tablist">
          {SUBSCRIBER_FOLLOW_UP_STATUSES.map((status) => {
            const isActive = activeTab === status
            const count = data?.lists?.[status]?.count
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(status)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-semibold leading-tight transition-all',
                  isActive ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-extrabold',
                    status === 'expiring_soon' && 'text-amber-600',
                    status === 'active' && 'text-emerald-600',
                    status === 'expired' && 'text-rose-600'
                  )}
                >
                  {isLoading ? '–' : (count ?? 0).toLocaleString()}
                </span>
                <span className="text-center line-clamp-2">
                  {getFollowUpStatusLabel(status, t, data?.expiring_soon_days)}
                </span>
              </button>
            )
          })}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-gray-400 text-xs">{t('errorLoadingData')}</div>
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
            <UserRound className="h-8 w-8 text-gray-200" />
            <span>{t('noSubscribersInList')}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.slice(0, 5).map((row) => {
              const badge = getFollowUpDaysBadge(row, t)
              return (
                <div
                  key={row.subscription_id}
                  onClick={() => navigate(viewAllHref)}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/40 hover:bg-gray-100/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-main/10 text-main border border-main/20 flex items-center justify-center text-xs font-bold">
                      {row.user?.name ? row.user.name.trim().charAt(0).toUpperCase() : <UserRound className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate" title={row.user?.name ?? ''}>
                        {row.user?.name || '-'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5 min-w-0">
                        {row.user?.phone && (
                          <a
                            href={`tel:${row.user.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-gray-500 font-medium hover:text-main shrink-0"
                            dir="ltr"
                          >
                            <Phone className="h-3 w-3 shrink-0" />
                            {row.user.phone}
                          </a>
                        )}
                        {row.package?.name && (
                          <>
                            <span>•</span>
                            <span className="truncate">{row.package.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ps-3">
                    <Badge variant="outline" className={cn('text-[10px] font-bold px-2 py-0.5 border', badge.className)}>
                      {badge.label}
                    </Badge>
                    {row.ends_at && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                        <CalendarClock className="h-3 w-3" />
                        {row.ends_at}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
