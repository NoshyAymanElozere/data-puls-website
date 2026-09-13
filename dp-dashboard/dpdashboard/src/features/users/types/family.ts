export interface FamilyMemberPermissions {
  view_family_invoices: boolean
  delete_own_invoices: boolean
  delete_family_invoices: boolean
}

export interface FamilyRelationBasic {
  id: number
  name: {
    en: string
    ar: string
  } | string
}

export interface AccountOwnerInfo {
  id: number
  name: string
  email?: string
  phone?: string
  avatar_url?: string | null
  family_relation?: FamilyRelationBasic | null
}

export interface FamilyMemberItem {
  id: number
  name: string
  phone: string
  avatar_url: string
  family_relation_id?: number | null
  family_relation?: FamilyRelationBasic | null
  permissions: FamilyMemberPermissions
  status: 'active' | 'suspended'
  created_at: string
}
