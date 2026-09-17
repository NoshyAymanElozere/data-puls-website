import { Button } from '@/shared/components/button'
import type { ColDef } from 'ag-grid-community'
import { Eye, MessageSquareReply, Trash2, CheckCircle2, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { ContactMessage } from '@/features/contact/api/useContactMessages'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  setViewingItem: (item: ContactMessage) => void
  setDeletingItem: (item: ContactMessage) => void
  onReplyItem?: (item: ContactMessage) => void
  canDelete?: boolean
  canReply?: boolean
}

export function getSupportColumnDefs({
  t,
  lang,
  setViewingItem,
  setDeletingItem,
  onReplyItem,
  canDelete = true,
  canReply = true,
}: ColumnDefsProps): ColDef<ContactMessage>[] {
  return [
    {
      headerName: t('sender') || 'Sender',
      field: 'name',
      filter: false,
      flex: 1.2,
      cellRenderer: (params: { data?: ContactMessage }) => {
        const item = params.data
        if (!item) return '-'

        const displayName = item.name || item.user?.name || (item.user_id ? `${t('user') || 'User'} #${item.user_id}` : t('guest') || 'Guest')
        const userId = item.user_id || item.user?.id

        if (userId) {
          return (
            <div className="flex items-center gap-1.5 truncate">
              <Link
                to={`/users/${userId}`}
                className="font-semibold text-primary hover:underline text-sm truncate"
                title={displayName}
              >
                {displayName}
              </Link>
            </div>
          )
        }

        return (
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-foreground text-sm truncate" title={displayName}>
              {displayName}
            </span>
            <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
              {t('guest') || 'Guest'}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('contactInfo') || 'Contact',
      filter: false,
      flex: 1.3,
      cellRenderer: (params: { data?: ContactMessage }) => {
        const item = params.data
        if (!item) return '-'

        const email = item.email || item.user?.email
        const phone = item.phone || item.user?.phone

        if (!email && !phone) return '-'

        return (
          <div className="flex flex-col justify-center leading-tight py-1 truncate">
            {email && (
              <span className="text-xs font-medium text-foreground truncate" title={email}>
                {email}
              </span>
            )}
            {phone && (
              <span className="text-[11px] text-muted-foreground truncate" dir="ltr" title={phone}>
                {phone}
              </span>
            )}
          </div>
        )
      },
    },
    {
      headerName: t('subject') || 'Subject',
      field: 'subject.name',
      filter: false,
      flex: 1.2,
      valueGetter: (params) => {
        const item = params.data
        return item?.subject_name || getLocalizedValue(item?.subject?.name, lang) || '-'
      },
    },
    {
      headerName: t('messageExcerpt') || 'Message',
      field: 'message',
      filter: false,
      flex: 1.5,
      cellRenderer: (params: { data?: ContactMessage }) => {
        const message = params.data?.message
        if (!message) return '-'
        return (
          <span className="text-xs text-muted-foreground truncate block" title={message}>
            {message}
          </span>
        )
      },
    },
    {
      headerName: t('status') || 'Status',
      field: 'is_replied',
      filter: false,
      width: 140,
      cellRenderer: (params: { data?: ContactMessage }) => {
        const item = params.data
        if (!item) return null

        if (item.is_replied) {
          return (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              title={item.replied_at ? `${t('repliedAt')}: ${item.replied_at}` : undefined}
            >
              <CheckCircle2 className="w-3 h-3" />
              {t('replied') || 'Replied'}
            </span>
          )
        }

        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            {t('pending') || 'Pending'}
          </span>
        )
      },
    },
    {
      headerName: t('createdAt') || 'Created',
      field: 'created_at',
      filter: false,
      width: 170,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: t('actions') || 'Actions',
      filter: false,
      width: 130,
      cellClass: 'flex items-center justify-start h-full',
      cellRenderer: (params: { data?: ContactMessage }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              title={t('view') || 'View'}
              onClick={() => setViewingItem(item)}
            >
              <Eye className="h-4 w-4 text-blue-500" />
            </Button>
            {canReply && (
              <Button
                variant="ghost"
                size="icon-sm"
                title={t('reply') || 'Reply'}
                onClick={() => (onReplyItem ? onReplyItem(item) : setViewingItem(item))}
              >
                <MessageSquareReply className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                title={t('delete') || 'Delete'}
                onClick={() => setDeletingItem(item)}
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
