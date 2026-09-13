import React from 'react'
import { cn } from '@/shared/utils/utils'
import { Card, CardContent } from '@/shared/components/card'
import { useTranslation } from 'react-i18next'
import type { DashboardAnalyticsItem, DashboardAnalyticsPeriod } from '../api/useDashboard'

export type { DashboardAnalyticsItem as WeeklyData }

interface WeeklyPillChartProps {
  title?: string
  data?: DashboardAnalyticsItem[]
  period?: DashboardAnalyticsPeriod
  onPeriodChange?: (period: DashboardAnalyticsPeriod) => void
  isLoading?: boolean
}

const defaultData: DashboardAnalyticsItem[] = [
  { day: 'S', val: '45%', type: 'striped', tooltip: '12 invoices' },
  { day: 'M', val: '75%', type: 'solid', tooltip: '28 invoices' },
  { day: 'T', val: '60%', type: 'light', tooltip: '20 invoices' },
  { day: 'W', val: '95%', type: 'dark-solid', tooltip: '36 invoices' },
  { day: 'T', val: '50%', type: 'striped', tooltip: '18 invoices' },
  { day: 'F', val: '30%', type: 'striped', tooltip: '8 invoices' },
  { day: 'S', val: '65%', type: 'striped', tooltip: '24 invoices' },
]

export function WeeklyPillChart({
  title,
  data = defaultData,
  period = 'weekly',
  onPeriodChange,
  isLoading = false,
}: WeeklyPillChartProps) {
  const { t } = useTranslation()
  const displayTitle = title || t('activityAnalytics')

  return (
    <Card className="border border-gray-100 rounded-2xl shadow-xs overflow-hidden bg-white">
      <div className="p-6 pb-2 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="font-bold text-[#111827] text-base">{displayTitle}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{t('dashboardSubtitle')}</p>
        </div>

        {onPeriodChange && (
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 self-start sm:self-auto">
            {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-lg transition-all',
                  period === p
                    ? 'bg-white text-main shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                )}
              >
                {t(p)}
              </button>
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="flex items-end justify-between h-56 pt-8 px-2 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-9 sm:w-11 h-36 bg-gray-100 rounded-full animate-pulse" />
                <div className="w-4 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-between items-end h-56 pt-8 px-2 relative">
            <div className="absolute inset-0 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-[0.03]">
              <div className="border-t border-black w-full" />
              <div className="border-t border-black w-full" />
              <div className="border-t border-black w-full" />
            </div>

            {data.map((col, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 gap-3 relative group" style={{ zIndex: 10 }}>
                {col.tooltip && (
                  <span className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-7 px-2 py-0.5 rounded-md bg-gray-900 text-white text-[10px] font-bold shadow-sm whitespace-nowrap z-20">
                    {col.tooltip}
                  </span>
                )}

                <div className="w-8 sm:w-11 h-36 bg-gray-50 rounded-full overflow-hidden flex flex-col justify-end relative">
                  <div
                    style={{ height: col.val }}
                    className={cn(
                      'w-full rounded-full transition-all duration-500 group-hover:opacity-90',
                      col.type === 'striped' &&
                        'bg-gradient-to-t from-gray-200 to-gray-300 border border-dashed border-gray-400',
                      col.type === 'solid' && 'bg-main',
                      col.type === 'light' && 'bg-main/60',
                      col.type === 'dark-solid' && 'bg-main-start'
                    )}
                  />
                </div>
                <span className="text-xs font-bold text-gray-500">{col.day}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

