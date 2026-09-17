import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, Smartphone, Bell } from 'lucide-react'

interface NotificationLivePreviewProps {
  titleEn: string
  titleAr: string
  bodyEn: string
  bodyAr: string
  icon: string
  iconBgColor: string
}

export const NotificationLivePreview: React.FC<NotificationLivePreviewProps> = ({
  titleEn,
  titleAr,
  bodyEn,
  bodyAr,
  icon,
  iconBgColor,
}) => {
  const { t } = useTranslation()
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar')

  const isPreviewAr = previewLang === 'ar'
  const displayTitle = (isPreviewAr ? titleAr : titleEn) || (isPreviewAr ? 'عنوان الإشعار يظهر هنا' : 'Notification Title appears here')
  const displayBody = (isPreviewAr ? bodyAr : bodyEn) || (isPreviewAr ? 'نص الإشعار التوضيحي الذي سيظهر للمستخدم في التطبيق والويب فور إرساله...' : 'Detailed message content that will be pushed to the user in real-time...')
  const effectiveIcon = icon || 'fa-solid fa-bell'
  const effectiveColor = iconBgColor || '#5B4B8A'

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-main" />
          <span className="text-xs font-bold text-foreground">{t('livePreview')}</span>
        </div>

        {/* Preview Language Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border/50 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setPreviewLang('ar')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              isPreviewAr ? 'bg-card text-main shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setPreviewLang('en')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              !isPreviewAr ? 'bg-card text-main shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Mobile Push Notification Mockup Card */}
      <div className="p-4 rounded-xl bg-slate-900 text-white shadow-lg space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HERZ APP</span>
            <span className="opacity-40">•</span>
            <span>{isPreviewAr ? 'الآن' : 'Just now'}</span>
          </div>
          <Bell className="h-3 w-3 text-slate-400" />
        </div>

        <div
          className="flex items-start gap-3"
          dir={isPreviewAr ? 'rtl' : 'ltr'}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition-colors"
            style={{ backgroundColor: effectiveColor }}
          >
            <i className={effectiveIcon} style={{ fontSize: '15px' }} />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="text-xs font-bold text-white tracking-wide truncate">
              {displayTitle}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
              {displayBody}
            </p>
          </div>
        </div>
      </div>

      {/* Instant Notification Status Indicator */}
      <div className="p-3 rounded-xl bg-muted/60 border border-border/50 flex items-center gap-2 text-xs">
        <Radio className="h-3.5 w-3.5 text-main animate-pulse" />
        <span className="text-[11px] text-muted-foreground font-medium">{t('instantBroadcastBadge')}</span>
      </div>
    </div>
  )
}
