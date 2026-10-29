import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { useActiveCities } from '@/features/settings/api/useCities'
import { usePartnerSectorOptions } from '@/features/partner-sectors/api/usePartnerSectors'
import { BaseInputField } from '@/shared/components/base-input-field'
import { BaseTextAreaField } from '@/shared/components/base-textarea-field'
import { FormStatusField } from '@/shared/components/FormStatusField'
import { ImageUpload } from '@/shared/components/image-upload'
import ModalStatus from '@/shared/components/modal-status'
import type { PartnerDetail, PartnerListItem } from '../api/usePartners'
import { PartnerFormSelectField } from '../components/PartnerFormSelectField'
import { getInitialValues, type PartnerFormValues } from './validationSchema'

interface PartnersFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: PartnerListItem | null
  detail?: PartnerDetail | null
  detailLoading?: boolean
  onSave: (data: PartnerFormValues) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function PartnersFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: PartnersFormModalProps) {
  const { i18n, t } = useTranslation()
  const { control, reset, handleSubmit } = useFormContext<PartnerFormValues>()
  const isRtl = i18n.language === 'ar'

  const { data: sectors = [] } = usePartnerSectorOptions({ activeOnly: true })
  const { data: cities = [] } = useActiveCities()

  const removeLogo = useWatch({ control, name: 'remove_logo' })
  const mapUrl = detail?.map_url

  useEffect(() => {
    if (!open) return
    // Wait for the show endpoint so both languages are filled (list rows only carry the current locale).
    if (editingItem?.id && detailLoading) return
    reset(getInitialValues(detail ?? null))
  }, [open, editingItem?.id, detailLoading, detail, reset])

  const currentLogo = editingItem && !removeLogo ? detail?.logo_url || undefined : undefined

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
      size="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInputField name="nameAr" label={t('arabicName')} required disabled={isViewOnly} />
          <BaseInputField name="nameEn" label={t('englishName')} required disabled={isViewOnly} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <PartnerFormSelectField
            name="partner_sector_id"
            label={t('partnerSector')}
            placeholder={t('choosePartnerSector')}
            options={sectors}
            ensureOption={detail?.sector ?? null}
            disabled={isViewOnly}
          />
          <PartnerFormSelectField
            name="city_id"
            label={t('city')}
            placeholder={t('chooseCity')}
            options={cities}
            ensureOption={detail?.city ?? null}
            disabled={isViewOnly}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseTextAreaField
            name="descriptionAr"
            label={t('arabicDescription')}
            disabled={isViewOnly}
            rows={3}
            maxLength={1000}
            dir="rtl"
          />
          <BaseTextAreaField
            name="descriptionEn"
            label={t('englishDescription')}
            disabled={isViewOnly}
            rows={3}
            maxLength={1000}
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseTextAreaField
            name="addressAr"
            label={t('partnerAddressAr')}
            disabled={isViewOnly}
            rows={2}
            maxLength={500}
            dir="rtl"
          />
          <BaseTextAreaField
            name="addressEn"
            label={t('partnerAddressEn')}
            disabled={isViewOnly}
            rows={2}
            maxLength={500}
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <BaseInputField
            name="map_url"
            label={t('partnerMapUrl')}
            placeholder="https://maps.google.com/..."
            disabled={isViewOnly}
            dir="ltr"
          />
          {isViewOnly && mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-main hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {t('partnerOpenMap')}
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <BaseInputField name="sort_order" label={t('sortOrder')} type="number" min={0} disabled={isViewOnly} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('status')}</label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <FormStatusField value={!!field.value} onChange={field.onChange} disabled={isViewOnly} />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <ImageUpload
            name="logo"
            label={t('partnerLogo')}
            currentImageUrl={currentLogo}
            disabled={isViewOnly}
            aspectRatio="h-32 w-32"
          />
          {!isViewOnly && <p className="text-xs text-muted-foreground">{t('partnerLogoHint')}</p>}
          {!isViewOnly && editingItem && detail?.logo_url && (
            <Controller
              name="remove_logo"
              control={control}
              render={({ field }) => (
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-border/60"
                  />
                  {t('partnerRemoveLogo')}
                </label>
              )}
            />
          )}
        </div>

        {isViewOnly && detail && (
          <dl className="grid grid-cols-2 gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm">
            <div>
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('createdAt')}</dt>
              <dd className="mt-1 font-semibold text-foreground">{detail.created_at || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('updatedAt')}</dt>
              <dd className="mt-1 font-semibold text-foreground">{detail.updated_at || '—'}</dd>
            </div>
          </dl>
        )}
      </div>
    </ModalStatus>
  )
}
