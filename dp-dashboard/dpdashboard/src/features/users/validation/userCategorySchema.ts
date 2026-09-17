import { z } from 'zod'
import type { UserCategoryDetail, UserCategoryFormValues, UserCategoryItem } from '../types/categories'

export const userCategorySchema = z.object({
  nameEn: z.string().min(1, 'requiredField').max(150, 'maxLength'),
  nameAr: z.string().min(1, 'requiredField').max(150, 'maxLength'),
  descriptionEn: z.string().max(1000, 'maxLength').optional().default(''),
  descriptionAr: z.string().max(1000, 'maxLength').optional().default(''),
  icon: z.string().min(1, 'iconRequired').max(100, 'maxLength').default('fa-solid fa-shapes'),
  icon_bg_color: z
    .string()
    .regex(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, 'invalidHexColor')
    .default('#6366F1'),
  parent_id: z.coerce.number().nullable().optional(),
  sort_order: z.coerce.number().min(0).default(0),
  is_active: z.boolean().default(true),
})

export function getUserCategoryInitialValues(
  item?: Partial<UserCategoryItem | UserCategoryDetail> | null
): UserCategoryFormValues {
  if (!item) {
    return {
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      icon: 'fa-solid fa-shapes',
      icon_bg_color: '#6366F1',
      parent_id: null,
      sort_order: 0,
      is_active: true,
    }
  }

  const name = item.name
  const nameEn = typeof name === 'string' ? name : name?.en || ''
  const nameAr = typeof name === 'string' ? '' : name?.ar || ''

  const desc = item.description
  const descriptionEn = typeof desc === 'string' ? desc : desc?.en || ''
  const descriptionAr = typeof desc === 'string' ? '' : desc?.ar || ''

  return {
    nameEn,
    nameAr: nameAr || nameEn,
    descriptionEn,
    descriptionAr,
    icon: item.icon || 'fa-solid fa-shapes',
    icon_bg_color: item.icon_bg_color || '#6366F1',
    parent_id: item.parent_id ?? null,
    sort_order: item.sort_order ?? 0,
    is_active: item.is_active ?? true,
  }
}
