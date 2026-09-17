import type { ColDef } from 'ag-grid-community'
import { Eye, Trash2, CheckCircle2, CircleDashed, User } from 'lucide-react'
import { Button } from '@/shared/components/button'
import type { NotificationLogItem } from '../../api/useNotificationLogs'
import { EVENT_CATALOG } from '../settings/eventTokensCatalog'

interface ColumnDefsProps {
  t: (key: string) => string
  canDelete: boolean
  isRtl?: boolean
  onView: (item: NotificationLogItem) => void
  onDelete: (item: NotificationLogItem) => void
}

export function getLogsColumnDefs({
  t,
  canDelete,
  isRtl = false,
  onView,
  onDelete,
}: ColumnDefsProps): ColDef<NotificationLogItem>[] {
  return [
    {
      headerName: t('recipient') || 'Recipient',
      field: 'user_name',
      minWidth: 200,
      flex: 1.2,
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item) return null

        const initial = item.user_name ? item.user_name.trim().charAt(0).toUpperCase() : null

        return (
          <div className="flex items-center gap-2.5 h-full py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main font-bold text-xs border border-main/20 shadow-2xs">
              {initial ? (
                <span>{initial}</span>
              ) : (
                <User className="h-3.5 w-3.5 text-main" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs leading-tight truncate">
                {item.user_name || (
                  <span className="italic text-muted-foreground">{t('allUsers') || 'All Users'}</span>
                )}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                {item.user_phone && <span>{item.user_phone}</span>}
                {item.user_id && <span className="opacity-70">• ID: #{item.user_id}</span>}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      headerName: t('filterByType') || 'Type',
      field: 'type_label',
      minWidth: 160,
      width: 180,
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item) return null

        const label = item.type_label || item.type || '-'
        const catalogItem = EVENT_CATALOG[item.type]
        const iconClass = catalogItem?.defaultIcon || 'fa-solid fa-tag'
        const badgeColor = catalogItem?.defaultColor || '#6B7280'

        return (
          <div className="flex items-center h-full">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors max-w-full"
              style={{
                backgroundColor: `${badgeColor}18`,
                color: badgeColor,
                borderColor: `${badgeColor}35`,
              }}
            >
              <i className={iconClass} style={{ fontSize: '11px' }} />
              <span className="truncate">{label}</span>
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('notificationTitle') || 'Notification',
      field: 'title',
      minWidth: 280,
      flex: 2,
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item) return null

        const bgColor = item.icon_bg_color || '#5B4B8A'
        const iconClass = item.icon || 'fa-solid fa-bell'

        return (
          <div className="flex items-center gap-3 h-full py-1.5 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
              style={{ backgroundColor: bgColor }}
            >
              <i className={iconClass} style={{ fontSize: '14px' }} />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs leading-snug truncate">
                {item.title || '-'}
              </span>
              <span className="text-[11px] text-muted-foreground/80 leading-relaxed truncate mt-0.5">
                {item.body || '-'}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      headerName: t('readStatus') || 'Status',
      field: 'is_read',
      width: 140,
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item) return null

        if (item.is_read) {
          return (
            <div className="flex flex-col justify-center h-full py-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {t('isRead') || 'Read'}
              </span>
              {item.read_at && (
                <span className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">
                  {item.read_at}
                </span>
              )}
            </div>
          )
        }

        return (
          <div className="flex items-center h-full">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 w-fit">
              <CircleDashed className="h-3 w-3 text-amber-500" />
              {t('isUnread') || 'Unread'}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('sentAt') || 'Sent At',
      field: 'created_at',
      width: 175,
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item?.created_at) return '-'
        return (
          <div className="flex items-center h-full font-mono text-[11px] text-muted-foreground font-medium">
            {item.created_at}
          </div>
        )
      },
    },
    {
      headerName: t('actions') || 'Actions',
      width: 100,
      pinned: isRtl ? 'left' : 'right',
      cellRenderer: (params: { data?: NotificationLogItem }) => {
        const item = params.data
        if (!item) return null

        return (
          <div className="flex items-center justify-center gap-1 h-full">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onView(item)}
              title={t('view') || 'View'}
              className="h-8 w-8 text-muted-foreground hover:text-main hover:bg-main/10 rounded-xl transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(item)}
                title={t('delete') || 'Delete'}
                className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
