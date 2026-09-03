import type { Admin } from '@/shared/types/admin'

export function hasPermission(admin: Admin | undefined, name: string): boolean {
  return admin?.permissions?.some((p) => p.name === name) ?? false
}
