import type { Translatable } from '@/shared/types/laravel'
import type { ColDef, ValueGetterParams } from 'ag-grid-community'

export type LocalizableValue = string | Translatable | null | undefined

/** Resolve a field that is either a locale string from the API or a { en, ar } object. */
export function getLocalizedValue(value: LocalizableValue, lang = 'en'): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const record = value as Translatable
    return lang === 'ar' ? record.ar || record.en || '' : record.en || record.ar || ''
  }
  return String(value)
}

/** Legacy rows that still expose translations[] plus a localized name string. */
export function getLocalizedNameFromRow(
  data: Record<string, unknown> | undefined,
  lang: string,
  field = 'name'
): string {
  if (!data) return ''
  const direct = data[field]
  if (typeof direct === 'string' && direct) return direct

  const translations = data.translations as Array<{ language_id: number; name: string }> | undefined
  if (translations?.length) {
    const languageId = lang === 'ar' ? 2 : 1
    return translations.find((tr) => tr.language_id === languageId)?.name || getLocalizedValue(direct as LocalizableValue, lang)
  }

  return getLocalizedValue(direct as LocalizableValue, lang)
}

function getNestedValue(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, data)
}

/** Standard single-column def for localized name/title fields in AG Grid lists. */
export function localizedNameColumnDef(
  t: (key: string) => string,
  lang: string,
  options?: Partial<ColDef> & { field?: string; headerKey?: string; nested?: boolean }
): ColDef {
  const field = options?.field ?? 'name'
  const headerKey = options?.headerKey ?? 'name'
  const { field: _field, headerKey: _headerKey, nested: _nested, ...rest } = options ?? {}

  return {
    headerName: t(headerKey) || 'Name',
    field,
    filter: false,
    flex: 1,
    valueGetter: (params: ValueGetterParams) => {
      const data = params.data as Record<string, unknown> | undefined
      if (!data) return ''

      if (options?.nested || field.includes('.')) {
        const raw = getNestedValue(data, field)
        return getLocalizedValue(raw as LocalizableValue, lang) || '-'
      }

      return getLocalizedNameFromRow(data, lang, field) || '-'
    },
    ...rest,
  }
}
