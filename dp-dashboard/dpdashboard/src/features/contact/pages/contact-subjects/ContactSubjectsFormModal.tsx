import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { getInitialValues } from './validationSchema'
import type { ContactSubject } from '../../api/useContactSubjects'

interface ContactSubjectsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: ContactSubject | null
  detail?: ContactSubject | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function ContactSubjectsFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: ContactSubjectsFormModalProps) {
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
      title={editingItem ? `${t('edit')} ${label}` : `${t('add')} ${label}`}
      agreeLabel={isViewOnly ? t('close') || 'Close' : t('save') || 'Save'}
      cancelLabel={t('cancel') || 'Cancel'}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading || detailLoading}
      size="lg"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <BaseInputField name="nameAr" label={t('arabicName') || 'Arabic Name'} required disabled={isViewOnly} />
        <BaseInputField name="nameEn" label={t('englishName') || 'English Name'} required disabled={isViewOnly} />
        <BaseInputField name="sort_order" label={t('sortOrder') || 'Sort Order'} type="number" disabled={isViewOnly} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('status') || 'Status'}</label>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <StatusDropdown value={field.value} onChange={field.onChange} disabled={isViewOnly} usePortal={false} />
            )}
          />
        </div>
      </div>
    </ModalStatus>
  )
}
