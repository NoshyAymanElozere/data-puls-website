export interface FamilyRelationName {
  en: string
  ar: string
}

export interface FamilyRelationListItem {
  id: number
  name: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface FamilyRelationDetail {
  id: number
  name: FamilyRelationName
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
