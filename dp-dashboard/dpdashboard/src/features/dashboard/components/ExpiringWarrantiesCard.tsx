import React from 'react'
import { Shield, ShieldAlert, Store, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/card'
import { Badge } from '@/shared/components/badge'
import { useTranslation } from 'react-i18next'
import { useExpiringWarranties, type ExpiringWarranty } from '../api/useDashboard'
import { useNavigate } from 'react-router-dom'

interface ExpiringWarrantiesCardProps {
  onViewAll?: () => void
}

export function ExpiringWarrantiesCard({ onViewAll }: ExpiringWarrantiesCardProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const navigate = useNavigate()
  const { data: warranties, isLoading, isError } = useExpiringWarranties()

  return (
    <Card className="border border-gray-100 rounded-2xl shadow-xs bg-white">
      <div className="p-6 pb-3 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-base leading-none">
              {t('expiringWarranties')}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              {warranties?.length ? `${warranties.length} ${t('recordsCount')}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => (onViewAll ? onViewAll() : navigate('/expiring-warranties'))}
          className="flex items-center gap-1 text-[11px] font-bold text-main hover:opacity-80 transition-opacity"
        >
          {t('view')} {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
        </button>
      </div>

      <CardContent className="p-6 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : isError || !warranties || warranties.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
            <Shield className="h-8 w-8 text-gray-200" />
            <span>{t('noExpiringWarranties')}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {warranties.slice(0, 5).map((item: ExpiringWarranty) => {
              const roundedDays = Math.max(0, Math.ceil(Number(item.days_remaining) || 0))
              const isUrgent = roundedDays <= 15
              return (
                <div
                  key={item.id}
                  onClick={() => navigate('/expiring-warranties')}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/40 hover:bg-gray-100/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1 truncate text-gray-500 font-medium">
                          <Store className="h-3 w-3 shrink-0" />
                          {item.store_name}
                        </span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ps-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 border ${
                        isUrgent
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {roundedDays} {t('daysRemaining')}
                    </Badge>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {item.formatted_due_date || item.due_date}
                    </span>
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
