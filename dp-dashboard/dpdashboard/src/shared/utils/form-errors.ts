import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getValidationErrors } from '@/shared/services/axios'

/**
 * Apply Laravel 422 errors to react-hook-form fields.
 * `fieldMap` renames API keys to form field names (e.g. `{ 'name.en': 'nameEn' }`).
 */
export function applyValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMap?: Record<string, string>
): boolean {
  const errors = getValidationErrors(error)
  if (!errors) return false

  Object.entries(errors).forEach(([field, messages]) => {
    const target = fieldMap?.[field] ?? field
    setError(target as Path<T>, { type: 'server', message: messages[0] })
  })

  return true
}
