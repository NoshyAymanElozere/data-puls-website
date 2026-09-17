import type {
  SubscriptionPackageBillingOption,
  SubscriptionPackageFeature,
  SubscriptionPackagePrice,
  SubscriptionStatus,
} from '@/features/subscription-packages/api/useSubscriptionPackages'

export interface UserSubscriptionPackage {
  id: number
  name: string
  description?: string | null
  maximum_family_members: number
  maximum_invoices?: number | null
  is_active: boolean
  sort_order: number
  prices?: SubscriptionPackagePrice[]
  features?: SubscriptionPackageFeature[]
  created_at?: string
  updated_at?: string
}

export interface UserSubscription {
  id: number
  status: SubscriptionStatus
  status_label: string
  auto_renewal: boolean
  starts_at: string | null
  trial_ends_at: string | null
  ends_at: string | null
  cancelled_at: string | null
  remaining_days: number | null
  billing_option: SubscriptionPackageBillingOption
  package: UserSubscriptionPackage
  created_at: string
  updated_at: string
}
