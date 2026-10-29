import { z } from 'zod'
import type { Translatable } from '@/shared/types/laravel'
import type { PartnerSector } from '../api/usePartnerSectors'

export const schema = z.object({
  nameEn: z.string().trim().min(1, 'requiredField').max(150, 'maxLength'),
  nameAr: z.string().trim().min(1, 'requiredField').max(150, 'maxLength'),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
})

export type PartnerSectorFormValues = z.infer<typeof schema>

function resolveLocale(value: string | Translatable | undefined, lang: 'en' | 'ar'): string {
  if (!value || typeof value === 'string') return ''
  return value[lang] || ''
}

export function getInitialValues(item?: Partial<PartnerSector> | null): PartnerSectorFormValues {
  if (!item) {
    return { nameEn: '', nameAr: '', sort_order: 0, is_active: true }
  }

  return {
    nameEn: resolveLocale(item.name, 'en'),
    nameAr: resolveLocale(item.name, 'ar'),
    sort_order: item.sort_order ?? 0,
    is_active: item.is_active ?? true,
  }
}
