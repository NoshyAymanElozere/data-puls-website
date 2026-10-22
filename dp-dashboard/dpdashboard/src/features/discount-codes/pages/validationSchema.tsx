import { z } from 'zod'
import type { DiscountCode } from '../api/useDiscountCodes'
import type { Translatable } from '@/shared/types/laravel'

/** Number inputs: empty means "not set" (null), anything else is coerced. */
const optionalNumber = z
  .preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null
    const n = Number(val)
    return Number.isNaN(n) ? val : n
  }, z.number().nullable().optional())
  .default(null)

export const schema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'requiredField')
      .regex(/^[A-Za-z0-9_-]{3,50}$/, 'discountCodeInvalidFormat'),
    nameEn: z.string().max(150, 'maxLength').optional().default(''),
    nameAr: z.string().max(150, 'maxLength').optional().default(''),
    descriptionEn: z.string().max(500, 'maxLength').optional().default(''),
    descriptionAr: z.string().max(500, 'maxLength').optional().default(''),
    owner_name: z.string().max(255, 'maxLength').optional().default(''),
    owner_contact: z.string().max(255, 'maxLength').optional().default(''),
    type: z.enum(['percentage', 'fixed_amount', 'free_period']),
    value: optionalNumber,
    free_months: optionalNumber,
    subscription_package_id: z.string().optional().default(''),
    billing_period: z.enum(['', 'monthly', 'yearly']).default(''),
    max_uses: optionalNumber,
    max_uses_per_user: z.coerce.number().int().min(1, 'discountCodeMinOne'),
    starts_at: z.string().optional().default(''),
    expires_at: z.string().optional().default(''),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Type-dependent rules mirror StoreDiscountCodeRequest::withValidator
    if (data.type === 'percentage' || data.type === 'fixed_amount') {
      if (data.value == null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'requiredField' })
      } else if (data.type === 'percentage' && (data.value < 1 || data.value > 100)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'discountCodePercentageRange' })
      } else if (data.value <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['value'], message: 'discountCodeValuePositive' })
      }
    }

    if (data.type === 'free_period') {
      if (data.free_months == null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['free_months'], message: 'requiredField' })
      } else if (!Number.isInteger(data.free_months) || data.free_months < 1 || data.free_months > 36) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['free_months'], message: 'discountCodeFreeMonthsRange' })
      }
      if (!data.subscription_package_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['subscription_package_id'],
          message: 'discountCodePackageRequired',
        })
      }
    }

    if (data.max_uses != null && (!Number.isInteger(data.max_uses) || data.max_uses < 1)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['max_uses'], message: 'discountCodeMinOne' })
    }

    // datetime-local values ("YYYY-MM-DDTHH:mm") compare correctly as strings
    if (data.starts_at && data.expires_at && data.expires_at < data.starts_at) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['expires_at'], message: 'discountCodeExpiresBeforeStarts' })
    }
  })

export type DiscountCodeFormValues = z.infer<typeof schema>

function resolveLocale(value: string | Translatable | null | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return lang === 'en' ? value : ''
  return value[lang] || ''
}

export function getInitialValues(item?: Partial<DiscountCode> | null): DiscountCodeFormValues {
  if (!item) {
    return {
      code: '',
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      owner_name: '',
      owner_contact: '',
      type: 'percentage',
      value: null,
      free_months: null,
      subscription_package_id: '',
      billing_period: '',
      max_uses: null,
      max_uses_per_user: 1,
      starts_at: '',
      expires_at: '',
      is_active: true,
    }
  }

  return {
    code: item.code ?? '',
    nameEn: resolveLocale(item.name, 'en'),
    nameAr: resolveLocale(item.name, 'ar'),
    descriptionEn: resolveLocale(item.description, 'en'),
    descriptionAr: resolveLocale(item.description, 'ar'),
    owner_name: item.owner_name ?? '',
    owner_contact: item.owner_contact ?? '',
    type: item.type ?? 'percentage',
    value: item.value ?? null,
    free_months: item.free_months ?? null,
    subscription_package_id: item.subscription_package_id ? String(item.subscription_package_id) : '',
    billing_period: item.billing_period ?? '',
    max_uses: item.max_uses ?? null,
    max_uses_per_user: item.max_uses_per_user ?? 1,
    starts_at: item.starts_at_value ?? '',
    expires_at: item.expires_at_value ?? '',
    is_active: item.is_active ?? true,
  }
}

export const createSchema = schema
export const updateSchema = schema
