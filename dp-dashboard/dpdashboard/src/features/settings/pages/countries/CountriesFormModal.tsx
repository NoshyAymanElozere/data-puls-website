import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { Country } from '../../api/useCountries'
import { getInitialValues } from './validationSchema'

interface CountriesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Country | null
  detail?: Country | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  toggleCityMutation?: { mutateAsync: (id: number) => Promise<unknown> }
  canToggleCity?: boolean
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function CountriesFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  toggleCityMutation,
  canToggleCity = false,
  loading,
  label,
  isViewOnly = false,
}: CountriesFormModalProps) {
  const { control, reset, handleSubmit } = useFormContext()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const source = detail ?? editingItem
  const cities = detail?.cities ?? []

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
      agreeLabel={isViewOnly ? undefined : t('save') || 'Save'}
      cancelLabel={isViewOnly ? t('close') || 'Close' : t('cancel') || 'Cancel'}
      onAgreeButtonClick={isViewOnly ? undefined : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
      size={isViewOnly ? 'xl' : 'lg'}
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName') || 'Arabic Name'} required disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName') || 'English Name'} required disabled={isViewOnly} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <BaseInputField
            name="iso_code"
            label={t('isoCode') || 'ISO Code'}
            required
            disabled={isViewOnly}
            dir="ltr"
          />
          <BaseInputField
            name="currency_code"
            label={t('currencyCode') || 'Currency Code'}
            required
            disabled={isViewOnly}
            dir="ltr"
          />
          <BaseInputField
            name="phone_code"
            label={t('phoneCode') || 'Phone Code'}
            required
            disabled={isViewOnly}
            dir="ltr"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('status') || 'Status'}
          </label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <StatusToggle
                value={field.value}
                onChange={field.onChange}
                disabled={isViewOnly}
              />
            )}
          />
        </div>

        {isViewOnly && (
          <div className="pt-4 border-t border-border/60">
            <h4 className="text-sm font-bold text-foreground mb-3">
              {t('cities') || 'Cities'}
              {!detailLoading && cities.length > 0 && (
                <span className="ms-2 text-xs font-semibold text-muted-foreground">({cities.length})</span>
              )}
            </h4>
            {detailLoading ? (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-muted/60" />
                ))}
              </div>
            ) : cities.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noCities') || 'No cities in this country.'}</p>
            ) : (
              <ul className="max-h-56 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40 p-1">
                {cities.map((city) => (
                  <li
                    key={city.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {getLocalizedValue(city.name, i18n.language) || '—'}
                    </span>
                    <StatusToggle
                      value={city.is_active}
                      onChange={() => toggleCityMutation?.mutateAsync(city.id)}
                      disabled={!canToggleCity || !toggleCityMutation}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ModalStatus>
  )
}
