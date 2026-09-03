import { z } from 'zod'
import type { Onboarding } from '../api/useOnboardings'
import type { Translatable } from '@/shared/types/laravel'

export const schema = z.object({
  titleEn: z.string().max(200, 'maxLength').optional().default(''),
  titleAr: z.string().max(200, 'maxLength').optional().default(''),
  descriptionEn: z.string().min(1, 'requiredField').max(5000, 'maxLength'),
  descriptionAr: z.string().min(1, 'requiredField').max(5000, 'maxLength'),
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
  image: z.any().nullable().optional(),
})

export type OnboardingFormValues = z.infer<typeof schema>

function resolveLocale(value: string | Translatable | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return ''
  return value[lang] || ''
}

export function getInitialValues(editingItem?: Partial<Onboarding> | null): OnboardingFormValues {
  if (!editingItem) {
    return {
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      sort_order: 0,
      is_active: true,
      image: null,
    }
  }

  return {
    titleEn: resolveLocale(editingItem.title, 'en'),
    titleAr: resolveLocale(editingItem.title, 'ar'),
    descriptionEn: resolveLocale(editingItem.description, 'en'),
    descriptionAr: resolveLocale(editingItem.description, 'ar'),
    sort_order: editingItem.sort_order ?? 0,
    is_active: editingItem.is_active ?? true,
    image: null,
  }
}

export const createSchema = schema
export const updateSchema = schema
