import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'

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

export function getContactSubjectsColumnDefs({
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
      headerName: t('sortOrder') || 'Sort Order',
      field: 'sort_order',
      filter: false,
      width: 120,
    },
    {
      headerName: t('status') || 'Status',
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
      headerName: t('actions') || 'Actions',
      filter: false,
      sortable: false,
      width: 140,
      cellRenderer: (params: { data?: Record<string, unknown> }) => {
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
