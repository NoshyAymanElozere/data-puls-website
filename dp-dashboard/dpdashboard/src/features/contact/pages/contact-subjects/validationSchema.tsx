import { z } from 'zod'
import type { ContactSubject } from '../../api/useContactSubjects'
import type { Translatable } from '@/shared/types/laravel'

export const schema = z.object({
  nameEn: z.string().min(1, 'requiredField'),
  nameAr: z.string().min(1, 'requiredField'),
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
})

export type ContactSubjectFormValues = z.infer<typeof schema>

export function getInitialValues(editingItem?: Partial<ContactSubject> | null): ContactSubjectFormValues {
  if (!editingItem) {
    return { nameEn: '', nameAr: '', sort_order: 0, is_active: true }
  }

  const name = editingItem.name
  const nameEn = typeof name === 'object' && name !== null ? (name as Translatable).en || '' : ''
  const nameAr = typeof name === 'object' && name !== null ? (name as Translatable).ar || '' : ''

  return {
    nameEn,
    nameAr,
    sort_order: editingItem.sort_order ?? 0,
    is_active: editingItem.is_active ?? true,
  }
}

export const createSchema = schema
export const updateSchema = schema
