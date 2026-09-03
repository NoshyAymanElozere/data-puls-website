import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/shared/components/controls'
import { cn } from '@/shared/utils/utils'

interface StatusToggleProps {
  value: boolean
  onChange: (newValue: boolean) => void | Promise<unknown>
  disabled?: boolean
}

export function StatusToggle({ value, onChange, disabled = false }: StatusToggleProps) {
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState(value)
  const isPendingRef = useRef(false)
  const lastSyncedValueRef = useRef(value)

  useEffect(() => {
    if (isPendingRef.current) return
    if (value === lastSyncedValueRef.current) return
    lastSyncedValueRef.current = value
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    async (checked: boolean) => {
      if (disabled || isPendingRef.current || checked === lastSyncedValueRef.current) return

      const previous = lastSyncedValueRef.current
      lastSyncedValueRef.current = checked
      setLocalValue(checked)
      isPendingRef.current = true

      try {
        await onChange(checked)
      } catch {
        lastSyncedValueRef.current = previous
        setLocalValue(previous)
      } finally {
        isPendingRef.current = false
      }
    },
    [disabled, onChange]
  )

  return (
    <div
      className="flex items-center gap-2.5 h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <Switch
        checked={localValue}
        onCheckedChange={handleChange}
        disabled={disabled}
        aria-label={localValue ? t('active') || 'Active' : t('inactive') || 'Inactive'}
        className={cn('data-[state=checked]:bg-emerald-500')}
      />
      <span
        className={cn(
          'text-xs font-semibold select-none',
          localValue
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-muted-foreground'
        )}
      >
        {localValue ? t('active') || 'Active' : t('inactive') || 'Inactive'}
      </span>
    </div>
  )
}
