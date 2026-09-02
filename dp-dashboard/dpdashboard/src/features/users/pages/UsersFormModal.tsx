import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { Avatar } from '@/shared/components/misc'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { UserSubscriptionsPanel } from '../components/UserSubscriptionsPanel'
import type { UserDetail } from '../api/useUsers'
import { getInitialValues } from './validationSchema'

interface UsersFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: UserDetail | null
  detail?: UserDetail | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value ?? '-'}</span>
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
}: UsersFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()
  const isRtl = i18n.language === 'ar'
  const source = detail ?? editingItem

  useEffect(() => {
    if (open) {
      reset(getInitialValues(source))
    }
  }, [source, open, reset])

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
      agreeLabel={isViewOnly ? t('close') : t('save')}
      cancelLabel={isViewOnly ? undefined : t('cancel')}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading || detailLoading}
      size={isViewOnly ? 'xl' : 'lg'}
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        {isViewOnly && source && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-2 border-b border-border/40">
              <Avatar
                src={resolveMediaUrl(source.avatar_url)}
                alt={source.email}
                className="h-14 w-14"
              />
              <div>
                <p className="text-sm font-bold text-foreground">{source.email}</p>
                <p className="text-xs text-muted-foreground">{source.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label={t('gender')} value={source.gender_label ?? '-'} />
              <DetailField label={t('age')} value={source.age ?? '-'} />
              <DetailField label={t('birthDate')} value={source.birth_date ?? '-'} />
              <DetailField label={t('preferredLanguage')} value={source.preferred_language ?? '-'} />
              <DetailField label={t('status')} value={source.status_label} />
              <DetailField label={t('registeredAt')} value={source.created_at} />
              <DetailField label={t('registrationCompletedAt')} value={source.registration_completed_at ?? '-'} />
              <DetailField label={t('phoneVerifiedAt')} value={source.phone_verified_at ?? '-'} />
              <DetailField label={t('lastLoginAt')} value={source.last_login_at ?? '-'} />
              <DetailField label={t('updatedAt')} value={source.updated_at} />
            </div>
            {detail && <UserSubscriptionsPanel user={detail} />}
          </div>
        )}

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
