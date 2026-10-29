import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { PartnerListItem } from '../api/usePartners'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutateAsync: (id: number) => Promise<unknown> }
  onView: (item: PartnerListItem) => void
  onEdit: (item: PartnerListItem) => void
  onDelete: (item: PartnerListItem) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getPartnersColumnDefs({
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
    {
      headerName: t('partnerLogo'),
      field: 'logo_url',
      filter: false,
      sortable: false,
      width: 90,
      cellRenderer: (params: { data?: PartnerListItem }) => {
        const url = params.data?.logo_url
        if (!url) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <div className="flex items-center h-full py-1">
            <img src={url} alt="" className="h-9 w-9 rounded-lg object-cover border border-border/60 bg-white" />
          </div>
        )
      },
    },
    localizedNameColumnDef(t, lang, { field: 'name', headerKey: 'name' }),
    {
      headerName: t('partnerSector'),
      field: 'sector',
      filter: false,
      flex: 1,
      valueGetter: (params) => (params.data as PartnerListItem | undefined)?.sector || '—',
    },
    {
      headerName: t('city'),
      field: 'city',
      filter: false,
      width: 150,
      valueGetter: (params) => (params.data as PartnerListItem | undefined)?.city || '—',
    },
    {
      headerName: t('sortOrder'),
      field: 'sort_order',
      filter: false,
      width: 110,
    },
    {
      headerName: t('status'),
      field: 'is_active',
      filter: false,
      width: 150,
      cellRenderer: (params: { data?: PartnerListItem }) => {
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
      cellRenderer: (params: { data?: PartnerListItem }) => {
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
