import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { UserStatusToggle } from '@/shared/components/UserStatusToggle'
import type { UserListItem, UserStatus } from '@/features/users/api/useUsers'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface ColumnDefsProps {
  t: (key: string) => string
  statusMutation: { mutateAsync: (args: { id: number; status: UserStatus }) => Promise<unknown> }
  setEditingItem: (item: UserListItem) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: UserListItem) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getUsersColumnDefs({
  t,
  statusMutation,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
  canUpdate = true,
  canDelete = true,
}: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: t('name'),
      field: 'name',
      filter: false,
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: t('email'),
      field: 'email',
      filter: false,
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: t('phone'),
      field: 'phone',
      filter: false,
      width: 140,
    },
    {
      headerName: t('gender'),
      field: 'gender',
      filter: false,
      width: 110,
      valueFormatter: (params) => {
        if (!params.value) return '-'
        return params.value === 'male' ? t('male') : t('female')
      },
    },
    {
      headerName: t('age'),
      field: 'age',
      filter: false,
      width: 80,
      valueFormatter: (params) => (params.value != null ? String(params.value) : '-'),
    },
    {
      headerName: t('subscribed'),
      field: 'is_subscribed',
      filter: false,
      width: 120,
      cellRenderer: (params: { data?: UserListItem }) => {
        const item = params.data
        if (!item) return null
        return (
          <Badge variant={item.is_subscribed ? 'success' : 'secondary'} dot>
            {item.is_subscribed ? t('yes') : t('no')}
          </Badge>
        )
      },
    },
    {
      headerName: t('status'),
      field: 'status',
      filter: false,
      width: 160,
      cellRenderer: (params: { data?: UserListItem }) => {
        const item = params.data
        if (!item) return null
        return (
          <UserStatusToggle
            value={item.status}
            onChange={(status) => statusMutation.mutateAsync({ id: item.id, status })}
            disabled={!canUpdate}
          />
        )
      },
    },
    {
      headerName: t('registeredAt'),
      field: 'created_at',
      filter: false,
      width: 170,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: t('actions'),
      filter: false,
      sortable: false,
      width: 140,
      cellRenderer: (params: { data?: UserListItem }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-1 h-full">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditingItem(item)
                setIsViewOnly(true)
                setIsModalOpen(true)
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canUpdate && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setEditingItem(item)
                  setIsViewOnly(false)
                  setIsModalOpen(true)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" size="icon-sm" onClick={() => setDeletingItem(item)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
