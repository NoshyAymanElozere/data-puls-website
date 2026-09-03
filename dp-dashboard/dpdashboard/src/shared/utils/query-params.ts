/** Build URLSearchParams, skipping empty/null/undefined optional values. */
export function buildQueryParams(entries: Record<string, string | number | boolean | undefined | null>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  return params
}
