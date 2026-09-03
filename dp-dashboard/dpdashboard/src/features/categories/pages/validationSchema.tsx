import { z } from 'zod'
import type { Category } from '../api/useCategories'

export const schema = z.object({
  nameEn: z.string().min(1, 'requiredField'),
  nameAr: z.string().min(1, 'requiredField'),
  slug: z.string().optional().default(''),
  parent_id: z.coerce.number().nullable().optional(),
  sort_order: z.coerce.number().min(0),
  is_active: z.boolean(),
})

export type CategoryFormValues = z.infer<typeof schema>

export function getInitialValues(
  editingItem?: Partial<Category> | null,
  parentId?: number | null
): CategoryFormValues {
  if (!editingItem) {
    return {
      nameEn: '',
      nameAr: '',
      slug: '',
      parent_id: parentId ?? null,
      sort_order: 0,
      is_active: true,
    }
  }

  const name = editingItem.name
  const nameEn = typeof name === 'string' ? name : name?.en || ''
  const nameAr = typeof name === 'string' ? '' : name?.ar || ''

  return {
    nameEn,
    nameAr,
    slug: editingItem.slug ?? '',
    parent_id: editingItem.parent_id ?? parentId ?? null,
    sort_order: editingItem.sort_order ?? 0,
    is_active: editingItem.is_active ?? true,
  }
}

export const createSchema = schema
export const updateSchema = schema
