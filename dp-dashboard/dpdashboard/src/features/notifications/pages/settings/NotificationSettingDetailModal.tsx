import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, CheckCircle2, XCircle, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import {
  useNotificationSetting,
  type NotificationSettingDetail,
} from '../../api/useNotificationSettings'
import { EVENT_CATALOG } from './eventTokensCatalog'

interface NotificationSettingDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settingId: number | null
  onEdit?: (setting: NotificationSettingDetail) => void
  canUpdate?: boolean
}

function RenderMessageWithTokens({ text }: { text: string }) {
  if (!text) return <span className="text-muted-foreground italic">-</span>

  const parts = text.split(/(\{[a-zA-Z0-9_-]+\})/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('{') && part.endsWith('}')) {
          return (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md bg-main/15 text-main font-mono text-xs font-bold border border-main/30"
            >
              {part}
            </span>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

export function NotificationSettingDetailModal({
  open,
  onOpenChange,
  settingId,
  onEdit,
  canUpdate = true,
}: NotificationSettingDetailModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const { data: setting, isLoading } = useNotificationSetting(open ? settingId : null)

  const eventKey = setting?.key || ''
  const catalogItem = EVENT_CATALOG[eventKey]
  const displayName =
    getLocalizedValue(setting?.name, i18n.language) ||
    (isRtl ? catalogItem?.labelAr : catalogItem?.labelEn) ||
    eventKey

  const daysBefore = setting?.config?.days_before

  const titleAr = typeof setting?.title === 'object' ? setting.title.ar : setting?.title || ''
  const titleEn = typeof setting?.title === 'object' ? setting.title.en : setting?.title || ''
  const bodyAr = typeof setting?.body === 'object' ? setting.body.ar : setting?.body || ''
  const bodyEn = typeof setting?.body === 'object' ? setting.body.en : setting?.body || ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-border/50 bg-card shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm shrink-0"
                style={{ backgroundColor: setting?.icon_bg_color || '#5B4B8A' }}
              >
                <i className={setting?.icon || 'fa-solid fa-bell'} style={{ fontSize: '20px' }} />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-foreground">
                  {displayName}
                </DialogTitle>
                <span className="text-xs font-mono text-muted-foreground mt-0.5 block">
                  {eventKey}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {setting?.is_active ? (
                <Badge variant="success" className="gap-1 font-bold text-xs py-1 px-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t('active')}
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 font-bold text-xs py-1 px-2.5">
                  <XCircle className="h-3.5 w-3.5" />
                  {t('inactive')}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-main border-t-transparent" />
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? 'جاري التحميل...' : 'Loading...'}
            </span>
          </div>
        ) : !setting ? (
          <div className="py-16 text-center text-xs font-semibold text-muted-foreground">
            {t('noDataFound')}
          </div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Visual Branding Bar & Advance Days */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground">
                  {t('iconAndColor')}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {setting.icon}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-muted-foreground bg-card px-2 py-0.5 rounded-lg border border-border/40">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: setting.icon_bg_color }}
                    />
                    {setting.icon_bg_color}
                  </span>
                </div>
              </div>

              {daysBefore != null && (
                <Badge variant="secondary" className="gap-1 text-xs font-bold px-2.5 py-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20">
                  <Clock className="h-3.5 w-3.5" />
                  {daysBefore} {t('days') || 'أيام'} ({t('leadDays')})
                </Badge>
              )}
            </div>

            {/* Arabic Content */}
            <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  {t('titleAr')} & {t('bodyAr')}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  العربية
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {t('notificationTitle')}
                </span>
                <div className="text-sm font-bold text-foreground leading-relaxed" dir="rtl">
                  <RenderMessageWithTokens text={titleAr} />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {t('notificationBody')}
                </span>
                <div
                  className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap p-3 rounded-xl bg-muted/20 border border-border/40"
                  dir="rtl"
                >
                  <RenderMessageWithTokens text={bodyAr} />
                </div>
              </div>
            </div>

            {/* English Content */}
            <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  {t('titleEn')} & {t('bodyEn')}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  English
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {t('notificationTitle')}
                </span>
                <div className="text-sm font-bold text-foreground leading-relaxed" dir="ltr">
                  <RenderMessageWithTokens text={titleEn} />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-muted-foreground block">
                  {t('notificationBody')}
                </span>
                <div
                  className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap p-3 rounded-xl bg-muted/20 border border-border/40"
                  dir="ltr"
                >
                  <RenderMessageWithTokens text={bodyEn} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-card flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 text-xs font-bold"
          >
            {t('close') || 'إغلاق'}
          </Button>

          {canUpdate && setting && (
            <Button
              type="button"
              variant="action"
              onClick={() => {
                onOpenChange(false)
                onEdit?.(setting)
              }}
              className="h-10 px-5 text-xs font-bold gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>{t('editTemplate') || 'تعديل القالب'}</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
