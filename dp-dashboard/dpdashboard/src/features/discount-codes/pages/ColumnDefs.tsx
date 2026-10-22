import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { StatusToggle } from '@/shared/components/StatusToggle'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import type { ColDef } from 'ag-grid-community'
import { Eye, History, Pencil, Trash2 } from 'lucide-react'
import {
  AVAILABILITY_BADGE_VARIANTS,
  AVAILABILITY_LABEL_KEYS,
  DISCOUNT_TYPE_LABEL_KEYS,
  formatDiscountValue,
  type DiscountCode,
} from '../api/useDiscountCodes'

interface ColumnDefsProps {
  t: (key: string) => string
  lang: string
  toggleMutation: { mutate: (id: number) => void; mutateAsync?: (id: number) => Promise<unknown> }
  setEditingItem: (item: DiscountCode) => void
  setIsModalOpen: (open: boolean) => void
  setDeletingItem: (item: DiscountCode) => void
  setIsViewOnly: (view: boolean) => void
  setUsageItem: (item: DiscountCode) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export function getDiscountCodesColumnDefs({
  t,
  lang,
  toggleMutation,
  setEditingItem,
  setIsModalOpen,
  setDeletingItem,
  setIsViewOnly,
  setUsageItem,
  canUpdate = true,
  canDelete = true,
}: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: t('code'),
      field: 'code',
      filter: false,
      minWidth: 140,
      flex: 1,
      cellRenderer: (params: { data?: DiscountCode }) => {
        const item = params.data
        if (!item) return null
        return (
          <span className="font-mono font-bold text-foreground tracking-wide" dir="ltr">
            {item.code}
          </span>
        )
      },
    },
    {
      headerName: t('discountCodeOwner'),
      field: 'owner_name',
      filter: false,
      minWidth: 160,
      flex: 1.2,
      cellRenderer: (params: { data?: DiscountCode }) => {
        const item = params.data
        if (!item) return null
        if (!item.owner_name) return <span className="text-muted-foreground">—</span>
        return (
          <div className="flex flex-col justify-center h-full leading-tight">
            <span className="font-semibold text-foreground truncate">{item.owner_name}</span>
            {item.owner_contact && (
              <span className="text-xs text-muted-foreground truncate" dir="ltr">
                {item.owner_contact}
              </span>
            )}
          </div>
        )
      },
    },
    {
      headerName: t('type'),
      field: 'type',
      filter: false,
      width: 160,
      valueGetter: (params) => {
        const data = params.data as DiscountCode | undefined
        if (!data) return ''
        return t(DISCOUNT_TYPE_LABEL_KEYS[data.type]) || data.type_label || data.type
      },
    },
    {
      headerName: t('discountCodeValue'),
      field: 'value',
      filter: false,
      width: 120,
      valueGetter: (params) => {
        const data = params.data as DiscountCode | undefined
        if (!data) return ''
        return formatDiscountValue(data, t)
      },
    },
    {
      headerName: t('package'),
      field: 'package',
      filter: false,
      minWidth: 140,
      flex: 1,
      valueGetter: (params) => {
        const data = params.data as DiscountCode | undefined
        if (!data) return ''
        return data.package ? getLocalizedValue(data.package.name, lang) : t('discountCodeAnyPackage')
      },
    },
    {
      headerName: t('discountCodeUses'),
      field: 'uses_count',
      filter: false,
      width: 120,
      valueGetter: (params) => {
        const data = params.data as DiscountCode | undefined
        if (!data) return ''
        return `${data.uses_count} / ${data.max_uses ?? '∞'}`
      },
    },
    {
      headerName: t('discountCodeAvailability'),
      field: 'availability',
      filter: false,
      width: 130,
      cellRenderer: (params: { data?: DiscountCode }) => {
        const item = params.data
        if (!item) return null
        return (
          <Badge variant={AVAILABILITY_BADGE_VARIANTS[item.availability] ?? 'outline'} dot>
            {t(AVAILABILITY_LABEL_KEYS[item.availability]) || item.availability_label}
          </Badge>
        )
      },
    },
    {
      headerName: t('discountCodeExpiresAt'),
      field: 'expires_at',
      filter: false,
      minWidth: 160,
      valueGetter: (params) => {
        const data = params.data as DiscountCode | undefined
        return data?.expires_at || '—'
      },
    },
    {
      headerName: t('status'),
      field: 'is_active',
      filter: false,
      width: 150,
      cellRenderer: (params: { data?: DiscountCode }) => {
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
      headerName: t('actions'),
      filter: false,
      sortable: false,
      width: 180,
      cellRenderer: (params: { data?: DiscountCode }) => {
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
            <Button
              variant="ghost"
              size="icon-sm"
              title={t('discountCodeUsageLog')}
              onClick={() => setUsageItem(item)}
            >
              <History className="h-4 w-4" />
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
