import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { BaseInputField } from '@/shared/components/base-input-field'
import { ImageUpload } from '@/shared/components/image-upload'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { cn } from '@/shared/utils/utils'
import {
  ONBOARDING_MEDIA_FIELDS,
  ONBOARDING_MEDIA_TYPES,
  ONBOARDING_VIDEO_MODES,
  onboardingMediaFields,
  type Onboarding,
  type OnboardingMediaField,
  type OnboardingMediaType,
  type OnboardingVideoMode,
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

const FIELD_LABELS: Record<OnboardingMediaField, string> = {
  image_ar_light: 'onboardingImageArLight',
  image_ar_dark: 'onboardingImageArDark',
  image_en_light: 'onboardingImageEnLight',
  image_en_dark: 'onboardingImageEnDark',
  video: 'onboardingVideoBoth',
  video_ar: 'onboardingVideoAr',
  video_en: 'onboardingVideoEn',
}

const MEDIA_HINTS: Record<OnboardingMediaType, string> = {
  image: 'onboardingImageHint',
  video: 'onboardingVideoHint',
}

const VIDEO_MODE_TEXT: Record<OnboardingVideoMode, { title: string; hint: string }> = {
  per_language: { title: 'onboardingVideoModePerLanguage', hint: 'onboardingVideoModePerLanguageHint' },
  shared: { title: 'onboardingVideoModeShared', hint: 'onboardingVideoModeSharedHint' },
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
  const { control, reset, handleSubmit, setValue, clearErrors } = useFormContext()
  const source = detail ?? editingItem
  const mediaType: OnboardingMediaType = useWatch({ control, name: 'type' }) ?? 'image'
  const videoMode: OnboardingVideoMode | null = useWatch({ control, name: 'video_mode' }) ?? null
  const isVideo = mediaType === 'video'
  const fields = onboardingMediaFields(mediaType, videoMode)

  // Saved files of another layout (type or video mode) are removed on save, so stop showing them.
  const sameLayout =
    !!source &&
    (source.type ?? 'image') === mediaType &&
    (mediaType === 'image' || (source.video_mode ?? null) === videoMode)
  const layoutChanged = !!source && !sameLayout && (!isVideo || videoMode !== null)

  const clearFiles = () => ONBOARDING_MEDIA_FIELDS.forEach((field) => setValue(field, null))

  const changeType = (next: OnboardingMediaType, onChange: (value: OnboardingMediaType) => void) => {
    if (next === mediaType) return
    onChange(next)
    // Back on the saved type: restore its mode. A new video slide starts with no mode, so the admin must choose.
    setValue('video_mode', next === 'video' && source?.type === 'video' ? (source.video_mode ?? null) : null)
    clearFiles()
  }

  const changeVideoMode = (next: OnboardingVideoMode, onChange: (value: OnboardingVideoMode) => void) => {
    if (next === videoMode) return
    onChange(next)
    clearErrors('video_mode')
    clearFiles()
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
        </div>

        {isVideo && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('onboardingVideoModeQuestion')}
            </label>
            <Controller
              name="video_mode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
                    {ONBOARDING_VIDEO_MODES.map((option) => {
                      const selected = field.value === option
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          disabled={isViewOnly}
                          onClick={() => changeVideoMode(option, field.onChange)}
                          className={cn(
                            'flex items-start gap-3 rounded-xl border p-3 text-start transition-colors disabled:cursor-default',
                            selected
                              ? 'border-main bg-muted/60'
                              : 'border-border/60 hover:border-main',
                            error && !selected && 'border-rose-500/60'
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                              selected ? 'border-main bg-main text-white' : 'border-border'
                            )}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                          <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-foreground">
                              {t(VIDEO_MODE_TEXT[option].title)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {t(VIDEO_MODE_TEXT[option].hint)}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {error && <p className="text-xs text-rose-500 font-semibold">{error.message}</p>}
                </>
              )}
            />
          </div>
        )}

        {layoutChanged && !isViewOnly && (
          <p className="text-xs font-semibold text-amber-600">{t('onboardingTypeChangeNote')}</p>
        )}

        {fields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <ImageUpload
                key={`${field}-${mediaType}-${videoMode ?? ''}`}
                name={field}
                label={t(FIELD_LABELS[field])}
                currentImageUrl={sameLayout ? source?.[`${field}_url`] || undefined : undefined}
                disabled={isViewOnly}
                aspectRatio="aspect-video h-40"
                mediaType={mediaType}
                hint={t(MEDIA_HINTS[mediaType])}
              />
            ))}
          </div>
        )}
      </div>
    </ModalStatus>
  )
}
