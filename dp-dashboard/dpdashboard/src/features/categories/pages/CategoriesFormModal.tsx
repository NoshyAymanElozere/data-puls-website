import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import type { Category } from '../api/useCategories'
import { getInitialValues } from './validationSchema'

interface CategoriesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Category | null
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
  parentId?: number | null
  showSlug?: boolean
}

export function CategoriesFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label,
  isViewOnly = false,
  parentId = null,
  showSlug = true,
}: CategoriesFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()

  useEffect(() => {
    if (open) {
      reset(getInitialValues(editingItem, parentId))
    }
  }, [editingItem, open, parentId, reset])

  const isRtl = i18n.language === 'ar'

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? `${t('edit')} ${label}` : `${t('add')} ${label}`}
      agreeLabel={isViewOnly ? t('close') : t('save')}
      cancelLabel={t('cancel')}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
      size="lg"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <BaseInputField name="nameAr" label={t('arabicName')} required disabled={isViewOnly} />
        <BaseInputField name="nameEn" label={t('englishName')} required disabled={isViewOnly} />
        {showSlug && (
          <BaseInputField
            name="slug"
            label={t('slug')}
            disabled={isViewOnly || !!editingItem}
            placeholder="auto-generated"
          />
        )}
        <BaseInputField name="sort_order" label={t('sortOrder')} type="number" disabled={isViewOnly} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('status')}</label>
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
