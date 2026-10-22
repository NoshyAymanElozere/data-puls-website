export interface InvoiceCategory {
  id: number
  name: {
    en: string
    ar: string
  } | string
}

export interface InvoiceCreator {
  id: number
  name: string
  avatar_url?: string | null
}

export interface InvoiceProduct {
  id: number
  name: string
  quantity: number
  unit_price: number
  total_price: number
  warranty_period_name: string | null
  warranty_end_date: string | null
}

export interface InvoiceReturnExchange {
  is_applicable: boolean
  period_days: number | null
  end_date: string | null
  is_expired: boolean | null
}

export interface InvoiceAttachment {
  url: string
  name: string
  mime_type: string | null
  size: number
  is_image: boolean
}

export interface InvoiceListItem {
  id: number
  invoice_number: string
  store_name: string
  image: string | null
  attachment?: InvoiceAttachment | null
  purchase_date: string
  total_amount: number
  category_id?: number | null
  subcategory_id?: number | null
  category?: InvoiceCategory | null
  subcategory?: InvoiceCategory | null
  has_warranty: boolean
  return_period_days?: number | null
  exchange_period_days?: number | null
  return?: InvoiceReturnExchange | null
  exchange?: InvoiceReturnExchange | null
  creator?: InvoiceCreator | null
  products_count?: number
  products?: InvoiceProduct[]
  created_at?: string
}

export interface InvoiceDetail extends InvoiceListItem {
  products: InvoiceProduct[]
}
