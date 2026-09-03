import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { getWarrantyPeriodName, type WarrantyPeriod } from '../api/useWarrantyPeriods'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutate: (id: number) => void; mutateAsync?: (id: number) => Promise<unknown> }
  setEditingItem: (item: WarrantyPeriod) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: WarrantyPeriod) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getWarrantyPeriodsColumnDefs({
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
    {
      headerName: t('duration') || 'Duration',
      field: 'duration',
      filter: false,
      width: 100,
    },
    {
      headerName: t('unit') || 'Unit',
      field: 'unit',
      filter: false,
      width: 120,
      valueGetter: (params) => {
        const data = params.data as WarrantyPeriod | undefined
        if (!data) return ''
        return t(data.unit) || data.unit
      },
    },
    {
      headerName: t('name') || 'Name',
      field: 'name',
      filter: false,
      flex: 1.2,
      valueGetter: (params) => {
        const data = params.data as WarrantyPeriod | undefined
        if (!data) return ''
        return getWarrantyPeriodName(data, lang)
      },
    },
    {
      headerName: t('months') || 'Months',
      field: 'months',
      filter: false,
      width: 100,
    },
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
      cellRenderer: (params: { data?: WarrantyPeriod }) => {
        const item = params.data
        if (!item) return null
        return (
          <StatusToggle
            value={item.is_active}
            onChange={() => toggleMutation.mutateAsync?.(item.id) ?? toggleMutation.mutate(item.id)}
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
      cellRenderer: (params: { data?: WarrantyPeriod }) => {
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
