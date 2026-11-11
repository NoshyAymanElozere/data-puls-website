import { z } from 'zod'
import i18n from '@/shared/i18n/i18n'
import { ONBOARDING_MEDIA_TYPES, ONBOARDING_VIDEO_MODES, type Onboarding } from '../api/useOnboardings'

export const schema = z
  .object({
    sort_order: z.coerce.number().min(0),
    is_active: z.boolean(),
    type: z.enum(ONBOARDING_MEDIA_TYPES),
    video_mode: z.enum(ONBOARDING_VIDEO_MODES).nullable(),
    image_ar_light: z.any().nullable().optional(),
    image_ar_dark: z.any().nullable().optional(),
    image_en_light: z.any().nullable().optional(),
    image_en_dark: z.any().nullable().optional(),
    video: z.any().nullable().optional(),
    video_ar: z.any().nullable().optional(),
    video_en: z.any().nullable().optional(),
  })
  .superRefine((values, ctx) => {
    // The admin must say explicitly whether there is one video per language or one for both.
    if (values.type === 'video' && !values.video_mode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video_mode'],
        message: i18n.t('onboardingVideoModeRequired'),
      })
    }
  })

export type OnboardingFormValues = z.infer<typeof schema>

export function getInitialValues(editingItem?: Partial<Onboarding> | null): OnboardingFormValues {
  return {
    sort_order: editingItem?.sort_order ?? 0,
    is_active: editingItem?.is_active ?? true,
    type: editingItem?.type ?? 'image',
    video_mode: editingItem?.video_mode ?? null,
    image_ar_light: null,
    image_ar_dark: null,
    image_en_light: null,
    image_en_dark: null,
    video: null,
    video_ar: null,
    video_en: null,
  }
}

export const createSchema = schema
export const updateSchema = schema
