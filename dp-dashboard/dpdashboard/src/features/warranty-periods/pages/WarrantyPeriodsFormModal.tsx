import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import type { WarrantyPeriod } from '../api/useWarrantyPeriods'
import { getInitialValues } from './validationSchema'

interface WarrantyPeriodsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: WarrantyPeriod | null
  detail?: WarrantyPeriod | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function WarrantyPeriodsFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: WarrantyPeriodsFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()
  const source = detail ?? editingItem

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
      size="lg"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField
            name="duration"
            label={t('duration')}
            type="number"
            required
            disabled={isViewOnly}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('unit')} *
            </label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isViewOnly}
                  className="h-10 px-3 rounded-xl border border-border/60 bg-card text-sm font-semibold disabled:bg-gray-100/80 disabled:cursor-not-allowed"
                >
                  <option value="month">{t('month')}</option>
                  <option value="year">{t('year')}</option>
                </select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField
            name="nameAr"
            label={t('arabicName')}
            disabled={isViewOnly}
          />
          <BaseInputField
            name="nameEn"
            label={t('englishName')}
            disabled={isViewOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField
            name="sort_order"
            label={t('sortOrder')}
            type="number"
            disabled={isViewOnly}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('status')}
            </label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <StatusDropdown
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isViewOnly}
                  usePortal={false}
                />
              )}
            />
          </div>
        </div>
      </div>
    </ModalStatus>
  )
}
