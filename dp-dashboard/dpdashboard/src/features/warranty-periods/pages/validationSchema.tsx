import { z } from 'zod'
import type { WarrantyPeriod } from '../api/useWarrantyPeriods'
import type { Translatable } from '@/shared/types/laravel'

export const schema = z.object({
  duration: z.coerce.number().min(1, 'minDuration'),
  unit: z.enum(['month', 'year']),
  nameEn: z.string().optional().default(''),
  nameAr: z.string().optional().default(''),
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
})

export type WarrantyPeriodFormValues = z.infer<typeof schema>

function resolveLocale(value: string | Translatable | null | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return lang === 'en' ? value : ''
  return value[lang] || ''
}

export function getInitialValues(editingItem?: Partial<WarrantyPeriod> | null): WarrantyPeriodFormValues {
  if (!editingItem) {
    return {
      duration: 1,
      unit: 'month',
      nameEn: '',
      nameAr: '',
      sort_order: 0,
      is_active: true,
    }
  }

  return {
    duration: editingItem.duration ?? 1,
    unit: editingItem.unit ?? 'month',
    nameEn: resolveLocale(editingItem.name, 'en'),
    nameAr: resolveLocale(editingItem.name, 'ar'),
    sort_order: editingItem.sort_order ?? 0,
    is_active: editingItem.is_active ?? true,
  }
}

export const createSchema = schema
export const updateSchema = schema
