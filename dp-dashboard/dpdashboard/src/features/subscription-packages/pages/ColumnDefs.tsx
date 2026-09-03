import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutate: (id: number) => void }
  setEditingItem: (item: unknown) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: unknown) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getSubscriptionPackagesColumnDefs({
  t,
  lang,
  toggleMutation,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
  canUpdate = true,
  canDelete = true,
}: ColumnDefsProps): ColDef[] {
  return [
    localizedNameColumnDef(t, lang),
    {
      headerName: t('maximumFamilyMembers'),
      field: 'maximum_family_members',
      filter: false,
      width: 160,
    },
    {
      headerName: t('sortOrder'),
      field: 'sort_order',
      filter: false,
      width: 120,
    },
    {
      headerName: t('subscribers'),
      field: 'subscribers_count',
      filter: false,
      width: 130,
      valueFormatter: (params) => String(params.value ?? 0),
    },
    {
      headerName: t('status'),
      field: 'is_active',
      filter: false,
      width: 150,
      cellRenderer: (params: { data?: { id: number; is_active: boolean } }) => {
        const item = params.data
        if (!item) return null
        return (
          <StatusToggle
            value={item.is_active}
            onChange={() => toggleMutation.mutateAsync(item.id)}
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
      cellRenderer: (params: { data?: Record<string, unknown> }) => {
        const item = params.data
        if (!item) return null
        return (
          <SubscriptionPackageActions
            item={item}
            t={t}
            canUpdate={canUpdate}
            canDelete={canDelete}
            setEditingItem={setEditingItem}
            setIsModalOpen={setIsModalOpen}
            setDeletingItem={setDeletingItem}
            setIsViewOnly={setIsViewOnly}
          />
        )
      },
    },
  ]
}

function SubscriptionPackageActions({
  item,
  t,
  canUpdate,
  canDelete,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
}: {
  item: Record<string, unknown>
  t: (key: string) => string
  canUpdate: boolean
  canDelete: boolean
  setEditingItem: (item: unknown) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: unknown) => void
  setIsViewOnly: (view: boolean) => void
}) {
  const navigate = useNavigate()

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
          onClick={() => navigate(`/subscription-packages/${item.id}`)}
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
}
