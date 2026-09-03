import { z } from 'zod'
import type { City } from '../../api/useCities'

export const schema = z.object({
  nameAr: z.string().min(1, 'requiredField'),
  nameEn: z.string().min(1, 'requiredField'),
  country_id: z.string().min(1, 'requiredField'),
  is_active: z.boolean(),
})

export type CitiesFormValues = z.infer<typeof schema>

export const createSchema = schema
export const updateSchema = schema

export function getInitialValues(editingItem?: Partial<City> | null): CitiesFormValues {
  if (!editingItem) {
    return { nameAr: '', nameEn: '', country_id: '', is_active: true }
  }

  const name = editingItem.name
  const nameEn = typeof name === 'string' ? name : name?.en || ''
  const nameAr = typeof name === 'string' ? name : name?.ar || ''

  return {
    nameAr,
    nameEn,
    country_id: String(editingItem.country_id ?? editingItem.country?.id ?? ''),
    is_active: editingItem.is_active ?? true,
  }
}
