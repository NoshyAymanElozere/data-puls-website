import { useTranslation } from 'react-i18next'
import { Switch } from '@/shared/components/controls'
import { cn } from '@/shared/utils/utils'

interface FormStatusFieldProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function FormStatusField({ value, onChange, disabled = false }: FormStatusFieldProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex h-10 w-full items-center justify-between gap-3 rounded-xl border px-3.5 transition-colors',
        value ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/60 bg-card',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            value ? 'bg-emerald-500' : 'bg-muted-foreground'
          )}
        />
        <span
          className={cn(
            'text-sm font-semibold truncate',
            value ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
          )}
        >
          {value ? t('active') : t('inactive')}
        </span>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={value ? t('active') : t('inactive')}
        className="shrink-0 data-[state=checked]:bg-emerald-500"
      />
    </div>
  )
}
