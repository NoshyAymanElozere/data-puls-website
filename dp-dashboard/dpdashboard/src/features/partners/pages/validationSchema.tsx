import { z } from 'zod'
import i18n from '@/shared/i18n/i18n'
import type { Translatable } from '@/shared/types/laravel'
import type { PartnerDetail } from '../api/usePartners'

/** Backend rule: `logo` image max 2048 KB. */
const MAX_LOGO_BYTES = 2048 * 1024

export const schema = z.object({
  nameEn: z.string().trim().min(1, 'requiredField').max(200, 'maxLength'),
  nameAr: z.string().trim().min(1, 'requiredField').max(200, 'maxLength'),
  partner_sector_id: z.string().min(1, 'requiredField'),
  city_id: z.string().min(1, 'requiredField'),
  descriptionEn: z.string().max(1000, 'maxLength'),
  descriptionAr: z.string().max(1000, 'maxLength'),
  addressEn: z.string().max(500, 'maxLength'),
  addressAr: z.string().max(500, 'maxLength'),
  map_url: z.union([z.literal(''), z.string().trim().url('invalidUrl').max(2048, 'maxLength')]),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
  logo: z
    .any()
    .nullable()
    .optional()
    // ImageUpload renders the raw message, so resolve the translation at validation time.
    .refine(
      (file) => !(file instanceof File) || file.size <= MAX_LOGO_BYTES,
      () => ({ message: i18n.t('partnerLogoTooLarge') })
    ),
  remove_logo: z.boolean(),
})

export type PartnerFormValues = z.infer<typeof schema>

function resolveLocale(value: string | Translatable | null | undefined, lang: 'en' | 'ar'): string {
  if (!value || typeof value === 'string') return ''
  return value[lang] || ''
}

export function getInitialValues(item?: Partial<PartnerDetail> | null): PartnerFormValues {
  return {
    nameEn: resolveLocale(item?.name, 'en'),
    nameAr: resolveLocale(item?.name, 'ar'),
    partner_sector_id: item?.partner_sector_id ? String(item.partner_sector_id) : '',
    city_id: item?.city_id ? String(item.city_id) : '',
    descriptionEn: resolveLocale(item?.description, 'en'),
    descriptionAr: resolveLocale(item?.description, 'ar'),
    addressEn: resolveLocale(item?.address, 'en'),
    addressAr: resolveLocale(item?.address, 'ar'),
    map_url: item?.map_url ?? '',
    sort_order: item?.sort_order ?? 0,
    is_active: item?.is_active ?? true,
    logo: null,
    remove_logo: false,
  }
}
