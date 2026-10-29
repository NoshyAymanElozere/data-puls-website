import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { FormStatusField } from '@/shared/components/FormStatusField'
import ModalStatus from '@/shared/components/modal-status'
import type { PartnerSector } from '../api/usePartnerSectors'
import { getInitialValues, type PartnerSectorFormValues } from './validationSchema'

interface PartnerSectorsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: PartnerSector | null
  detail?: PartnerSector | null
  detailLoading?: boolean
  onSave: (data: PartnerSectorFormValues) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function PartnerSectorsFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: PartnerSectorsFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext<PartnerSectorFormValues>()
  const isRtl = i18n.language === 'ar'
  const source = detail ?? editingItem

  useEffect(() => {
    if (!open) return
    // Wait for the show endpoint so both languages are filled (list rows only carry the current locale).
    if (editingItem?.id && detailLoading) return
    reset(getInitialValues(detail ?? null))
  }, [open, editingItem?.id, detailLoading, detail, reset])

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={
        isViewOnly ? `${t('view')} ${label}` : editingItem ? `${t('edit')} ${label}` : `${t('add')} ${label}`
      }
      agreeLabel={isViewOnly ? undefined : t('save')}
      cancelLabel={isViewOnly ? t('close') : t('cancel')}
      onAgreeButtonClick={isViewOnly ? undefined : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading || (!!editingItem && detailLoading)}
      size="lg"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName')} required disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName')} required disabled={isViewOnly} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <BaseInputField name="sort_order" label={t('sortOrder')} type="number" min={0} disabled={isViewOnly} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('status')}
            </label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <FormStatusField value={!!field.value} onChange={field.onChange} disabled={isViewOnly} />
              )}
            />
          </div>
        </div>

        {isViewOnly && source && (
          <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm">
            <div>
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('partnersCount')}</dt>
              <dd className="mt-1 font-semibold text-foreground">{source.partners_count ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('createdAt')}</dt>
              <dd className="mt-1 font-semibold text-foreground">{source.created_at || '—'}</dd>
            </div>
          </dl>
        )}
      </div>
    </ModalStatus>
  )
}
