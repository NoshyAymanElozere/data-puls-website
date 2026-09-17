import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import {
  Send,
  Users,
  User,
  Radio,
  ScrollText,
  Settings as SettingsIcon,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { ModalStatus } from '@/shared/components/modal-status'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import type { UserListItem } from '@/features/users/api/useUsers'
import { EVENT_CATALOG, PRESET_ICONS, PRESET_COLORS } from '../settings/eventTokensCatalog'
import { useSendNotification } from '../../api/useSendNotification'
import { UserAutocompleteSelect } from '../../components/UserAutocompleteSelect'
import { NotificationLivePreview } from '../../components/NotificationLivePreview'

export default function SendNotificationPage() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const navigate = useNavigate()
  const { data: admin } = useProfile()

  const canSend = hasPermission(admin, 'notification_logs.create')

  // Form states
  const [targetType, setTargetType] = useState<'all' | 'single'>('all')
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)

  const [category, setCategory] = useState<string>('general')

  const [titleEn, setTitleEn] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [bodyEn, setBodyEn] = useState('')
  const [bodyAr, setBodyAr] = useState('')

  const [icon, setIcon] = useState('fa-solid fa-bell')
  const [iconBgColor, setIconBgColor] = useState('#5B4B8A')

  // Modals & Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const sendMutation = useSendNotification()

  // Handle category change to load recommended icon & color
  const handleCategoryChange = (catKey: string) => {
    setCategory(catKey)
    const cat = EVENT_CATALOG[catKey]
    if (cat?.defaultIcon) setIcon(cat.defaultIcon)
    if (cat?.defaultColor) setIconBgColor(cat.defaultColor)
  }

  const validateForm = () => {
    const errs: Record<string, string> = {}

    if (targetType === 'single' && !selectedUser) {
      errs.user = t('recipientRequired') || 'Please select a recipient user.'
    }
    if (!titleAr.trim()) {
      errs.titleAr = (t('titleAr') || 'Arabic Title') + ' ' + (t('isRequired') || 'is required')
    }
    if (!titleEn.trim()) {
      errs.titleEn = (t('titleEn') || 'English Title') + ' ' + (t('isRequired') || 'is required')
    }
    if (!bodyAr.trim()) {
      errs.bodyAr = (t('bodyAr') || 'Arabic Body') + ' ' + (t('isRequired') || 'is required')
    }
    if (!bodyEn.trim()) {
      errs.bodyEn = (t('bodyEn') || 'English Body') + ' ' + (t('isRequired') || 'is required')
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleReset = () => {
    setTargetType('all')
    setSelectedUser(null)
    setCategory('general')
    setTitleEn('')
    setTitleAr('')
    setBodyEn('')
    setBodyAr('')
    setIcon('fa-solid fa-bell')
    setIconBgColor('#5B4B8A')
    setErrors({})
  }

  const executeDispatch = () => {
    sendMutation.mutate(
      {
        target_type: targetType,
        user_id: targetType === 'single' ? selectedUser?.id : null,
        title: {
          en: titleEn,
          ar: titleAr,
        },
        body: {
          en: bodyEn,
          ar: bodyAr,
        },
        type: category,
        icon,
        icon_bg_color: iconBgColor,
        action_type: null,
        action_id: null,
        action_url: null,
      },
      {
        onSuccess: () => {
          setIsConfirmModalOpen(false)
          navigate('/notification-logs')
        },
      }
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (targetType === 'all') {
      setIsConfirmModalOpen(true)
    } else {
      executeDispatch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-main/10 text-main border border-main/20">
              <Send className="h-4 w-4" />
            </div>
            {t('sendNotification')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t('sendNotificationDesc')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/notification-logs">
            <Button variant="outline" size="sm" className="h-9 text-xs font-bold gap-1.5">
              <ScrollText className="h-3.5 w-3.5" />
              {t('notificationLogs')}
            </Button>
          </Link>
          <Link to="/notification-settings">
            <Button variant="outline" size="sm" className="h-9 text-xs font-bold gap-1.5">
              <SettingsIcon className="h-3.5 w-3.5" />
              {t('notificationSettings')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Permission Warning */}
      {!canSend && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <span>{t('noSendPermission')}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Preview Right */}
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form Fields (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Target Audience */}
            <Card className="border-border/60 shadow-xs rounded-2xl">
              <CardHeader className="pb-3 border-b border-border/40 px-6 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-main" />
                  {t('targetAudience')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* All Users Option */}
                  <div
                    onClick={() => {
                      setTargetType('all')
                      setErrors((prev) => ({ ...prev, user: '' }))
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      targetType === 'all'
                        ? 'border-main bg-main/5 text-foreground'
                        : 'border-border/80 hover:border-border text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        targetType === 'all' ? 'border-main' : 'border-muted-foreground'
                      }`}
                    >
                      {targetType === 'all' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-main" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {t('broadcastToAll')}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {t('broadcastToAllDesc')}
                      </p>
                    </div>
                  </div>

                  {/* Single User Option */}
                  <div
                    onClick={() => setTargetType('single')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      targetType === 'single'
                        ? 'border-main bg-main/5 text-foreground'
                        : 'border-border/80 hover:border-border text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        targetType === 'single' ? 'border-main' : 'border-muted-foreground'
                      }`}
                    >
                      {targetType === 'single' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-main" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {t('singleUser')}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {t('singleUserDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recipient Autocomplete when single */}
                {targetType === 'single' && (
                  <div className="pt-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {t('selectRecipient')} <span className="text-rose-500">*</span>
                    </label>
                    <UserAutocompleteSelect
                      selectedUser={selectedUser}
                      onSelectUser={(u) => {
                        setSelectedUser(u)
                        if (u) setErrors((prev) => ({ ...prev, user: '' }))
                      }}
                      disabled={!canSend}
                    />
                    {errors.user && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.user}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Notification Content (Bilingual) */}
            <Card className="border-border/60 shadow-xs rounded-2xl">
              <CardHeader className="pb-3 border-b border-border/40 px-6 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-main" />
                  {t('notificationContent')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Arabic Title */}
                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>{t('titleAr')} <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-muted-foreground font-mono">{titleAr.length}/100</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={titleAr}
                      disabled={!canSend}
                      onChange={(e) => {
                        setTitleAr(e.target.value)
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, titleAr: '' }))
                      }}
                      placeholder="أدخل عنوان الإشعار بالعربية..."
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
                    />
                    {errors.titleAr && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.titleAr}</p>
                    )}
                  </div>

                  {/* English Title */}
                  <div className="space-y-1.5" dir="ltr">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>{t('titleEn')} <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-muted-foreground font-mono">{titleEn.length}/100</span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={titleEn}
                      disabled={!canSend}
                      onChange={(e) => {
                        setTitleEn(e.target.value)
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, titleEn: '' }))
                      }}
                      placeholder="Enter notification title in English..."
                      className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
                    />
                    {errors.titleEn && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.titleEn}</p>
                    )}
                  </div>
                </div>

                {/* Bodies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Arabic Body */}
                  <div className="space-y-1.5" dir="rtl">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>{t('bodyAr')} <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-muted-foreground font-mono">{bodyAr.length}/500</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={bodyAr}
                      disabled={!canSend}
                      onChange={(e) => {
                        setBodyAr(e.target.value)
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, bodyAr: '' }))
                      }}
                      placeholder="اكتب تفاصيل الإشعار المرسل للمستخدمين بالعربية..."
                      className="w-full p-3 rounded-xl border border-border/80 bg-card text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all resize-none"
                    />
                    {errors.bodyAr && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.bodyAr}</p>
                    )}
                  </div>

                  {/* English Body */}
                  <div className="space-y-1.5" dir="ltr">
                    <label className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>{t('bodyEn')} <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-muted-foreground font-mono">{bodyEn.length}/500</span>
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={bodyEn}
                      disabled={!canSend}
                      onChange={(e) => {
                        setBodyEn(e.target.value)
                        if (e.target.value.trim()) setErrors((prev) => ({ ...prev, bodyEn: '' }))
                      }}
                      placeholder="Write message details pushed to users in English..."
                      className="w-full p-3 rounded-xl border border-border/80 bg-card text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all resize-none"
                    />
                    {errors.bodyEn && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.bodyEn}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Category & Visual Branding */}
            <Card className="border-border/60 shadow-xs rounded-2xl">
              <CardHeader className="pb-3 border-b border-border/40 px-6 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Radio className="h-4 w-4 text-main" />
                  {t('categoryAndVisuals')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {t('notificationCategory')}
                  </label>
                  <select
                    value={category}
                    disabled={!canSend}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
                  >
                    {Object.values(EVENT_CATALOG).map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {isRtl ? cat.labelAr : cat.labelEn} ({cat.key})
                      </option>
                    ))}
                    <option value="system">System Notification (system)</option>
                    <option value="payment">Payment Notification (payment)</option>
                  </select>
                </div>

                {/* Icon & Color Customization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-border/40">
                  {/* Icon Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">
                      {t('iconClass')}
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: iconBgColor }}
                      >
                        <i className={icon} style={{ fontSize: '15px' }} />
                      </div>
                      <input
                        type="text"
                        value={icon}
                        disabled={!canSend}
                        onChange={(e) => setIcon(e.target.value)}
                        placeholder="fa-solid fa-bell"
                        className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
                      />
                    </div>

                    {/* Preset Icons */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {t('popularIcons')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_ICONS.map((p) => (
                          <button
                            key={p.icon}
                            type="button"
                            onClick={() => setIcon(p.icon)}
                            title={p.label}
                            className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-all ${
                              icon === p.icon
                                ? 'border-main bg-main text-white shadow-xs'
                                : 'border-border/60 hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            <i className={p.icon} style={{ fontSize: '11px' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Badge Color Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground">
                      {t('badgeColor')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={iconBgColor}
                        disabled={!canSend}
                        onChange={(e) => setIconBgColor(e.target.value)}
                        className="h-10 w-10 p-0.5 rounded-xl border border-border/80 bg-card cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={iconBgColor}
                        disabled={!canSend}
                        onChange={(e) => setIconBgColor(e.target.value)}
                        placeholder="#5B4B8A"
                        className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card text-xs font-mono font-semibold uppercase focus:outline-hidden focus:ring-2 focus:ring-main/20 focus:border-main transition-all"
                      />
                    </div>

                    {/* Preset Colors */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {t('popularColors')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setIconBgColor(c)}
                            className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-all ${
                              iconBgColor.toLowerCase() === c.toLowerCase()
                                ? 'scale-110 shadow-sm border-foreground/50'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={sendMutation.isPending}
                className="h-11 px-4 text-xs font-bold gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                {t('resetFilters')}
              </Button>

              <Button
                type="submit"
                disabled={!canSend || sendMutation.isPending}
                className="h-11 px-6 text-xs font-bold gap-2 bg-main hover:bg-main/90 text-white shadow-md rounded-xl"
              >
                <Send className="h-4 w-4" />
                {sendMutation.isPending ? t('sendingNotification') : t('sendNow')}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Mockup Preview */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <NotificationLivePreview
              titleEn={titleEn}
              titleAr={titleAr}
              bodyEn={bodyEn}
              bodyAr={bodyAr}
              icon={icon}
              iconBgColor={iconBgColor}
            />

            {/* Tips / Delivery Info Card */}
            <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 text-xs space-y-2">
              <h5 className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {isRtl ? 'تسليم فوري ومباشر' : 'Instant In-App Delivery'}
              </h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isRtl
                  ? 'يتم تسليم الإشعارات فورياً للمستخدمين وحفظها في صندوق الوارد الخاص بهم بالتطبيق والويب.'
                  : 'Notifications are delivered instantly to active users and saved in their in-app inbox.'}
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal for Broadcast to All */}
      <ModalStatus
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        type="warning"
        title={t('confirmBroadcastTitle')}
        description={t('confirmBroadcastDesc')}
        agreeLabel={t('confirmSendBtn')}
        cancelLabel={t('cancel')}
        loading={sendMutation.isPending}
        onAgreeButtonClick={executeDispatch}
        onCancelButtonClick={() => setIsConfirmModalOpen(false)}
      />
    </div>
  )
}
