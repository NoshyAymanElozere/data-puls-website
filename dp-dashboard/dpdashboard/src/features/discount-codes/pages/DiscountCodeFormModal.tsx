import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { FormField } from '@/shared/components/form-fields'
import { FormStatusField } from '@/shared/components/FormStatusField'
import ModalStatus from '@/shared/components/modal-status'
import { useSubscriptionPackagesList } from '@/features/subscription-packages/api/useSubscriptionPackages'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { cn } from '@/shared/utils/utils'
import { DiscountCodeUsersTable } from '../components/DiscountCodeUsersTable'
import {
  AVAILABILITY_LABEL_KEYS,
  DISCOUNT_TYPE_LABEL_KEYS,
  type DiscountCode, type DiscountCodeType } from '../api/useDiscountCodes'
import { getInitialValues, type DiscountCodeFormValues } from './validationSchema'

const DISCOUNT_TYPES: DiscountCodeType[] = ['percentage', 'fixed_amount', 'free_period']

const inputClass =
  'w-full h-10 px-3 rounded-xl border border-border/60 bg-card text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-main focus:border-main disabled:bg-gray-100/80 disabled:cursor-not-allowed dark:disabled:bg-muted/60'

interface DiscountCodeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: DiscountCode | null
  detail?: DiscountCode | null
  detailLoading?: boolean
  onSave: (data: DiscountCodeFormValues) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function DiscountCodeFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: DiscountCodeFormModalProps) {
  const { i18n, t } = useTranslation()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<DiscountCodeFormValues>()
  const source = detail ?? editingItem
  const type = useWatch({ control, name: 'type' })
  const isFreePeriod = type === 'free_period'

  const { data: packagesData } = useSubscriptionPackagesList(1, '', 'true')
  const packages = packagesData?.data ?? []
  // Keep the saved package selectable even if it is inactive / not on the first page
  const savedPackage = source?.package
  const showSavedPackage = !!savedPackage && !packages.some((p) => p.id === savedPackage.id)

  useEffect(() => {
    if (open) {
      reset(getInitialValues(source))
    }
  }, [source, open, reset])

  const isRtl = i18n.language === 'ar'

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
      cancelLabel={t('cancel')}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading || detailLoading}
      size={isViewOnly ? '2xl' : 'xl'}
    >
      <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={t('code')} required error={errors.code?.message}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <input
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  onBlur={field.onBlur}
                  disabled={isViewOnly}
                  dir="ltr"
                  maxLength={50}
                  placeholder="SUMMER25"
                  className={cn(inputClass, 'font-mono tracking-wider uppercase')}
                />
              )}
            />
          </FormField>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('status')}
            </label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <FormStatusField value={field.value} onChange={field.onChange} disabled={isViewOnly} />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName')} disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName')} disabled={isViewOnly} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField
            name="descriptionAr"
            label={`${t('description')} (${t('arabicName')})`}
            disabled={isViewOnly}
          />
          <BaseInputField
            name="descriptionEn"
            label={`${t('description')} (${t('englishName')})`}
            disabled={isViewOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField name="owner_name" label={t('discountCodeOwner')} disabled={isViewOnly} />
          <BaseInputField
            name="owner_contact"
            label={t('discountCodeOwnerContact')}
            dir="ltr"
            disabled={isViewOnly}
          />
        </div>

        <div className="rounded-xl border border-border/60 p-4 bg-muted/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={t('type')} required error={errors.type?.message}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isViewOnly}
                    className={inputClass}
                  >
                    {DISCOUNT_TYPES.map((value) => (
                      <option key={value} value={value}>
                        {t(DISCOUNT_TYPE_LABEL_KEYS[value])}
                      </option>
                    ))}
                  </select>
                )}
              />
            </FormField>

            {isFreePeriod ? (
              <BaseInputField
                name="free_months"
                label={`${t('discountCodeFreeMonths')} *`}
                type="number"
                min={1}
                max={36}
                disabled={isViewOnly}
              />
            ) : (
              <BaseInputField
                name="value"
                label={`${t('discountCodeValue')} (${type === 'percentage' ? '%' : t('discountCodeCurrency')}) *`}
                type="number"
                min={0}
                step="0.01"
                disabled={isViewOnly}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label={t('package')}
              required={isFreePeriod}
              error={errors.subscription_package_id?.message}
            >
              <Controller
                name="subscription_package_id"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={isViewOnly}
                    className={inputClass}
                  >
                    <option value="">{t('discountCodeAnyPackage')}</option>
                    {showSavedPackage && savedPackage && (
                      <option value={String(savedPackage.id)}>
                        {getLocalizedValue(savedPackage.name, i18n.language)}
                      </option>
                    )}
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={String(pkg.id)}>
                        {getLocalizedValue(pkg.name, i18n.language)}
                      </option>
                    ))}
                  </select>
                )}
              />
            </FormField>

            <FormField label={t('billingPeriod')} error={errors.billing_period?.message}>
              <Controller
                name="billing_period"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={isViewOnly}
                    className={inputClass}
                  >
                    <option value="">{t('discountCodeAnyBillingPeriod')}</option>
                    <option value="monthly">{t('monthly')}</option>
                    <option value="yearly">{t('yearly')}</option>
                  </select>
                )}
              />
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField
            name="max_uses"
            label={t('discountCodeMaxUses')}
            type="number"
            min={1}
            placeholder={t('unlimited')}
            disabled={isViewOnly}
          />
          <BaseInputField
            name="max_uses_per_user"
            label={t('discountCodeMaxUsesPerUser')}
            type="number"
            min={1}
            disabled={isViewOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['starts_at', 'expires_at'] as const).map((name) => (
            <FormField
              key={name}
              label={t(name === 'starts_at' ? 'discountCodeStartsAt' : 'discountCodeExpiresAt')}
              error={errors[name]?.message}
            >
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isViewOnly}
                    dir="ltr"
                    className={inputClass}
                  />
                )}
              />
            </FormField>
          ))}
        </div>

        {isViewOnly && source && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-border/60 p-4 bg-muted/20 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t('discountCodeUses')}</p>
              <p className="font-bold">{source.uses_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('discountCodePendingUses')}</p>
              <p className="font-bold">{source.pending_uses_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('discountCodeRemainingUses')}</p>
              <p className="font-bold">{source.remaining_uses ?? t('unlimited')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('discountCodeAvailability')}</p>
              <p className="font-bold">{t(AVAILABILITY_LABEL_KEYS[source.availability])}</p>
            </div>
          </div>
        )}

        {isViewOnly && source && <DiscountCodeUsersTable codeId={source.id} />}
      </div>
    </ModalStatus>
  )
}
