import type { Translatable } from '@/shared/types/laravel'

export interface UserCategoryItem {
  id: number
  name: string | Translatable
  description?: string | Translatable | null
  icon: string
  icon_bg_color: string
  slug: string
  is_default: boolean
  parent_name?: string | Translatable | null
  parent_id: number | null
  invoices_count: number
  is_active: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface UserCategoryDetail {
  id: number
  name: string | Translatable
  description?: string | Translatable | null
  icon: string
  icon_bg_color: string
  slug: string
  is_default: boolean
  user_id: number
  user?: {
    id: number
    name: string
    email: string
  } | null
  parent_id: number | null
  allows_subcategories?: boolean
  is_active: boolean
  sort_order?: number
  parent?: unknown | null
  children?: unknown[]
  created_at?: string
  updated_at?: string
}

export interface UserCategoryFormValues {
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  icon: string
  icon_bg_color: string
  parent_id?: number | null
  is_active: boolean
  sort_order?: number
}
