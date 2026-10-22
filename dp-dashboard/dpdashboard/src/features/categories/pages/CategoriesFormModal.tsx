import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { BaseTextAreaField } from '@/shared/components/base-textarea-field'
import { CategoryIconPicker } from '../components/CategoryIconPicker'
import { Badge } from '@/shared/components/badge'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import type { Category } from '../api/useCategories'
import { getInitialValues } from './validationSchema'

interface CategoriesFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Category | null
  detail?: Category | null
  detailLoading?: boolean
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
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
  parentId = null,
  showSlug = true,
}: CategoriesFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext()

  const source = detail ?? editingItem

  useEffect(() => {
    if (!open) return
    if (editingItem?.id && detailLoading) return
    reset(getInitialValues(source, parentId))
  }, [open, editingItem?.id, detailLoading, source, parentId, reset])

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
      <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 py-1" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Category Type & Creator Info (View or Edit mode) */}
        {source && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">{t('categoryType')}:</span>
              {source.is_default ? (
                <Badge variant="info" dot>
                  {t('systemDefault')}
                </Badge>
              ) : (
                <Badge variant="purple" dot>
                  {t('userCustom')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium">{t('creator')}:</span>
              <span className="font-semibold text-foreground">
                {source.creator_name || editingItem?.creator_name || (source.is_default ? t('systemCreator') : source.user?.name || '—')}
              </span>
              {source.user?.email && (
                <span className="text-muted-foreground/80">({source.user.email})</span>
              )}
            </div>
          </div>
        )}

        {/* Icon & Background Color Picker */}
        <div>
          <CategoryIconPicker disabled={isViewOnly} />
        </div>

        {/* Localized Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName')} required disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName')} required disabled={isViewOnly} />
        </div>

        {/* Localized Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseTextAreaField
            name="descriptionAr"
            label={t('arabicDescription')}
            rows={2}
            disabled={isViewOnly}
          />
          <BaseTextAreaField
            name="descriptionEn"
            label={t('englishDescription')}
            rows={2}
            disabled={isViewOnly}
          />
        </div>

        {showSlug && (
          <BaseInputField
            name="slug"
            label={t('slug')}
            disabled={isViewOnly || !!editingItem}
            placeholder="auto-generated"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </ModalStatus>
  )
}

