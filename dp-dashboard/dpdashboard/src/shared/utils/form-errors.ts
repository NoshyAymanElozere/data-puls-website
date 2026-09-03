import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { getValidationErrors } from '@/shared/services/axios'

export function applyValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  const errors = getValidationErrors(error)
  if (!errors) return false

  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, { type: 'server', message: messages[0] })
  })

  return true
}
