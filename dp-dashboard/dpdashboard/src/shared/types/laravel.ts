export interface LaravelPaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface LaravelPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: LaravelPaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface LaravelPaginatedResponse<T> {
  data: T[]
  links: LaravelPaginationLink[]
  meta: LaravelPaginationMeta
}

export interface Translatable {
  en: string
  ar: string
}

export interface SuccessResponse<T> {
  success: boolean
  message?: string
  data: T
}
