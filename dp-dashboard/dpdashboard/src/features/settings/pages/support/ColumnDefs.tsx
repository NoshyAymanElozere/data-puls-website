import { Button } from '@/shared/components/button'
import type { ColDef } from 'ag-grid-community'
import { Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLocalizedValue } from '@/shared/utils/localized-value'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  setViewingItem: (item: unknown) => void
  setDeletingItem: (item: unknown) => void
  canDelete?: boolean
}

export function getSupportColumnDefs({
  t,
  lang,
  setViewingItem,
  setDeletingItem,
  canDelete = true,
}: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: t('email') || 'Email',
      field: 'user.email',
      filter: false,
      flex: 1,
      cellRenderer: (params: { data?: { user?: { id: number; email: string } } }) => {
        const user = params.data?.user
        if (!user?.email) return '-'
        return (
          <Link to={`/users/${user.id}`} className="text-primary hover:underline text-sm">
            {user.email}
          </Link>
        )
      },
    },
    {
      headerName: t('contactPhone') || 'Phone',
      field: 'user.phone',
      filter: false,
      width: 140,
      valueGetter: (params) => params.data?.user?.phone || '-',
    },
    {
      headerName: t('subject') || 'Subject',
      field: 'subject.name',
      filter: false,
      flex: 1.5,
      valueGetter: (params) => getLocalizedValue(params.data?.subject?.name, lang) || '-',
    },
    {
      headerName: t('createdAt') || 'Created',
      field: 'created_at',
      filter: false,
      width: 200,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: t('actions') || 'Actions',
      filter: false,
      width: 120,
      cellClass: 'flex items-center justify-start h-full',
      cellRenderer: (params: { data?: Record<string, unknown> }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-start gap-1.5">
            <Button variant="ghost" size="icon-sm" onClick={() => setViewingItem(item)}>
              <Eye className="h-4 w-4 text-blue-500" />
            </Button>
            {canDelete && (
              <Button variant="ghost" size="icon-sm" onClick={() => setDeletingItem(item)}>
                <Trash2 className="h-4 w-4 text-rose-500" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
