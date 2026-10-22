import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { CityFormCountryField } from './CityFormCountryField'
import type { City } from '../../api/useCities'
import { getInitialValues } from './validationSchema'

interface CitiesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: City | null
  detail?: City | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function CitiesFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: CitiesFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()
  const isRtl = i18n.language === 'ar'

  const source = detail ?? editingItem

  const ensureCountry =
    source?.country_id != null
      ? {
          id: source.country_id,
          name: source.country?.name ?? String(source.country_id),
        }
      : null

  useEffect(() => {
    if (!open) return
    if (editingItem?.id && detailLoading) return
    reset(getInitialValues(source))
  }, [open, editingItem?.id, detailLoading, source, reset])

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
      size="lg"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName') || 'Arabic Name'} required disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName') || 'English Name'} required disabled={isViewOnly} />
        </div>
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <CityFormCountryField disabled={isViewOnly} ensureOption={ensureCountry} />
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
        </div>
      </div>
    </ModalStatus>
  )
}
