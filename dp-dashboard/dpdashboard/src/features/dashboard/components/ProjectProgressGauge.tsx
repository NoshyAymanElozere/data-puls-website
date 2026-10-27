import React from 'react'
import { Card, CardContent } from '@/shared/components/card'
import { useTranslation } from 'react-i18next'
import { translateMetricText } from '@/shared/utils/translateMetric'

interface ProjectProgressGaugeProps {
  title?: string
  percentage?: number // out of 100
  label?: string
  breakdown?: {
    completed: number
    in_progress: number
    pending: number
  }
  isLoading?: boolean
}

export function ProjectProgressGauge({
  title,
  percentage = 82,
  label,
  breakdown,
  isLoading = false,
}: ProjectProgressGaugeProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const displayTitle = translateMetricText(title, t, isRtl, 'progressCoverage')
  const displayLabel = translateMetricText(label, t, isRtl, 'trackingOnTarget')

  const clampedPercentage = Math.min(100, Math.max(0, percentage))
  const angle = clampedPercentage * 1.8
  const rad = (Math.PI / 180) * (180 - angle)
  const x = 50 + 40 * Math.cos(rad)
  const y = 50 - 40 * Math.sin(rad)

  return (
    <Card className="border border-border rounded-2xl shadow-xs bg-card">
      <div className="p-6 pb-2">
        <h3 className="font-bold text-foreground text-base">{displayTitle}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{displayLabel}</p>
      </div>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-44 h-24 bg-muted/50 rounded-t-full animate-pulse flex items-end justify-center pb-2">
            <div className="w-12 h-6 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
        ) : (
          <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--gradient-start, #10b981)" />
                  <stop offset="100%" stopColor="var(--gradient-end, #059669)" />
                </linearGradient>
              </defs>
              {/* Gray background track */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Highlight track */}
              {clampedPercentage > 0 && (
                <path
                  d={`M 10 50 A 40 40 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`}
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="text-center z-10">
              <h4 className="text-3xl font-extrabold text-foreground tracking-tight">
                {clampedPercentage}%
              </h4>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                {t('completed')}
              </p>
            </div>
          </div>
        )}

        {/* Breakdown Badges */}
        <div className="flex gap-4 mt-6 text-[10px] font-bold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{t('completed')}: {breakdown ? `${breakdown.completed}%` : `${clampedPercentage}%`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>{t('inProgress')}: {breakdown ? `${breakdown.in_progress}%` : '12%'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            <span>{t('pending')}: {breakdown ? `${breakdown.pending}%` : '6%'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

