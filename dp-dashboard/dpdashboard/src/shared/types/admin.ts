export interface AdminPermission {
  name: string
  label: string
}

export interface Admin {
  id: number
  name: string
  email: string
  permissions?: AdminPermission[]
}

export interface ChangePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}
