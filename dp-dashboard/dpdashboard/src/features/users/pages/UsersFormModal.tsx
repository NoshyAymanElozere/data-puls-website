import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  CreditCard,
  FileText,
  Globe,
  Mail,
  Package,
  Phone,
  Receipt,
  Shield,
  User as UserIcon,
  Users2,
} from 'lucide-react'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { Avatar } from '@/shared/components/misc'
import { Badge } from '@/shared/components/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/tabs'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { UserSubscriptionsPanel, isUnpaidSubscription } from '../components/UserSubscriptionsPanel'
import { UserInvoicesPanel } from '../components/UserInvoicesPanel'
import { UserFamilyMembersPanel } from '../components/UserFamilyMembersPanel'
import type { UserDetail, UserListItem } from '../api/useUsers'
import { getInitialValues } from './validationSchema'

interface UsersFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: UserListItem | UserDetail | null
  detail?: UserDetail | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
  onSelectUser?: (userId: number) => void
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value?: string | number | null
  icon?: React.ElementType
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/30 border border-border/40">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 opacity-70" />}
        <span>{label}</span>
      </span>
      <span className="text-xs font-bold text-foreground truncate">{value ?? '-'}</span>
    </div>
  )
}

export function UsersFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
  onSelectUser,
}: UsersFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()
  const isRtl = i18n.language === 'ar'
  const source = detail ?? (editingItem as UserDetail | null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (open) {
      reset(getInitialValues(source))
      setActiveTab('overview')
    }
  }, [source, open, reset])

  const invoicesCount = source?.invoices_count ?? 0
  const familyMembersCount = source?.family_members_count ?? 0
  const subscriptionsCount =
    detail?.subscriptions?.filter((s) => !isUnpaidSubscription(s)).length ?? 0

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={
        isViewOnly
          ? `${t('view')} ${label}`
          : editingItem
            ? `${t('edit')} ${label}`
            : `${t('add')} ${label}`
      }
      agreeLabel={isViewOnly ? undefined : (editingItem ? t('save') : t('add'))}
      cancelLabel={isViewOnly ? t('close') : t('cancel')}
      onAgreeButtonClick={isViewOnly ? undefined : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading || detailLoading}
      size={isViewOnly ? '2xl' : 'lg'}
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        {isViewOnly && source && (
          <div className="space-y-4">
            {/* User Header Profile Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-main/10 via-main/5 to-transparent border border-main/20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar
                    src={resolveMediaUrl(source.avatar_url)}
                    alt={source.email}
                    className="h-16 w-16 rounded-2xl border-2 border-main/30 shadow-sm"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                      source.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-foreground">{source.name || source.email}</h3>
                    <Badge
                      variant={source.status === 'active' ? 'default' : 'destructive'}
                      className={
                        source.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]'
                          : 'text-[10px]'
                      }
                    >
                      {source.status_label || source.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {source.email}
                    </span>
                    <span className="flex items-center gap-1" dir="ltr">
                      <Phone className="h-3.5 w-3.5" />
                      {source.phone}
                    </span>
                  </div>
                </div>
              </div>

              {source.is_subscribed && (
                <div className="self-start sm:self-center">
                  <Badge className="bg-main text-white gap-1 py-1 px-3 rounded-xl text-xs font-bold shadow-xs">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>{t('subscribed')}</span>
                  </Badge>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full h-11 bg-muted/60 p-1 rounded-xl">
                {/* 1. Overview Tab */}
                <TabsTrigger
                  value="overview"
                  className="rounded-lg text-xs font-bold gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('overview')}</span>
                </TabsTrigger>

                {/* 2. Invoices Tab */}
                <TabsTrigger
                  value="invoices"
                  className="rounded-lg text-xs font-bold gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>{t('invoices')}</span>
                  {invoicesCount > 0 && (
                    <Badge className="h-4.5 px-1.5 text-[10px] bg-main/15 text-main font-black rounded-md border border-main/20">
                      {invoicesCount}
                    </Badge>
                  )}
                </TabsTrigger>

                {/* 3. Family Members Tab */}
                <TabsTrigger
                  value="family"
                  className="rounded-lg text-xs font-bold gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                >
                  <Users2 className="h-3.5 w-3.5" />
                  <span>{t('familyMembers')}</span>
                  {familyMembersCount > 0 && (
                    <Badge className="h-4.5 px-1.5 text-[10px] bg-main/15 text-main font-black rounded-md border border-main/20">
                      {familyMembersCount}
                    </Badge>
                  )}
                </TabsTrigger>

                {/* 4. Subscriptions Tab */}
                <TabsTrigger
                  value="subscriptions"
                  className="rounded-lg text-xs font-bold gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
                >
                  <Package className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('subscriptions')}</span>
                  {subscriptionsCount > 0 && (
                    <Badge className="h-4.5 px-1.5 text-[10px] bg-muted text-muted-foreground font-black rounded-md">
                      {subscriptionsCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Overview & Profile Content */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailField label={t('gender')} value={source.gender_label ?? source.gender} icon={UserIcon} />
                  <DetailField label={t('age')} value={source.age ? `${source.age} ${t('year')}` : '-'} icon={Calendar} />
                  <DetailField label={t('birthDate')} value={source.birth_date} icon={Calendar} />
                  <DetailField label={t('preferredLanguage')} value={source.preferred_language ? t(source.preferred_language === 'ar' ? 'arabic' : 'english') : '-'} icon={Globe} />
                  <DetailField label={t('registeredAt')} value={source.created_at} icon={Calendar} />
                  <DetailField label={t('registrationCompletedAt')} value={source.registration_completed_at} icon={Calendar} />
                  <DetailField label={t('phoneVerifiedAt')} value={source.phone_verified_at} icon={Phone} />
                  <DetailField label={t('lastLoginAt')} value={source.last_login_at} icon={Calendar} />
                  <DetailField label={t('updatedAt')} value={source.updated_at} icon={Calendar} />
                </div>

                {/* Subscriptions Mini Summary in Overview if active */}
                {detail && detail.active_subscription && (
                  <div className="pt-2">
                    <UserSubscriptionsPanel user={detail} />
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Invoices Content */}
              <TabsContent value="invoices" className="mt-4">
                <UserInvoicesPanel userId={source.id} />
              </TabsContent>

              {/* Tab 3: Family Members Content */}
              <TabsContent value="family" className="mt-4">
                <UserFamilyMembersPanel user={source} onSelectUser={onSelectUser} />
              </TabsContent>

              {/* Tab 4: Subscriptions Content */}
              <TabsContent value="subscriptions" className="mt-4">
                {detail ? (
                  <UserSubscriptionsPanel user={detail} />
                ) : (
                  <div className="py-8 text-center text-xs font-semibold text-muted-foreground">
                    Loading subscriptions...
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Edit / Create Form (when !isViewOnly) */}
        {!isViewOnly && (
          <>
            <BaseInputField name="email" label={t('email')} type="email" required />
            <BaseInputField name="phone" label={t('phone')} required dir="ltr" />
            <BaseInputField
              name="password"
              label={editingItem ? t('passwordOptional') : t('password')}
              type="password"
              required={!editingItem}
            />
            <BaseInputField
              name="password_confirmation"
              label={t('confirmPassword')}
              type="password"
              required={!editingItem}
            />
            <BaseInputField name="birth_date" label={t('birthDate')} type="date" dir="ltr" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t('gender')}
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="h-10 px-3 rounded-xl border border-border/60 bg-card text-sm font-semibold"
                    >
                      <option value="">{t('notSpecified')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                    </select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t('preferredLanguage')}
                </label>
                <Controller
                  name="preferred_language"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="h-10 px-3 rounded-xl border border-border/60 bg-card text-sm font-semibold"
                    >
                      <option value="">{t('notSpecified')}</option>
                      <option value="ar">{t('arabic')}</option>
                      <option value="en">{t('english')}</option>
                    </select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('status')}
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-border/60 bg-card text-sm font-semibold"
                  >
                    <option value="active">{t('active')}</option>
                    <option value="suspended">{t('suspended')}</option>
                  </select>
                )}
              />
            </div>
          </>
        )}
      </div>
    </ModalStatus>
  )
}
