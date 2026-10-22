import { Badge, type BadgeProps } from '@/shared/components/badge'
import { cn } from '@/shared/utils/utils'
import { useTranslation } from 'react-i18next'
import type { UserAccessType } from '../api/useUsers'

const ACCESS_TYPE_META: Record<UserAccessType, { variant: BadgeProps['variant']; labelKey: string }> = {
  subscription: { variant: 'success', labelKey: 'accessTypeSubscription' },
  trial: { variant: 'info', labelKey: 'accessTypeTrial' },
  none: { variant: 'secondary', labelKey: 'accessTypeNone' },
}

interface AccessTypeBadgeProps {
  value: UserAccessType | null | undefined
  className?: string
}

export function AccessTypeBadge({ value, className }: AccessTypeBadgeProps) {
  const { t } = useTranslation()
  if (!value || !ACCESS_TYPE_META[value]) return <span className="text-muted-foreground">-</span>
  const meta = ACCESS_TYPE_META[value]
  return (
    <Badge variant={meta.variant} dot className={cn('whitespace-nowrap', className)}>
      {t(meta.labelKey)}
    </Badge>
  )
}
