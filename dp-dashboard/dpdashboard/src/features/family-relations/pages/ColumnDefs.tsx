import type { ColDef } from 'ag-grid-community'
import type { TFunction } from 'i18next'
import { Edit2, Eye, HeartHandshake, Trash2 } from 'lucide-react'
import { StatusToggle } from '@/shared/components/StatusToggle'
import type { FamilyRelationListItem } from '../types/family-relations'

interface FamilyRelationsColumnDefsProps {
  t: TFunction
  isRtl?: boolean
  onView: (relation: FamilyRelationListItem) => void
  onEdit: (relation: FamilyRelationListItem) => void
  onDelete: (relation: FamilyRelationListItem) => void
  onToggleStatus: (relation: FamilyRelationListItem) => void
}

export function getFamilyRelationsColumnDefs({
  t,
  isRtl = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: FamilyRelationsColumnDefsProps): ColDef<FamilyRelationListItem>[] {
  return [
    {
      headerName: '#',
      field: 'id',
      width: 80,
      filter: false,
      sortable: true,
      cellRenderer: (params: { value: number }) => (
        <span className="font-mono text-xs font-bold text-muted-foreground">
          #{params.value}
        </span>
      ),
    },
    {
      headerName: t('relationName'),
      field: 'name',
      flex: 2,
      minWidth: 160,
      cellRenderer: (params: { data: FamilyRelationListItem }) => {
        if (!params.data) return null
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-main/10 text-main shrink-0">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground text-xs">
              {params.data.name}
            </span>
          </div>
        )
      },
    },
    {
      headerName: t('sortOrderCol'),
      field: 'sort_order',
      width: 120,
      cellRenderer: (params: { value: number }) => (
        <span className="font-black text-xs text-foreground bg-muted px-2.5 py-1 rounded-md">
          {params.value}
        </span>
      ),
    },
    {
      headerName: t('status'),
      field: 'is_active',
      width: 160,
      cellRenderer: (params: { data: FamilyRelationListItem; value: boolean }) => {
        if (!params.data) return null
        return (
          <StatusToggle
            value={params.data.is_active}
            onChange={() => onToggleStatus(params.data)}
          />
        )
      },
    },
    {
      headerName: t('createdAt'),
      field: 'created_at',
      width: 160,
      cellRenderer: (params: { value: string }) => (
        <span className="text-xs text-muted-foreground font-medium">
          {params.value}
        </span>
      ),
    },
    {
      headerName: t('actions'),
      width: 130,
      sortable: false,
      filter: false,
      pinned: isRtl ? 'left' : 'right',
      cellRenderer: (params: { data: FamilyRelationListItem }) => {
        if (!params.data) return null
        return (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onView(params.data)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-main hover:bg-main/10 transition-colors cursor-pointer"
              title={t('view')}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(params.data)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
              title={t('edit')}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(params.data)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title={t('delete')}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      },
    },
  ]
}
