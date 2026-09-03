import { z } from 'zod'
import type { Country } from '../../api/useCountries'

export const schema = z.object({
  nameAr: z.string().min(1, 'requiredField'),
  nameEn: z.string().min(1, 'requiredField'),
  iso_code: z.string().min(1, 'requiredField').max(3, 'maxLength'),
  currency_code: z.string().min(1, 'requiredField').max(3, 'maxLength'),
  phone_code: z.string().min(1, 'requiredField').max(10, 'maxLength'),
  is_active: z.boolean(),
})

export type CountriesFormValues = z.infer<typeof schema>

export const createSchema = schema
export const updateSchema = schema

export function getInitialValues(editingItem?: Partial<Country> | null): CountriesFormValues {
  if (!editingItem) {
    return {
      nameAr: '',
      nameEn: '',
      iso_code: '',
      currency_code: '',
      phone_code: '',
      is_active: true,
    }
  }

  const name = editingItem.name
  const nameEn = typeof name === 'string' ? name : name?.en || ''
  const nameAr = typeof name === 'string' ? name : name?.ar || ''

  return {
    nameAr,
    nameEn,
    iso_code: editingItem.iso_code || '',
    currency_code: editingItem.currency_code || '',
    phone_code: editingItem.phone_code || '',
    is_active: editingItem.is_active ?? true,
  }
}
