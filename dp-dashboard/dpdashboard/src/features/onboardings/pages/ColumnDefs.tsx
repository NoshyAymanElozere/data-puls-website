import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue, localizedNameColumnDef } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Onboarding } from '../api/useOnboardings'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutate: (id: number) => void; mutateAsync?: (id: number) => Promise<unknown> }
  setEditingItem: (item: Onboarding) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: Onboarding) => void
  setIsViewOnly: (view: boolean) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getOnboardingsColumnDefs({
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
      headerName: t('image') || 'Image',
      field: 'image_url',
      filter: false,
      sortable: false,
      width: 90,
      cellRenderer: (params: { data?: Onboarding }) => {
        const url = params.data?.image_url
        if (!url) {
          return <span className="text-xs text-muted-foreground">—</span>
        }
        return (
          <div className="flex items-center h-full py-1">
            <img src={url} alt="" className="h-9 w-9 rounded-lg object-cover border border-border/60" />
          </div>
        )
      },
    },
    localizedNameColumnDef(t, lang, { field: 'title', headerKey: 'title' }),
    {
      headerName: t('description') || 'Description',
      field: 'description',
      filter: false,
      flex: 1.2,
      valueGetter: (params) => {
        const data = params.data as Onboarding | undefined
        if (!data) return ''
        const text = getLocalizedValue(data.description, lang)
        return text.length > 80 ? `${text.slice(0, 80)}…` : text
      },
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
      cellRenderer: (params: { data?: Onboarding }) => {
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
      cellRenderer: (params: { data?: Onboarding }) => {
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
