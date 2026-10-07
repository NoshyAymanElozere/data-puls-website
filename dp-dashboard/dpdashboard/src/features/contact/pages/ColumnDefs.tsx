import type { ColDef } from 'ag-grid-community'
import type { TFunction } from 'i18next'
import { Button } from '@/shared/components/button'
import { Eye, Trash2, Mail, MapPin, Phone, MessageSquare } from 'lucide-react'
import type { Contact } from '../api/useContact'

interface GetColumnDefsParams {
  t: TFunction
  onViewClick: (item: Contact) => void
  onDeleteClick: (item: Contact) => void
}

export function getContactColumnDefs({
  t,
  onViewClick,
  onDeleteClick
}: GetColumnDefsParams): ColDef<Contact>[] {
  return [
    {

      headerName: t('senderName') || 'Sender Name',
      filter: false,
      field: 'name',
      flex: 1.2,
      minWidth: 160,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-3 py-1.5">
            <div className="h-8 w-8 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs shrink-0 border border-brand-500/20">
              {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 truncate">{item.name || '-'}</span>
          </div>
        )
      }
    },
    {

      headerName: t('emailAddress') || 'Email Address',
      filter: false,
      field: 'email',
      flex: 1.4,
      minWidth: 170,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <a href={`mailto:${item.email}`} className="hover:underline truncate">{item.email || '-'}</a>
          </div>
        )
      }
    },
   

    {

      headerName: t('subject') || 'Subject',
      filter: false,
      field: 'subject',
      flex: 1.2,
      minWidth: 140,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item) return null
        return (
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate block">
            {item.subject || 'General Inquiry'}
          </span>
        )
      }
    },
    {

      headerName: t('messageSnippet') || 'Message Snippet',
      filter: false,
      field: 'message',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-brand-400 shrink-0" />
            <span className="truncate">{item.message || '-'}</span>
          </div>
        )
      }
    },
    {

      headerName: t('receivedAt') || 'Received At',
      filter: false,
      field: 'createdAt',
      flex: 1,
      minWidth: 130,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item || !item.createdAt) return <span className="text-xs text-muted-foreground">-</span>
        const date = new Date(item.createdAt)
        return (
          <span className="text-xs text-muted-foreground font-mono">
            {date.toLocaleDateString()}
          </span>
        )
      }
    },
    {

      headerName: t('actions') || 'Actions',
      filter: false,
      field: '_id',
      width: 110,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const item: Contact = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-end gap-1.5 h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewClick(item)}
              title="View Message Details"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteClick(item)}
              title="Delete Message"
              className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]
}
