import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BellRing, Check, Clock, Sparkles, Tag, Palette } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import { Button } from '@/shared/components/button'
import { Switch } from '@/shared/components/controls'
import {
  useNotificationSetting,
  useUpdateNotificationSetting,
  type NotificationSettingFormValues,
} from '../../api/useNotificationSettings'
import { EVENT_CATALOG, PRESET_COLORS, PRESET_ICONS } from './eventTokensCatalog'
import { TokenEditorField, type TokenEditorRef } from './TokenEditorField'

interface NotificationSettingEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settingId: number | null
}

export function NotificationSettingEditModal({
  open,
  onOpenChange,
  settingId,
}: NotificationSettingEditModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const { data: setting, isLoading } = useNotificationSetting(open ? settingId : null)
  const updateMutation = useUpdateNotificationSetting()

  const [titleAr, setTitleAr] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [bodyAr, setBodyAr] = useState('')
  const [bodyEn, setBodyEn] = useState('')
  const [icon, setIcon] = useState('fa-solid fa-bell')
  const [iconBgColor, setIconBgColor] = useState('#5B4B8A')
  const [daysBefore, setDaysBefore] = useState<number | ''>('')
  const [isActive, setIsActive] = useState(true)

  // Track which field was last focused for token insertion
  const [activeTarget, setActiveTarget] = useState<'titleAr' | 'titleEn' | 'bodyAr' | 'bodyEn'>('bodyAr')

  const titleArRef = useRef<TokenEditorRef>(null)
  const titleEnRef = useRef<TokenEditorRef>(null)
  const bodyArRef = useRef<TokenEditorRef>(null)
  const bodyEnRef = useRef<TokenEditorRef>(null)

  // Populate form when setting data arrives
  useEffect(() => {
    if (setting) {
      const getStr = (val: unknown): string => {
        if (!val) return ''
        if (typeof val === 'string') return val
        if (typeof val === 'object') {
          const rec = val as Record<string, string>
          return rec.ar || rec.en || ''
        }
        return String(val)
      }

      const getAr = (val: unknown): string => {
        if (!val) return ''
        if (typeof val === 'object') return (val as Record<string, string>).ar || ''
        return String(val)
      }

      const getEn = (val: unknown): string => {
        if (!val) return ''
        if (typeof val === 'object') return (val as Record<string, string>).en || ''
        return String(val)
      }

      setTitleAr(getAr(setting.title) || getStr(setting.title))
      setTitleEn(getEn(setting.title) || getStr(setting.title))
      setBodyAr(getAr(setting.body) || getStr(setting.body))
      setBodyEn(getEn(setting.body) || getStr(setting.body))
      setIcon(setting.icon || 'fa-solid fa-bell')
      setIconBgColor(setting.icon_bg_color || '#5B4B8A')
      setDaysBefore(setting.config?.days_before ?? '')
      setIsActive(setting.is_active ?? true)
    }
  }, [setting])

  const eventKey = setting?.key || ''
  const catalogItem = EVENT_CATALOG[eventKey]
  const showLeadDays =
    catalogItem?.hasLeadDays ||
    eventKey === 'subscription_expiring_soon' ||
    eventKey === 'warranty_expiring' ||
    setting?.config?.days_before !== undefined

  const availableTokens = catalogItem?.tokens || []

  // Token insertion at current cursor position into active field
  const handleInsertToken = (token: string) => {
    if (activeTarget === 'bodyAr') {
      bodyArRef.current?.insertToken(token)
    } else if (activeTarget === 'bodyEn') {
      bodyEnRef.current?.insertToken(token)
    } else if (activeTarget === 'titleAr') {
      titleArRef.current?.insertToken(token)
    } else if (activeTarget === 'titleEn') {
      titleEnRef.current?.insertToken(token)
    } else {
      bodyArRef.current?.insertToken(token)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!settingId) return

    const payload: NotificationSettingFormValues = {
      title_ar: titleAr,
      title_en: titleEn,
      body_ar: bodyAr,
      body_en: bodyEn,
      icon,
      icon_bg_color: iconBgColor,
      days_before: showLeadDays && daysBefore !== '' ? Number(daysBefore) : undefined,
      is_active: isActive,
    }

    updateMutation.mutate(
      { id: settingId, payload },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="p-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-border/50 bg-card shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm transition-transform shrink-0"
                style={{ backgroundColor: iconBgColor }}
              >
                <i className={icon} style={{ fontSize: '18px' }} />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-foreground">
                  {t('editNotificationSetting')}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-main">
                    {eventKey || `#${settingId}`}
                  </span>
                  {catalogItem && (
                    <span className="text-xs text-muted-foreground">
                      • {isRtl ? catalogItem.labelAr : catalogItem.labelEn}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Switch in Header */}
            <div className="flex items-center gap-3 bg-muted/30 px-3.5 py-1.5 rounded-xl border border-border/40">
              <span className="text-xs font-bold text-foreground">
                {isActive ? t('active') : t('inactive')}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-main border-t-transparent" />
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? 'جاري تحميل تفاصيل القالب...' : 'Loading template details...'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 flex-1">
              {/* Dynamic Tokens Bar */}
              {availableTokens.length > 0 && (
                <div className="p-4 rounded-2xl bg-main/5 border border-main/15 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-main" />
                    <span className="text-xs font-bold text-main">
                      {t('availablePlaceholders')}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({t('clickToInsert')})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableTokens.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => handleInsertToken(token)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-main/20 text-xs font-mono font-bold text-foreground hover:bg-main/10 hover:border-main/40 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Tag className="h-3 w-3 text-main" />
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bilingual Message Section with Atomic Non-Editable Tokens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Arabic Content */}
                <div className="space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between pb-2 border-b border-border/30">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {t('titleAr')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      العربية
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">{t('notificationTitle')}</label>
                    <TokenEditorField
                      ref={titleArRef}
                      value={titleAr}
                      onChange={setTitleAr}
                      tokens={availableTokens}
                      dir="rtl"
                      multiline={false}
                      placeholder="عنوان الإشعار بالعربية..."
                      maxLength={255}
                      onFocus={() => setActiveTarget('titleAr')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">{t('notificationBody')}</label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {bodyAr.length}/2000
                      </span>
                    </div>
                    <TokenEditorField
                      ref={bodyArRef}
                      value={bodyAr}
                      onChange={setBodyAr}
                      tokens={availableTokens}
                      dir="rtl"
                      multiline={true}
                      placeholder="نص الإشعار بالعربية مع المتغيرات مثل {user_name}..."
                      maxLength={2000}
                      onFocus={() => setActiveTarget('bodyAr')}
                    />
                  </div>
                </div>

                {/* English Content */}
                <div className="space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between pb-2 border-b border-border/30">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {t('titleEn')}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      English
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">{t('notificationTitle')}</label>
                    <TokenEditorField
                      ref={titleEnRef}
                      value={titleEn}
                      onChange={setTitleEn}
                      tokens={availableTokens}
                      dir="ltr"
                      multiline={false}
                      placeholder="Notification title in English..."
                      maxLength={255}
                      onFocus={() => setActiveTarget('titleEn')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">{t('notificationBody')}</label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {bodyEn.length}/2000
                      </span>
                    </div>
                    <TokenEditorField
                      ref={bodyEnRef}
                      value={bodyEn}
                      onChange={setBodyEn}
                      tokens={availableTokens}
                      dir="ltr"
                      multiline={true}
                      placeholder="Notification body in English with tokens like {user_name}..."
                      maxLength={2000}
                      onFocus={() => setActiveTarget('bodyEn')}
                    />
                  </div>
                </div>
              </div>

              {/* Visual Branding & Timing Grid (NO CHANNELS DISPLAYED) */}
              <div
                className={`grid grid-cols-1 ${
                  showLeadDays ? 'md:grid-cols-3' : 'md:grid-cols-2'
                } gap-5`}
              >
                {/* Icon Selection */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <BellRing className="h-3.5 w-3.5 text-main" />
                    {t('iconClass')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="fa-solid fa-bell"
                      className="flex-1 h-10 px-3 font-mono text-xs rounded-xl border border-border/60 bg-background"
                    />
                    <div
                      className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: iconBgColor }}
                    >
                      <i className={icon} />
                    </div>
                  </div>

                  {/* Preset Icons */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {t('popularIcons')}
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {PRESET_ICONS.map((p) => (
                        <button
                          key={p.icon}
                          type="button"
                          title={p.label}
                          onClick={() => setIcon(p.icon)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-colors border ${
                            icon === p.icon
                              ? 'bg-main text-white border-main'
                              : 'bg-muted/40 hover:bg-muted text-foreground border-border/40'
                          }`}
                        >
                          <i className={p.icon} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-main" />
                    {t('badgeColor')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={iconBgColor.startsWith('#') ? iconBgColor : '#5B4B8A'}
                      onChange={(e) => setIconBgColor(e.target.value)}
                      className="h-10 w-10 p-1 rounded-xl border border-border/60 bg-background cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={iconBgColor}
                      onChange={(e) => setIconBgColor(e.target.value)}
                      placeholder="#5B4B8A"
                      className="flex-1 h-10 px-3 font-mono uppercase text-xs rounded-xl border border-border/60 bg-background"
                    />
                  </div>

                  {/* Preset Colors */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {t('popularColors')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setIconBgColor(c)}
                          className="h-6 w-6 rounded-lg transition-transform hover:scale-110 relative flex items-center justify-center border border-black/10 shadow-2xs"
                          style={{ backgroundColor: c }}
                        >
                          {iconBgColor.toLowerCase() === c.toLowerCase() && (
                            <Check className="h-3 w-3 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timing / Advance Days (Only if applicable - NO channels fallback) */}
                {showLeadDays && (
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {t('leadDays')}
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={daysBefore}
                        onChange={(e) =>
                          setDaysBefore(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="3"
                        className="w-full h-10 px-3 rounded-xl border border-amber-500/30 bg-card text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {t('leadDaysDesc')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-card flex items-center justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-xs font-bold"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="action"
                disabled={updateMutation.isPending}
                className="h-10 px-6 text-xs font-bold"
              >
                {updateMutation.isPending
                  ? isRtl
                    ? 'جاري الحفظ...'
                    : 'Saving...'
                  : t('saveChanges')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
