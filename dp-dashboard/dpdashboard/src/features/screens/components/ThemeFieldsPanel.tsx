import type { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/shared/utils/utils'
import type { ScreenThemeValues } from '../api/useScreens'
import {
  HEX_COLOR_REGEX,
  THEME_COLOR_FIELDS,
  THEME_FIELD_LABEL_KEYS,
  type ThemeColorField,
  type ThemeMode,
} from '../constants'
import type { ScreenFormValues } from '../pages/validationSchema'

interface ThemeFieldsPanelProps {
  mode: ThemeMode
  isGlobal: boolean
  /** Global theme values for this mode (null for the global row itself). */
  globalValues: ScreenThemeValues | null
  disabled?: boolean
}

const inputClass =
  'h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 ' +
  'focus:outline-none focus:ring-1 focus:ring-main focus:border-main transition-all ' +
  'dark:bg-card dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground ' +
  'disabled:cursor-not-allowed disabled:opacity-70'

function FieldShell({
  label,
  isInherited,
  showInheritance,
  onReset,
  disabled,
  error,
  hint,
  children,
}: {
  label: string
  isInherited: boolean
  showInheritance: boolean
  onReset: () => void
  disabled?: boolean
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border p-3 transition-colors',
        error ? 'border-rose-400' : showInheritance && !isInherited ? 'border-main/40 bg-main/5' : 'border-border/60'
      )}
    >
      <div className="flex items-center justify-between gap-2 min-h-6">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</label>
        {showInheritance &&
          (isInherited ? (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {t('screenInherited')}
            </span>
          ) : (
            !disabled && (
              <button
                type="button"
                onClick={onReset}
                className="shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-main hover:bg-main/10"
                title={t('screenResetToGlobal')}
              >
                <RotateCcw className="h-3 w-3" />
                {t('screenResetToGlobal')}
              </button>
            )
          ))}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-rose-500 font-semibold">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

function ColorField({
  mode,
  field,
  isGlobal,
  globalValue,
  disabled,
}: {
  mode: ThemeMode
  field: ThemeColorField
  isGlobal: boolean
  globalValue?: string | null
  disabled?: boolean
}) {
  const { t } = useTranslation()
  const { control } = useFormContext<ScreenFormValues>()

  return (
    <Controller
      control={control}
      name={`theme.${mode}.${field}`}
      render={({ field: rhf, fieldState }) => {
        const value = (rhf.value ?? '') as string
        const isInherited = !isGlobal && value === ''
        const effective = HEX_COLOR_REGEX.test(value) ? value : globalValue && HEX_COLOR_REGEX.test(globalValue) ? globalValue : '#000000'
        return (
          <FieldShell
            label={t(THEME_FIELD_LABEL_KEYS[field])}
            isInherited={isInherited}
            showInheritance={!isGlobal}
            onReset={() => rhf.onChange('')}
            disabled={disabled}
            error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
            hint={
              !isGlobal && globalValue ? (
                <span className="inline-flex items-center gap-1.5">
                  {t('screenGlobalValue')}:
                  <span
                    className="inline-block h-3 w-3 rounded-sm border border-border"
                    style={{ backgroundColor: globalValue }}
                  />
                  <span className="font-mono" dir="ltr">
                    {globalValue}
                  </span>
                </span>
              ) : undefined
            }
          >
            <div className="flex items-center gap-2" dir="ltr">
              <label
                className={cn(
                  'relative h-9 w-11 shrink-0 overflow-hidden rounded-lg border border-border shadow-sm',
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  isInherited && 'opacity-60'
                )}
                style={{ backgroundColor: effective }}
              >
                <input
                  type="color"
                  value={effective.toLowerCase()}
                  disabled={disabled}
                  onChange={(e) => rhf.onChange(e.target.value.toUpperCase())}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  aria-label={t(THEME_FIELD_LABEL_KEYS[field])}
                />
              </label>
              <input
                type="text"
                value={value}
                disabled={disabled}
                maxLength={7}
                placeholder={isGlobal ? '#RRGGBB' : globalValue || '#RRGGBB'}
                onChange={(e) => {
                  let next = e.target.value.trim().toUpperCase()
                  if (next && !next.startsWith('#')) next = `#${next}`
                  rhf.onChange(next)
                }}
                onBlur={rhf.onBlur}
                className={cn(inputClass, 'font-mono uppercase')}
              />
            </div>
          </FieldShell>
        )
      }}
    />
  )
}

export function ThemeFieldsPanel({ mode, isGlobal, globalValues, disabled }: ThemeFieldsPanelProps) {
  const g = globalValues ?? {}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {THEME_COLOR_FIELDS.map((field) => (
        <ColorField
          key={`${mode}-${field}`}
          mode={mode}
          field={field}
          isGlobal={isGlobal}
          globalValue={g[field]}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
