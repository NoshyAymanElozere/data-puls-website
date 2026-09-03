import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue, localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutateAsync: (id: number) => Promise<unknown> }
  setEditingItem: (item: unknown) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: unknown) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getCitiesColumnDefs({
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
      headerName: t('country') || 'Country',
      filter: false,
      flex: 1,
      valueGetter: (params) => {
        const country = params.data?.country
        if (!country) return '-'
        return getLocalizedValue(country.name, lang) || '-'
      },
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
      width: 150,
      cellClass: 'flex items-center justify-start h-full',
      cellRenderer: (params: { data?: Record<string, unknown> }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center justify-start gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditingItem(item)
                setIsViewOnly(true)
                setIsModalOpen(true)
              }}
            >
              <Eye className="h-4 w-4 text-blue-500" />
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
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
            )}
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
