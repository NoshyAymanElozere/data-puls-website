import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { ImageUpload } from '@/shared/components/image-upload'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { ONBOARDING_IMAGE_FIELDS, type Onboarding, type OnboardingImageField } from '../api/useOnboardings'
import { getInitialValues } from './validationSchema'

interface OnboardingsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: Onboarding | null
  detail?: Onboarding | null
  detailLoading?: boolean
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

const IMAGE_LABELS: Record<OnboardingImageField, string> = {
  image_ar_light: 'onboardingImageArLight',
  image_ar_dark: 'onboardingImageArDark',
  image_en_light: 'onboardingImageEnLight',
  image_en_dark: 'onboardingImageEnDark',
}

export function OnboardingsFormModal({
  open,
  onOpenChange,
  editingItem,
  detail,
  detailLoading = false,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: OnboardingsFormModalProps) {
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
      size="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ONBOARDING_IMAGE_FIELDS.map((field) => (
            <ImageUpload
              key={field}
              name={field}
              label={t(IMAGE_LABELS[field])}
              currentImageUrl={source?.[`${field}_url`] || undefined}
              disabled={isViewOnly}
              aspectRatio="aspect-video h-40"
            />
          ))}
        </div>
      </div>
    </ModalStatus>
  )
}
