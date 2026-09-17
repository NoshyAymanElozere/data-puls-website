import { z } from 'zod'
import type { SubscriptionPackage } from '../api/useSubscriptionPackages'

const featureSchema = z.object({
  nameEn: z.string().min(1, 'requiredField'),
  nameAr: z.string().min(1, 'requiredField'),
  descriptionEn: z.string().optional().default(''),
  descriptionAr: z.string().optional().default(''),
  type: z.enum(['main_feature', 'sharing_feature']),
  is_active: z.boolean(),
})

export const schema = z.object({
  nameEn: z.string().min(1, 'requiredField'),
  nameAr: z.string().min(1, 'requiredField'),
  descriptionEn: z.string().optional().default(''),
  descriptionAr: z.string().optional().default(''),
  maximum_family_members: z.coerce.number().min(1),
  maximum_invoices: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return null
      const n = Number(val)
      return Number.isNaN(n) ? val : n
    }, z.number().int().min(0).nullable().optional())
    .default(null),
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
  monthly_price: z.coerce.number().min(0),
  yearly_price: z.coerce.number().min(0),
  features: z.array(featureSchema).default([]),
})

export type SubscriptionPackageFormValues = z.infer<typeof schema>

function translatableField(value: string | { en?: string; ar?: string } | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return lang === 'en' ? value : ''
  return value[lang] || ''
}

function pricesToFormFields(prices?: SubscriptionPackage['prices']) {
  const monthly = prices?.find((p) => p.billing_period === 'monthly')
  const yearly = prices?.find((p) => p.billing_period === 'yearly')

  return {
    monthly_price: monthly ? Number(monthly.price) : 0,
    yearly_price: yearly ? Number(yearly.price) : 0,
  }
}

export function getInitialValues(item?: Partial<SubscriptionPackage> | null): SubscriptionPackageFormValues {
  if (!item) {
    return {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      maximum_family_members: 1,
      maximum_invoices: null,
      sort_order: 0,
      is_active: true,
      monthly_price: 0,
      yearly_price: 0,
      features: [],
    }
  }

  const priceFields = pricesToFormFields(item.prices)

  return {
    nameEn: translatableField(item.name, 'en'),
    nameAr: translatableField(item.name, 'ar'),
    descriptionEn: translatableField(item.description, 'en'),
    descriptionAr: translatableField(item.description, 'ar'),
    maximum_family_members: item.maximum_family_members ?? 1,
    maximum_invoices: item.maximum_invoices ?? null,
    sort_order: item.sort_order ?? 0,
    is_active: item.is_active ?? true,
    ...priceFields,
    features:
      item.features?.map((f) => ({
        nameEn: translatableField(f.name, 'en'),
        nameAr: translatableField(f.name, 'ar'),
        descriptionEn: translatableField(f.description, 'en'),
        descriptionAr: translatableField(f.description, 'ar'),
        type: f.type,
        is_active: f.is_active ?? true,
      })) ?? [],
  }
}

export const createSchema = schema
export const updateSchema = schema
