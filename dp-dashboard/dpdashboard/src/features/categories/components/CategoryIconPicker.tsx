import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/utils'

interface CategoryIconPickerProps {
  disabled?: boolean
}

const SUGGESTED_ICONS = [
  'fa-solid fa-receipt',
  'fa-solid fa-laptop',
  'fa-solid fa-utensils',
  'fa-solid fa-cart-shopping',
  'fa-solid fa-shirt',
  'fa-solid fa-car',
  'fa-solid fa-heart-pulse',
  'fa-solid fa-plane',
  'fa-solid fa-book',
  'fa-solid fa-house',
  'fa-solid fa-gamepad',
  'fa-solid fa-wrench',
  'fa-solid fa-mobile-screen',
  'fa-solid fa-gem',
  'fa-solid fa-bag-shopping',
]

const SUGGESTED_COLORS = [
  '#6366F1',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#14B8A6',
  '#F97316',
]

export function CategoryIconPicker({ disabled = false }: CategoryIconPickerProps) {
  const { t } = useTranslation()
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const currentIcon = watch('icon') || 'fa-solid fa-shapes'
  const currentBgColor = watch('icon_bg_color') || '#6366F1'

  return (
    <div className="space-y-4 p-4 rounded-2xl border border-border/60 bg-muted/20">
      {/* Top section: Inputs + Live Badge Preview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Live Badge Preview */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-sm border border-white/20 transition-all"
            style={{ backgroundColor: currentBgColor }}
          >
            <i className={cn(currentIcon, 'text-2xl')} />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t('preview')}
          </span>
        </div>

        {/* Inputs */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Font Awesome Icon Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('fontAwesomeIcon')} <span className="text-destructive">*</span>
            </label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <div className="relative flex items-center">
                  <span className="absolute left-3 flex items-center justify-center w-5 text-muted-foreground">
                    <i className={cn(field.value || 'fa-solid fa-shapes', 'text-sm')} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. fa-solid fa-utensils"
                    disabled={disabled}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-border/60 bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  />
                </div>
              )}
            />
            {errors.icon?.message && (
              <p className="text-[11px] text-destructive font-medium">
                {String(errors.icon.message)}
              </p>
            )}
          </div>

          {/* Color Picker Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('iconBgColor')} <span className="text-destructive">*</span>
            </label>
            <Controller
              name="icon_bg_color"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={disabled}
                    value={field.value?.startsWith('#') ? field.value : '#6366F1'}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    className="w-10 h-10 p-0.5 rounded-xl border border-border/60 bg-background cursor-pointer disabled:cursor-not-allowed shrink-0"
                  />
                  <input
                    type="text"
                    disabled={disabled}
                    placeholder="#6366F1"
                    maxLength={7}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      let val = e.target.value.trim()
                      if (val && !val.startsWith('#')) val = '#' + val
                      field.onChange(val.toUpperCase())
                    }}
                    className="flex-1 h-10 px-3 rounded-xl border border-border/60 bg-background text-xs font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                  />
                </div>
              )}
            />
            {errors.icon_bg_color?.message && (
              <p className="text-[11px] text-destructive font-medium">
                {String(errors.icon_bg_color.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {!disabled && (
        <>
          {/* Suggested Icons Chips */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {t('suggestedIcons')}:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {SUGGESTED_ICONS.map((iconClass) => (
                <button
                  key={iconClass}
                  type="button"
                  onClick={() => setValue('icon', iconClass, { shouldValidate: true })}
                  className={cn(
                    'w-8 h-8 rounded-lg border flex items-center justify-center transition-all',
                    currentIcon === iconClass
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border/60 bg-background hover:bg-muted text-muted-foreground'
                  )}
                  title={iconClass}
                >
                  <i className={cn(iconClass, 'text-xs')} />
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Colors Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {t('colorPalette', 'Color Palette')}:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {SUGGESTED_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setValue('icon_bg_color', hex, { shouldValidate: true })}
                  className={cn(
                    'w-6 h-6 rounded-full transition-transform hover:scale-110 shadow-xs border',
                    currentBgColor?.toUpperCase() === hex.toUpperCase()
                      ? 'ring-2 ring-primary ring-offset-2 scale-105 border-white'
                      : 'border-black/10'
                  )}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
