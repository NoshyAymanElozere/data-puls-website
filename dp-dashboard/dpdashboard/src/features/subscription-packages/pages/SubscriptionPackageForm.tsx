import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { BaseInputField } from '@/shared/components/base-input-field'
import { Button } from '@/shared/components/button'
import { FormStatusField } from '@/shared/components/FormStatusField'
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BaseInputField
          name="maximum_family_members"
          label={t('maximumFamilyMembers')}
          type="number"
          required
          disabled={disabled}
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
