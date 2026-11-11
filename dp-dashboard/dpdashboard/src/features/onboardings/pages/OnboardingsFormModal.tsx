import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { ImageUpload } from '@/shared/components/image-upload'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { cn } from '@/shared/utils/utils'
import {
  ONBOARDING_IMAGE_FIELDS,
  ONBOARDING_MEDIA_TYPES,
  type Onboarding,
  type OnboardingImageField,
  type OnboardingMediaType,
} from '../api/useOnboardings'
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

const MEDIA_HINTS: Record<OnboardingMediaType, string> = {
  image: 'onboardingImageHint',
  video: 'onboardingVideoHint',
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
  const { control, reset, handleSubmit, setValue } = useFormContext()
  const source = detail ?? editingItem
  const mediaType: OnboardingMediaType = useWatch({ control, name: 'type' }) ?? 'image'
  // Saved files of the other type are removed on save, so stop showing them.
  const showsSavedFiles = !source || (source.type ?? 'image') === mediaType
  const typeChanged = !!source && !showsSavedFiles

  const changeType = (next: OnboardingMediaType, onChange: (value: OnboardingMediaType) => void) => {
    if (next === mediaType) return
    onChange(next)
    ONBOARDING_IMAGE_FIELDS.forEach((field) => setValue(field, null))
  }

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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('onboardingMediaType')}
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="inline-flex w-fit rounded-xl border border-border/60 bg-muted/40 p-1">
                {ONBOARDING_MEDIA_TYPES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={isViewOnly}
                    onClick={() => changeType(option, field.onChange)}
                    className={cn(
                      'px-4 h-8 rounded-lg text-xs font-bold transition-colors disabled:cursor-default',
                      field.value === option
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {t(option)}
                  </button>
                ))}
              </div>
            )}
          />
          {typeChanged && !isViewOnly && (
            <p className="text-xs font-semibold text-amber-600">{t('onboardingTypeChangeNote')}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ONBOARDING_IMAGE_FIELDS.map((field) => (
            <ImageUpload
              key={`${field}-${mediaType}`}
              name={field}
              label={t(IMAGE_LABELS[field])}
              currentImageUrl={showsSavedFiles ? source?.[`${field}_url`] || undefined : undefined}
              disabled={isViewOnly}
              aspectRatio="aspect-video h-40"
              mediaType={mediaType}
              hint={t(MEDIA_HINTS[mediaType])}
            />
          ))}
        </div>
      </div>
    </ModalStatus>
  )
}
