import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { Translatable } from '@/shared/types/laravel'
import { useActiveCountries } from '../../api/useCountries'

interface CityFormCountryFieldProps {
  disabled?: boolean
  /** Ensures the current country appears even if inactive (not in active-only list). */
  ensureOption?: { id: number; name: string | Translatable } | null
}

/**
 * Native country picker for city forms — avoids custom dropdown clipping inside modals.
 */
export function CityFormCountryField({ disabled, ensureOption }: CityFormCountryFieldProps) {
  const { i18n, t } = useTranslation()
  const { control } = useFormContext()
  const { data: countries = [] } = useActiveCountries()

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
    <Controller
      name="country_id"
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label
            htmlFor="city-form-country_id"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            {t('country') || 'Country'}
            <span className="ms-1 text-destructive">*</span>
          </label>
          <select
            id="city-form-country_id"
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={disabled}
            className={cn(
              'h-10 w-full cursor-pointer rounded-xl border bg-card px-3 text-sm font-semibold text-foreground',
              'outline-none transition-all',
              'focus:border-[var(--main-color,#5B4B8A)] focus:ring-1 focus:ring-[var(--main-color,#5B4B8A)]',
              'disabled:cursor-not-allowed disabled:opacity-60',
              fieldState.error
                ? 'border-destructive focus:border-destructive focus:ring-destructive'
                : 'border-border/60'
            )}
          >
            <option value="">{t('chooseCountry') || 'Choose country...'}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {fieldState.error?.message && (
            <p className="text-xs text-destructive">{t(fieldState.error.message)}</p>
          )}
        </div>
      )}
    />
  )
}
