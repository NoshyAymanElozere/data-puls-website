import { z } from 'zod'
import type { UserDetail, UserGender, UserStatus, PreferredLanguage } from '../api/useUsers'

const genderSchema = z.enum(['male', 'female']).nullable().optional()
const languageSchema = z.enum(['ar', 'en']).nullable().optional()
const statusSchema = z.enum(['active', 'suspended'])

export const schema = z.object({
  email: z.string().min(1, 'requiredField').email('invalidEmail'),
  phone: z.string().min(1, 'requiredField'),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
  birth_date: z.string().nullable().optional(),
  gender: genderSchema,
  preferred_language: languageSchema,
  status: statusSchema,
})

export type UserFormValues = z.infer<typeof schema>

export function getInitialValues(editingItem?: Partial<UserDetail> | null): UserFormValues {
  return {
    email: editingItem?.email ?? '',
    phone: editingItem?.phone ?? '',
    password: '',
    password_confirmation: '',
    birth_date: editingItem?.birth_date ?? '',
    gender: (editingItem?.gender as UserGender | null | undefined) ?? null,
    preferred_language: (editingItem?.preferred_language as PreferredLanguage | null | undefined) ?? null,
    status: (editingItem?.status as UserStatus | undefined) ?? 'active',
  }
}

export const createSchema = schema
  .refine((data) => !!data.password && data.password.length >= 8, {
    message: 'passwordMinLength',
    path: ['password'],
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'passwordMismatch',
    path: ['password_confirmation'],
  })

export const updateSchema = schema.refine(
  (data) => {
    if (!data.password) return true
    return data.password.length >= 8 && data.password === data.password_confirmation
  },
  (data) => ({
    message: !data.password || data.password.length < 8 ? 'passwordMinLength' : 'passwordMismatch',
    path: [!data.password || data.password.length < 8 ? 'password' : 'password_confirmation'],
  })
)
