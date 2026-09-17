import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Clock } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { NotificationSettingListItem } from '../../api/useNotificationSettings'
import { EVENT_CATALOG } from './eventTokensCatalog'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  canUpdate: boolean
  onEdit: (item: NotificationSettingListItem) => void
  onView: (item: NotificationSettingListItem) => void
  toggleMutation: {
    mutate: (args: { id: number; is_active: boolean }) => void
  }
}

export function getSettingsColumnDefs({
  t,
  lang,
  canUpdate,
  onEdit,
  onView,
  toggleMutation,
}: ColumnDefsProps): ColDef<NotificationSettingListItem>[] {
  return [
    {
      headerName: t('eventName') || 'Event',
      field: 'name',
      minWidth: 230,
      flex: 1.3,
      cellRenderer: (params: { data?: NotificationSettingListItem }) => {
        const item = params.data
        if (!item) return null

        const catalogItem = EVENT_CATALOG[item.key]
        const displayName =
          getLocalizedValue(item.name, lang) ||
          (lang === 'ar' ? catalogItem?.labelAr : catalogItem?.labelEn) ||
          item.key

        const daysBefore = item.config?.days_before

        return (
          <div className="flex flex-col justify-center h-full gap-1 py-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm leading-snug">
                {displayName}
              </span>
              {daysBefore != null && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="h-2.5 w-2.5" />
                  {daysBefore} {t('days') || 'أيام'}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-muted-foreground/80 leading-none">
              {item.key}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('iconAndColor') || 'Badge',
      field: 'icon',
      width: 150,
      cellRenderer: (params: { data?: NotificationSettingListItem }) => {
        const item = params.data
        if (!item) return null

        const bgColor = item.icon_bg_color || '#5B4B8A'
        const iconClass = item.icon || 'fa-solid fa-bell'

        return (
          <div className="flex items-center gap-2.5 h-full">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs shrink-0"
              style={{ backgroundColor: bgColor }}
            >
              <i className={iconClass} style={{ fontSize: '14px' }} />
            </div>
            <span className="text-xs font-mono text-muted-foreground font-semibold uppercase">
              {bgColor}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('notificationTitle') || 'Message Preview',
      field: 'title',
      minWidth: 320,
      flex: 2,
      cellRenderer: (params: { data?: NotificationSettingListItem }) => {
        const item = params.data
        if (!item) return null

        const titleText = getLocalizedValue(item.title, lang)
        const bodyText = getLocalizedValue(item.body, lang)

        return (
          <div className="flex flex-col justify-center h-full gap-1 py-1 min-w-0">
            <span className="font-bold text-foreground text-xs leading-snug truncate">
              {titleText || '-'}
            </span>
            <span className="text-xs text-muted-foreground leading-snug line-clamp-1 truncate">
              {bodyText || '-'}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('status') || 'Active',
      field: 'is_active',
      width: 140,
      cellRenderer: (params: { data?: NotificationSettingListItem }) => {
        const item = params.data
        if (!item) return null

        return (
          <div className="flex items-center h-full">
            <StatusToggle
              value={item.is_active}
              disabled={!canUpdate}
              onChange={(checked) => toggleMutation.mutate({ id: item.id, is_active: checked })}
            />
          </div>
        )
      },
    },
    {
      headerName: t('actions') || 'Actions',
      minWidth: 200,
      width: 220,
      cellRenderer: (params: { data?: NotificationSettingListItem }) => {
        const item = params.data
        if (!item) return null

        return (
          <div className="flex items-center gap-2 h-full">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(item)}
              className="h-8 px-2.5 text-xs font-bold gap-1 text-muted-foreground hover:text-foreground hover:bg-muted border-border/60 rounded-xl shrink-0 whitespace-nowrap transition-all"
            >
              <Eye className="h-3.5 w-3.5 text-main" />
              <span>{t('view') || 'عرض'}</span>
            </Button>
            {canUpdate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item)}
                className="h-8 px-2.5 text-xs font-bold gap-1 text-main border-main/20 hover:bg-main/10 hover:border-main/40 rounded-xl shrink-0 whitespace-nowrap transition-all"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>{t('edit') || 'تعديل'}</span>
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
