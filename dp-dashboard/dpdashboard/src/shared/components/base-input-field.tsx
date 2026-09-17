import * as React from 'react'
import { Eye, EyeOff, Calendar } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'

export interface BaseInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  name: string
  type?: 'text' | 'password' | 'date' | 'number' | 'time' | 'email'
  customError?: string
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
}

function parseDateParts(value: string | null | undefined) {
  const parts = (value || '').split('-')
  const year = parts[0] && /^\d{4}$/.test(parts[0]) ? parts[0] : ''
  const monthNum = parts[1] ? parseInt(parts[1], 10) : NaN
  const dayNum = parts[2] ? parseInt(parts[2], 10) : NaN
  return {
    year,
    month: Number.isFinite(monthNum) && monthNum >= 1 && monthNum <= 12 ? String(monthNum).padStart(2, '0') : '',
    day: Number.isFinite(dayNum) && dayNum >= 1 && dayNum <= 31 ? String(dayNum).padStart(2, '0') : '',
  }
}

function daysInMonth(year: string, month: string) {
  if (!year || !month) return 31
  return new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate()
}

function clampDay(year: string, month: string, day: string) {
  if (!day) return ''
  const max = daysInMonth(year, month)
  const n = parseInt(day, 10)
  if (!Number.isFinite(n)) return ''
  return String(Math.min(n, max)).padStart(2, '0')
}

interface DatePartsSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
  isRtl: boolean
  isAr: boolean
  minYear: number
  maxYear: number
  monthNames: string[]
}

function DatePartsSelect({
  label,
  value,
  onChange,
  disabled,
  error,
  isRtl,
  isAr,
  minYear,
  maxYear,
  monthNames,
}: DatePartsSelectProps) {
  // Keep partial year/month/day so each select sticks before all three are chosen
  const [parts, setParts] = React.useState(() => parseDateParts(value))
  // Skip one sync after our own onChange so clearing an incomplete date doesn't wipe UI
  const skipNextSyncRef = React.useRef(false)

  React.useEffect(() => {
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false
      return
    }
    setParts(parseDateParts(value))
  }, [value])

  const commit = (next: { year: string; month: string; day: string }) => {
    const year = next.year
    const month = next.month
    const day = clampDay(year, month, next.day)
    const updated = { year, month, day }
    setParts(updated)

    const nextValue = year && month && day ? `${year}-${month}-${day}` : ''
    const currentValue = value || ''
    // Only touch RHF when the committed value changes — avoids wiping partial UI
    // and avoids a stuck skip flag when value was already empty.
    if (nextValue !== currentValue) {
      skipNextSyncRef.current = true
      onChange(nextValue)
    }
  }

  const selectClass =
    'h-10 flex-1 px-2 rounded-xl border border-gray-200 bg-white dark:bg-card dark:border-border ' +
    'text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-main ' +
    'focus:border-main transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

  const maxDay = daysInMonth(parts.year, parts.month)

  return (
    <div className={cn('w-full space-y-1.5', isRtl ? 'text-right' : 'text-left')}>
      {label && (
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 opacity-60" />
          {label}
        </label>
      )}

      {/* Always LTR layout: Day | Month | Year */}
      <div className="flex gap-2" dir="ltr">
        <select
          value={parts.day}
          disabled={disabled}
          onChange={(e) => commit({ ...parts, day: e.target.value })}
          className={selectClass}
        >
          <option value="">{isAr ? 'يوم' : 'Day'}</option>
          {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => {
            const v = String(d).padStart(2, '0')
            return (
              <option key={v} value={v}>
                {v}
              </option>
            )
          })}
        </select>

        <select
          value={parts.month}
          disabled={disabled}
          onChange={(e) => commit({ ...parts, month: e.target.value })}
          className={cn(selectClass, 'flex-[1.6]')}
        >
          <option value="">{isAr ? 'شهر' : 'Month'}</option>
          {monthNames.map((m, i) => {
            const v = String(i + 1).padStart(2, '0')
            return (
              <option key={v} value={v}>
                {m}
              </option>
            )
          })}
        </select>

        <select
          value={parts.year}
          disabled={disabled}
          onChange={(e) => commit({ ...parts, year: e.target.value })}
          className={cn(selectClass, 'flex-[1.3]')}
        >
          <option value="">{isAr ? 'سنة' : 'Year'}</option>
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
    </div>
  )
}

export const BaseInputField = React.forwardRef<HTMLInputElement, BaseInputFieldProps>(
  ({ label, name, type = 'text', placeholder, className, customError, minDate, maxDate, disableFuture, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const localRef = React.useRef<HTMLInputElement>(null)
    const { t, i18n } = useTranslation()

    const formContext = useFormContext()

    React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement)

    const isRtl = document.documentElement.dir === 'rtl'
    const inputDir = props.dir || (type === 'number' ? 'ltr' : isRtl ? 'rtl' : 'ltr')
    const isInputRtl = inputDir === 'rtl'
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const { errors } = formContext?.formState || { errors: {} }
    const rawError = customError || (errors[name]?.message as string | undefined)
    const error = rawError ? t(rawError) : undefined

    const registerProps = formContext ? formContext.register(name) : {}

    // ── Date picker: 3-column Day / Month / Year selects ──────────────────────
    if (type === 'date' && formContext) {
      const effectiveMaxDate = maxDate || (disableFuture ? new Date() : new Date())
      const effectiveMinDate = minDate || new Date(1920, 0, 1)
      const minYear = effectiveMinDate.getFullYear()
      const maxYear = effectiveMaxDate.getFullYear()

      const isAr = i18n.language === 'ar'
      const monthNames = isAr
        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      return (
        <Controller
          name={name}
          control={formContext.control}
          render={({ field }) => (
            <DatePartsSelect
              label={label}
              value={field.value || ''}
              onChange={field.onChange}
              disabled={props.disabled}
              error={error}
              isRtl={isRtl}
              isAr={isAr}
              minYear={minYear}
              maxYear={maxYear}
              monthNames={monthNames}
            />
          )}
        />
      )
    }

    // ── All other input types ────────────────────────────────────────────────
    return (
      <div className={cn('w-full space-y-1.5', isRtl ? 'text-right' : 'text-left')}>
        {label && (
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={localRef}
            type={inputType}
            dir={inputDir}
            placeholder={placeholder}
            className={cn(
              'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-main focus:border-main transition-all',
              isPassword && (isInputRtl ? 'pl-10' : 'pr-10'),
              error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
              props.disabled &&
                'bg-gray-100/80 border-gray-200/80 text-gray-600 opacity-95 cursor-not-allowed select-none shadow-none focus:ring-0 focus:border-gray-200/80',
              props.readOnly &&
                'bg-gray-50/50 border-gray-200/50 text-gray-700 cursor-default focus:ring-0 focus:border-gray-200/50',
              className
            )}
            style={{
              fontVariantNumeric: 'lining-nums tabular-nums',
              fontFeatureSettings: '"lnum" on, "tnum" on',
              ...props.style,
            }}
            {...registerProps}
            {...props}
          />

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute text-gray-400 hover:text-gray-600 transition-colors',
                isInputRtl ? 'left-3' : 'right-3'
              )}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
      </div>
    )
  }
)

BaseInputField.displayName = 'BaseInputField'
export default BaseInputField
