import { z } from 'zod'
import type { Onboarding } from '../api/useOnboardings'

export const schema = z.object({
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
  image_ar_light: z.any().nullable().optional(),
  image_ar_dark: z.any().nullable().optional(),
  image_en_light: z.any().nullable().optional(),
  image_en_dark: z.any().nullable().optional(),
})

export type OnboardingFormValues = z.infer<typeof schema>

export function getInitialValues(editingItem?: Partial<Onboarding> | null): OnboardingFormValues {
  return {
    sort_order: editingItem?.sort_order ?? 0,
    is_active: editingItem?.is_active ?? true,
    image_ar_light: null,
    image_ar_dark: null,
    image_en_light: null,
    image_en_dark: null,
  }
}

export const createSchema = schema
export const updateSchema = schema
