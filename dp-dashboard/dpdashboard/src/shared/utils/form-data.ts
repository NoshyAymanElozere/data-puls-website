export function appendTranslatable(formData: FormData, field: string, value: { en: string; ar: string }) {
  formData.append(`${field}[en]`, value.en)
  formData.append(`${field}[ar]`, value.ar)
}

/** Normalize File | FileList | array from file inputs into a single File. */
export function resolveUploadFile(value: unknown): File | null {
  if (!value) return null
  if (value instanceof File) return value
  if (value instanceof FileList && value.length > 0) return value[0]
  if (Array.isArray(value) && value[0] instanceof File) return value[0]
  return null
}

export function appendOptionalFile(formData: FormData, field: string, file: unknown) {
  const resolved = resolveUploadFile(file)
  if (resolved) {
    formData.append(field, resolved, resolved.name)
  }
}

export function appendIndexedFields(
  formData: FormData,
  prefix: string,
  index: number,
  fields: Record<string, string | number | boolean | null | undefined>
) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined) continue
    formData.append(`${prefix}[${index}][${key}]`, String(value))
  }
}

export function appendIndexedTranslatable(
  formData: FormData,
  prefix: string,
  index: number,
  field: string,
  value: { en: string; ar: string }
) {
  formData.append(`${prefix}[${index}][${field}][en]`, value.en)
  formData.append(`${prefix}[${index}][${field}][ar]`, value.ar)
}

export function createPutFormData(fields: Record<string, string | number | boolean | File | null | undefined>) {
  const formData = new FormData()
  formData.append('_method', 'PUT')

  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined) continue
    if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}
