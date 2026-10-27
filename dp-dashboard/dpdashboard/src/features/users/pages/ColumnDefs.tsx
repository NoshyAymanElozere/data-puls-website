import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { UserStatusToggle } from '@/shared/components/UserStatusToggle'
import type { UserListItem, UserStatus } from '@/features/users/api/useUsers'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { AccessTypeBadge } from '../components/AccessTypeBadge'

interface ColumnDefsProps {
  t: (key: string) => string
  statusMutation: { mutateAsync: (args: { id: number; status: UserStatus }) => Promise<unknown> }
  setEditingItem: (item: UserListItem) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: UserListItem) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
  lang?: string
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
  lang = 'en',
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
      headerName: t('phone'),
      field: 'phone',
      filter: false,
      width: 140,
    },
    {
      headerName: t('city'),
      colId: 'city',
      filter: false,
      sortable: false,
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: { data?: UserListItem }) => {
        const item = params.data
        if (!item) return null
        const cityName = getLocalizedValue(item.city?.name, lang)
        const countryName = getLocalizedValue(item.country?.name, lang)
        if (!cityName && !countryName) return <span className="text-muted-foreground">-</span>
        return (
          <div className="flex flex-col justify-center h-full leading-tight min-w-0">
            <span className="text-sm font-semibold text-foreground truncate">{cityName || '-'}</span>
            {countryName && (
              <span className="text-[11px] text-muted-foreground truncate">{countryName}</span>
            )}
          </div>
        )
      },
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
      headerName: t('accessType'),
      field: 'access_type',
      filter: false,
      width: 170,
      cellRenderer: (params: { data?: UserListItem }) => {
        const item = params.data
        if (!item) return null
        return <AccessTypeBadge value={item.access_type} />
      },
    },
    {
      headerName: t('invoicesCount'),
      field: 'invoices_count',
      filter: false,
      width: 110,
      valueFormatter: (params) => (params.value != null ? String(params.value) : '-'),
    },
    {
      headerName: t('familyMembersCount'),
      field: 'family_members_count',
      filter: false,
      width: 130,
      valueFormatter: (params) => (params.value != null ? String(params.value) : '-'),
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
