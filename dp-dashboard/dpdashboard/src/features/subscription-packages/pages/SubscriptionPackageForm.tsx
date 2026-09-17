import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { BaseInputField } from '@/shared/components/base-input-field'
import { Button } from '@/shared/components/button'
import { FormStatusField } from '@/shared/components/FormStatusField'
import { cn } from '@/shared/utils/utils'
import type { SubscriptionPackageFormValues } from './validationSchema'

interface SubscriptionPackageFormProps {
  disabled?: boolean
}

export function SubscriptionPackageForm({ disabled = false }: SubscriptionPackageFormProps) {
  const { t, i18n } = useTranslation()
  const { control } = useFormContext<SubscriptionPackageFormValues>()
  const isRtl = i18n.language === 'ar'

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: 'features' })

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInputField name="nameAr" label={t('arabicName')} required disabled={disabled} />
        <BaseInputField name="nameEn" label={t('englishName')} required disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseInputField name="descriptionAr" label={`${t('description')} (${t('arabicName')})`} disabled={disabled} />
        <BaseInputField name="descriptionEn" label={`${t('description')} (${t('englishName')})`} disabled={disabled} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseInputField
          name="maximum_family_members"
          label={t('maximumFamilyMembers')}
          type="number"
          required
          disabled={disabled}
        />

        <Controller
          name="maximum_invoices"
          control={control}
          render={({ field, fieldState: { error } }) => {
            const isUnlimited = field.value === null || field.value === undefined
            const rawError = error?.message
            const displayError = rawError ? t(rawError) : undefined

            return (
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t('maximumInvoices')}
                  </label>
                  <label
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium cursor-pointer select-none transition-colors',
                      isUnlimited ? 'text-main font-semibold' : 'text-muted-foreground hover:text-foreground',
                      disabled && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isUnlimited}
                      disabled={disabled}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange(null)
                        } else {
                          field.onChange(0)
                        }
                      }}
                      className="h-3.5 w-3.5 rounded border-border text-main focus:ring-main cursor-pointer"
                    />
                    <span>{t('unlimited')}</span>
                  </label>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={0}
                    dir="ltr"
                    disabled={disabled || isUnlimited}
                    value={isUnlimited ? '' : (field.value ?? '')}
                    onChange={(e) => {
                      const val = e.target.value
                      field.onChange(val === '' ? '' : Number(val))
                    }}
                    placeholder={isUnlimited ? t('unlimited') : '0'}
                    className={cn(
                      'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-main focus:border-main transition-all',
                      displayError && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
                      (disabled || isUnlimited) &&
                        'bg-gray-100/80 border-gray-200/80 text-gray-600 opacity-95 cursor-not-allowed select-none shadow-none focus:ring-0 focus:border-gray-200/80'
                    )}
                    style={{
                      fontVariantNumeric: 'lining-nums tabular-nums',
                      fontFeatureSettings: '"lnum" on, "tnum" on',
                    }}
                  />
                </div>
                {displayError && <p className="text-xs text-rose-500 font-semibold">{displayError}</p>}
              </div>
            )
          }}
        />

        <BaseInputField name="sort_order" label={t('sortOrder')} type="number" disabled={disabled} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('status')}</label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <FormStatusField value={field.value} onChange={field.onChange} disabled={disabled} />
            )}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">{t('prices')}</h3>
        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInputField
              name="monthly_price"
              label={t('monthly')}
              type="number"
              required
              disabled={disabled}
            />
            <BaseInputField
              name="yearly_price"
              label={t('yearly')}
              type="number"
              required
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{t('features')}</h3>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendFeature({
                  nameEn: '',
                  nameAr: '',
                  descriptionEn: '',
                  descriptionAr: '',
                  type: 'main_feature',
                  is_active: true,
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" /> {t('addFeature')}
            </Button>
          )}
        </div>

        {featureFields.length === 0 && (
          <p className="text-xs text-muted-foreground">{t('noFeatures')}</p>
        )}

        {featureFields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-border/60 p-4 space-y-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                {t('features')} #{index + 1}
              </span>
              {!disabled && (
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeFeature(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <BaseInputField name={`features.${index}.nameAr`} label={t('arabicName')} required disabled={disabled} />
              <BaseInputField name={`features.${index}.nameEn`} label={t('englishName')} required disabled={disabled} />
              <BaseInputField
                name={`features.${index}.descriptionAr`}
                label={`${t('description')} (${t('arabicName')})`}
                disabled={disabled}
              />
              <BaseInputField
                name={`features.${index}.descriptionEn`}
                label={`${t('description')} (${t('englishName')})`}
                disabled={disabled}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('type')}</label>
                <Controller
                  name={`features.${index}.type`}
                  control={control}
                  render={({ field: f }) => (
                    <select
                      {...f}
                      disabled={disabled}
                      className="h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
                    >
                      <option value="main_feature">{t('mainFeature')}</option>
                      <option value="sharing_feature">{t('sharingFeature')}</option>
                    </select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('status')}</label>
                <Controller
                  name={`features.${index}.is_active`}
                  control={control}
                  render={({ field: f }) => (
                    <FormStatusField value={f.value} onChange={f.onChange} disabled={disabled} />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
