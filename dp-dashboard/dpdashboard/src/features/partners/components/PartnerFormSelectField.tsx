import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { Translatable } from '@/shared/types/laravel'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { cn } from '@/shared/utils/utils'

export interface SelectOptionSource {
  id: number
  name: string | Translatable
}

interface PartnerFormSelectFieldProps {
  name: 'partner_sector_id' | 'city_id'
  label: string
  placeholder: string
  options: SelectOptionSource[]
  /** Keeps the saved value selectable even when it is inactive (missing from the active-only list). */
  ensureOption?: SelectOptionSource | null
  disabled?: boolean
}

/**
 * Native select for partner forms — avoids custom dropdown clipping inside modals
 * (same approach as the city form's country field).
 */
export function PartnerFormSelectField({
  name,
  label,
  placeholder,
  options,
  ensureOption,
  disabled,
}: PartnerFormSelectFieldProps) {
  const { i18n, t } = useTranslation()
  const { control } = useFormContext()
  const id = `partner-form-${name}`

  const items = useMemo(() => {
    const base = options.map((o) => ({
      value: String(o.id),
      label: getLocalizedValue(o.name, i18n.language) || String(o.id),
    }))
    if (!ensureOption?.id) return base
    const value = String(ensureOption.id)
    if (base.some((o) => o.value === value)) return base
    return [{ value, label: getLocalizedValue(ensureOption.name, i18n.language) || value }, ...base]
  }, [options, ensureOption, i18n.language])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
            <span className="ms-1 text-destructive">*</span>
          </label>
          <select
            id={id}
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
            <option value="">{placeholder}</option>
            {items.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {fieldState.error?.message && <p className="text-xs text-destructive">{t(fieldState.error.message)}</p>}
        </div>
      )}
    />
  )
}
