import React from 'react'
import { useForm, Controller, type FieldValues, type Path, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'
import { cn } from '@/shared/utils/utils'
import { Label } from './label'
import { Input } from './input'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Checkbox } from './controls'
import { useTranslation } from 'react-i18next'
import ReactSelect from 'react-select'

// ─── Form Field Wrapper ───────────────────────────────────────────────────────

interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
  htmlFor?: string
}

export function FormField({ label, error, required, hint, className, children, htmlFor }: FormFieldProps) {
  const { t } = useTranslation()
  const translatedError = error ? t(error) : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint && !translatedError && <p className="text-xs text-muted-foreground">{hint}</p>}
      {translatedError && <p className="text-xs text-destructive">{translatedError}</p>}
    </div>
  )
}

// ─── Controlled Form Field ────────────────────────────────────────────────────

interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  type = 'text',
  hint,
  disabled,
  className,
}: ControlledInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            error={fieldState.error?.message}
            {...field}
          />
        </FormField>
      )}
    />
  )
}

interface ControlledTextareaProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  rows?: number
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledTextarea<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder,
  rows = 3,
  hint,
  disabled,
  className,
}: ControlledTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Textarea
            id={name}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            error={fieldState.error?.message}
            {...field}
          />
        </FormField>
      )}
    />
  )
}

interface ControlledSelectProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label?: string
  required?: boolean
  placeholder?: string
  options: Array<{ value: string; label: string }>
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledSelect<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder = 'Select…',
  options,
  hint,
  disabled,
  className,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger id={name} error={!!fieldState.error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  )
}

interface ControlledCheckboxProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  hint?: string
  disabled?: boolean
  className?: string
}

export function ControlledCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  disabled,
  className,
}: ControlledCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} hint={hint} className={className}>
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            <Label htmlFor={name} className="cursor-pointer font-normal">
              {label}
            </Label>
          </div>
        </FormField>
      )}
    />
  )
}

const getReactSelectStyles = (isError?: boolean): any => ({
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderRadius: '0.75rem',
    backgroundColor: 'hsl(var(--card))',
    borderColor: isError
      ? '#ef4444'
      : state.isFocused
        ? 'var(--main-color, #5B4B8A)'
        : 'hsl(var(--border))',
    boxShadow: state.isFocused ? '0 0 0 1px var(--main-color, #5B4B8A)' : 'none',
    '&:hover': {
      borderColor: isError ? '#ef4444' : 'hsl(var(--muted-foreground))',
    },
    minHeight: '2.5rem',
    transition: 'all 0.15s ease',
  }),
  valueContainer: (baseStyles: any) => ({
    ...baseStyles,
    padding: '2px 12px',
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--foreground))',
  }),
  input: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--foreground))',
  }),
  placeholder: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--muted-foreground))',
  }),
  menu: (baseStyles: any) => ({
    ...baseStyles,
    borderRadius: '0.75rem',
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)',
    zIndex: 99999,
    overflow: 'hidden',
    padding: '4px',
  }),
  menuPortal: (baseStyles: any) => ({
    ...baseStyles,
    zIndex: 99999,
  }),
  menuList: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: 'hsl(var(--popover))',
    maxHeight: '220px',
    overflowY: 'auto',
    padding: '0',
  }),
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: state.isSelected
      ? 'var(--main-color, #5B4B8A)'
      : state.isFocused
        ? 'color-mix(in srgb, var(--main-color, #5B4B8A) 16%, transparent)'
        : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : 'hsl(var(--popover-foreground))',
    borderRadius: '0.5rem',
    margin: '2px 0',
    padding: '8px 12px',
    fontSize: '0.875rem',
    fontWeight: state.isSelected ? 600 : 500,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    '&:active': {
      backgroundColor: state.isSelected
        ? 'var(--main-color, #5B4B8A)'
        : 'color-mix(in srgb, var(--main-color, #5B4B8A) 24%, transparent)',
    },
  }),
  noOptionsMessage: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '0.875rem',
  }),
  dropdownIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: state.isFocused ? 'var(--main-color, #5B4B8A)' : 'hsl(var(--muted-foreground))',
    '&:hover': {
      color: 'hsl(var(--foreground))',
    },
    padding: '4px 8px',
  }),
  clearIndicator: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--muted-foreground))',
    '&:hover': {
      color: 'hsl(var(--foreground))',
    },
    padding: '4px 8px',
  }),
  indicatorSeparator: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: 'hsl(var(--border))',
  }),
  multiValue: (baseStyles: any) => ({
    ...baseStyles,
    backgroundColor: 'hsl(var(--muted))',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--foreground))',
  }),
  multiValueRemove: (baseStyles: any) => ({
    ...baseStyles,
    color: 'hsl(var(--muted-foreground))',
    borderRadius: '0 0.375rem 0.375rem 0',
    '&:hover': {
      backgroundColor: 'hsl(var(--destructive) / 0.15)',
      color: 'hsl(var(--destructive))',
    },
  }),
})

export function ControlledSearchableSelect<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder = 'Select…',
  options,
  hint,
  disabled,
  className,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValue = options.find((o) => o.value === field.value) || null
        return (
          <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
            <ReactSelect
              id={name}
              isDisabled={disabled}
              placeholder={placeholder}
              options={options}
              value={selectedValue}
              onChange={(val: any) => field.onChange(val ? val.value : '')}
              classNamePrefix="react-select"
              isSearchable
              menuPlacement="auto"
              menuPosition="fixed"
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuShouldScrollIntoView={false}
              styles={getReactSelectStyles(!!fieldState.error)}
            />
          </FormField>
        )
      }}
    />
  )
}

export function ControlledMultiSelect<T extends FieldValues>({
  name,
  control,
  label,
  required,
  placeholder = 'Select…',
  options,
  hint,
  disabled,
  className,
}: ControlledSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues = options.filter((o) => (field.value || []).includes(o.value))
        return (
          <FormField label={label} error={fieldState.error?.message} required={required} hint={hint} htmlFor={name} className={className}>
            <ReactSelect
              id={name}
              isMulti
              isDisabled={disabled}
              placeholder={placeholder}
              options={options}
              value={selectedValues}
              onChange={(val: any) => {
                const arr = val ? val.map((v: any) => v.value) : []
                field.onChange(arr)
              }}
              classNamePrefix="react-select"
              isSearchable
              className="react-select-container text-sm"
              menuPlacement="auto"
              menuPosition="fixed"
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuShouldScrollIntoView={false}
              styles={getReactSelectStyles(!!fieldState.error)}
            />
          </FormField>
        )
      }}
    />
  )
}

// ─── useZodForm ───────────────────────────────────────────────────────────────

export function useZodForm<T extends FieldValues>(schema: ZodSchema<T>, defaultValues?: Partial<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as T,
  })
}

