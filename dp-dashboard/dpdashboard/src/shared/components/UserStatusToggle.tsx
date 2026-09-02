import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/shared/components/controls'
import { cn } from '@/shared/utils/utils'
import type { UserStatus } from '@/features/users/api/useUsers'

interface UserStatusToggleProps {
  value: UserStatus
  onChange: (status: UserStatus) => void | Promise<unknown>
  disabled?: boolean
}

export function UserStatusToggle({ value, onChange, disabled = false }: UserStatusToggleProps) {
  const { t } = useTranslation()
  const isActive = value === 'active'
  const [localActive, setLocalActive] = useState(isActive)
  const isPendingRef = useRef(false)
  const lastSyncedRef = useRef(isActive)

  useEffect(() => {
    if (isPendingRef.current) return
    if (isActive === lastSyncedRef.current) return
    lastSyncedRef.current = isActive
    setLocalActive(isActive)
  }, [isActive])

  const handleChange = useCallback(
    async (checked: boolean) => {
      if (disabled || isPendingRef.current || checked === lastSyncedRef.current) return

      const previous = lastSyncedRef.current
      const nextStatus: UserStatus = checked ? 'active' : 'suspended'
      lastSyncedRef.current = checked
      setLocalActive(checked)
      isPendingRef.current = true

      try {
        await onChange(nextStatus)
      } catch {
        lastSyncedRef.current = previous
        setLocalActive(previous)
      } finally {
        isPendingRef.current = false
      }
    },
    [disabled, onChange]
  )

  return (
    <div className="flex items-center gap-2.5 h-full" onClick={(e) => e.stopPropagation()}>
      <Switch
        checked={localActive}
        onCheckedChange={handleChange}
        disabled={disabled}
        aria-label={localActive ? t('active') : t('suspended')}
        className={cn('data-[state=checked]:bg-emerald-500')}
      />
      <span
        className={cn(
          'text-xs font-semibold select-none',
          localActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
        )}
      >
        {localActive ? t('active') : t('suspended')}
      </span>
    </div>
  )
}
