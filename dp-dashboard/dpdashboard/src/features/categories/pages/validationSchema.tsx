import { z } from 'zod'
import type { Category } from '../api/useCategories'

export const baseSchema = z.object({
  nameEn: z.string().min(1, 'requiredField').max(150, 'maxLength'),
  nameAr: z.string().min(1, 'requiredField').max(150, 'maxLength'),
  descriptionEn: z.string().max(1000, 'maxLength').optional().default(''),
  descriptionAr: z.string().max(1000, 'maxLength').optional().default(''),
  icon: z.string().min(1, 'iconRequired').max(100, 'maxLength').default('fa-solid fa-shapes'),
  icon_bg_color: z
    .string()
    .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, 'invalidHexColor')
    .default('#6366F1'),
  slug: z.string().max(100).optional().default(''),
  parent_id: z.coerce.number().nullable().optional(),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

export const createSchema = baseSchema

export const updateSchema = baseSchema.extend({
  icon: z.string().max(100).optional().default('fa-solid fa-shapes'),
  icon_bg_color: z
    .string()
    .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, 'invalidHexColor')
    .optional()
    .default('#6366F1'),
})

export const schema = updateSchema

export type CategoryFormValues = z.infer<typeof baseSchema>

export function getInitialValues(
  editingItem?: Partial<Category> | null,
  parentId?: number | null
): CategoryFormValues {
  if (!editingItem) {
    return {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      icon: 'fa-solid fa-shapes',
      icon_bg_color: '#6366F1',
      slug: '',
      parent_id: parentId ?? null,
      sort_order: 0,
      is_active: true,
    }
  }

  const name = editingItem.name
  const nameEn = typeof name === 'string' ? name : name?.en || ''
  const nameAr = typeof name === 'string' ? '' : name?.ar || ''

  const desc = editingItem.description
  const descriptionEn = typeof desc === 'string' ? desc : desc?.en || ''
  const descriptionAr = typeof desc === 'string' ? '' : desc?.ar || ''

  return {
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    icon: editingItem.icon || 'fa-solid fa-shapes',
    icon_bg_color: editingItem.icon_bg_color || '#6366F1',
    slug: editingItem.slug ?? '',
    parent_id: editingItem.parent_id ?? parentId ?? null,
    sort_order: editingItem.sort_order ?? 0,
    is_active: editingItem.is_active ?? true,
  }
}
