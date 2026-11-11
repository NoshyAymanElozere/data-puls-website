import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import type { ColDef } from 'ag-grid-community'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { onboardingMediaFields, type Onboarding } from '../api/useOnboardings'

interface ColumnDefsProps {
  t: (key: string) => string
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
      headerName: t('onboardingMediaType') || 'Type',
      field: 'type',
      filter: false,
      sortable: false,
      width: 170,
      cellRenderer: (params: { data?: Onboarding }) => {
        const type = params.data?.type ?? 'image'
        const mode = params.data?.video_mode
        return (
          <div className="flex items-center gap-1.5 h-full">
            <span
              className={
                type === 'video'
                  ? 'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold bg-violet-500/10 text-violet-600'
                  : 'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold bg-sky-500/10 text-sky-600'
              }
            >
              {t(type)}
            </span>
            {type === 'video' && mode && (
              <span className="text-[11px] font-semibold text-muted-foreground">
                {t(mode === 'shared' ? 'onboardingVideoModeSharedShort' : 'onboardingVideoModePerLanguageShort')}
              </span>
            )}
          </div>
        )
      },
    },
    {
      headerName: t('onboardingMedia') || 'Media',
      filter: false,
      sortable: false,
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: { data?: Onboarding }) => (
        <div className="flex items-center gap-1.5 h-full py-1">
          {onboardingMediaFields(params.data?.type, params.data?.video_mode).map((field) => {
            const url = params.data?.[`${field}_url`]
            if (url && params.data?.type === 'video') {
              return (
                <video
                  key={field}
                  src={url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-9 w-9 rounded-lg object-cover bg-muted border border-border/60"
                />
              )
            }
            return url ? (
              <img
                key={field}
                src={url}
                alt=""
                className="h-9 w-9 rounded-lg object-contain bg-muted border border-border/60"
              />
            ) : (
              <span
                key={field}
                className="h-9 w-9 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground"
              >
                —
              </span>
            )
          })}
        </div>
      ),
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
