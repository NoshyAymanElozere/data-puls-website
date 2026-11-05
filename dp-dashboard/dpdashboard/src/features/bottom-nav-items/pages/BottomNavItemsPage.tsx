import '@/assets/fontawesome/css/fontawesome.min.css'
import '@/assets/fontawesome/css/regular.min.css'
import '@/assets/fontawesome/css/solid.min.css'
import { Loader2, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/features/auth/api/useAuth'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { NoPermissionCard } from '@/shared/components/NoPermissionCard'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useBottomNavItems,
  useUpdateBottomNavItem,
  type BottomNavItem,
} from '../api/useBottomNavItems'
import { IconPickerDialog } from '../components/IconPickerDialog'

export default function BottomNavItemsPage() {
  const { t } = useTranslation()
  const { data: admin, isLoading: profileLoading } = useProfile()
  const canView = hasPermission(admin, 'bottom_nav_items.view')
  const canUpdate = hasPermission(admin, 'bottom_nav_items.update')

  const { data: items = [], isLoading } = useBottomNavItems()
  const updateMutation = useUpdateBottomNavItem()
  const [editingItem, setEditingItem] = useState<BottomNavItem | null>(null)

  if (!profileLoading && !canView) return <NoPermissionCard />

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardHeader className="pb-4 border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold text-foreground">{t('bottomNavItems')}</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">{t('bottomNavItemsSubtitle')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          // Always right to left, because that is how the bar reads in the app.
          <ul dir="rtl" className="grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <li
                key={item.id}
                data-testid={`bottom-nav-${item.key}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-main/10 text-main">
                  <i className={`${item.icon.class} text-2xl`} aria-hidden />
                </span>
                <span className="text-sm font-semibold text-foreground">{item.title}</span>
                <code className="w-full truncate text-[10px] text-muted-foreground" dir="ltr" title={item.icon.class}>
                  {item.icon.class}
                </code>
                {canUpdate && (
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                    <Pencil className="me-1.5 h-3.5 w-3.5" />
                    {t('bottomNavChangeIcon')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}

        <IconPickerDialog
          item={editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          saving={updateMutation.isPending}
          onSave={({ style, name }) => {
            if (!editingItem) return
            updateMutation.mutate(
              { id: editingItem.id, style, name },
              { onSuccess: () => setEditingItem(null) }
            )
          }}
        />
      </CardContent>
    </Card>
  )
}
