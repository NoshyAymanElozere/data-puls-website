import { ShieldOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/components/card'

/** Shown in place of a page when the admin lacks its `.view` permission. */
export function NoPermissionCard() {
  const { t } = useTranslation()
  return (
    <Card className="border-border/60 shadow-sm rounded-2xl p-10 bg-card">
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        <ShieldOff className="h-8 w-8 opacity-60" />
        <p className="text-sm font-semibold">{t('noActionPermission')}</p>
      </div>
    </Card>
  )
}
