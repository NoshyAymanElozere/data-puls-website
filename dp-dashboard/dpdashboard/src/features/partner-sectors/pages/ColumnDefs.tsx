import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { PartnerSector } from '../api/usePartnerSectors'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutateAsync: (id: number) => Promise<unknown> }
  onView: (item: PartnerSector) => void
  onEdit: (item: PartnerSector) => void
  onDelete: (item: PartnerSector) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getPartnerSectorsColumnDefs({
  t,
  lang,
  toggleMutation,
  onView,
  onEdit,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: ColumnDefsProps): ColDef[] {
  return [
    localizedNameColumnDef(t, lang, { field: 'name', headerKey: 'name' }),
    {
      headerName: t('partnersCount'),
      field: 'partners_count',
      filter: false,
      width: 140,
    },
    {
      headerName: t('sortOrder'),
      field: 'sort_order',
      filter: false,
      width: 120,
    },
    {
      headerName: t('status'),
      field: 'is_active',
      filter: false,
      width: 150,
      cellRenderer: (params: { data?: PartnerSector }) => {
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
      cellRenderer: (params: { data?: PartnerSector }) => {
        const item = params.data
        if (!item) return null
        return (
          <div className="flex items-center gap-1 h-full">
            <Button variant="ghost" size="icon-sm" title={t('view')} onClick={() => onView(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            {canUpdate && (
              <Button variant="ghost" size="icon-sm" title={t('edit')} onClick={() => onEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button variant="ghost" size="icon-sm" title={t('delete')} onClick={() => onDelete(item)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]
}
