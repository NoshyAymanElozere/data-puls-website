import { useMemo } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ControlledSearchableSelect } from '@/shared/components/form-fields'
import { useActiveCountries } from '@/features/settings/api/useCountries'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { Translatable } from '@/shared/types/laravel'

interface CountrySelectProps<T extends FieldValues> {
  name?: Path<T>
  control: Control<T>
  disabled?: boolean
  required?: boolean
  label?: string
  /** Ensures the current country appears even if inactive (not in active-only list). */
  ensureOption?: { id: number; name: string | Translatable } | null
}

export function CountrySelect<T extends FieldValues>({
  name = 'country_id' as Path<T>,
  control,
  disabled,
  required = true,
  label,
  ensureOption,
}: CountrySelectProps<T>) {
  const { i18n, t } = useTranslation()
  const { data: countries = [] } = useActiveCountries()
  const selectedId = useWatch({ control, name })

  const options = useMemo(() => {
    const base = countries.map((c) => ({
      value: String(c.id),
      label: getLocalizedValue(c.name, i18n.language) || String(c.id),
    }))

    if (!ensureOption?.id) return base

    const value = String(ensureOption.id)
    if (base.some((o) => o.value === value)) return base

    return [
      {
        value,
        label: getLocalizedValue(ensureOption.name, i18n.language) || value,
      },
      ...base,
    ]
  }, [countries, ensureOption, i18n.language])

  return (
    <ControlledSearchableSelect
      key={`country-${String(selectedId)}-${options.length}`}
      name={name}
      control={control}
      label={label !== undefined ? label : t('country') || 'Country'}
      options={options}
      placeholder={t('chooseCountry') || 'Choose country...'}
      disabled={disabled}
      required={required}
    />
  )
}
