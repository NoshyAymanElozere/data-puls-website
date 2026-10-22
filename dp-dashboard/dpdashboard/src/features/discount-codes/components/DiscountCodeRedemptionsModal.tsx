import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColDef } from 'ag-grid-community'
import { Badge, type BadgeProps } from '@/shared/components/badge'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import ModalStatus from '@/shared/components/modal-status'
import {
  useDiscountCodeRedemptions,
  type DiscountCode,
  type DiscountCodeRedemption,
  type DiscountRedemptionStatus,
} from '../api/useDiscountCodes'

function getRedemptionStatusVariant(status: DiscountRedemptionStatus): BadgeProps['variant'] {
  switch (status) {
    case 'completed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'secondary'
    default:
      return 'outline'
  }
}

function formatAmount(amount: number, currency: string) {
  return `${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currency}`
}

interface DiscountCodeRedemptionsModalProps {
  item: DiscountCode | null
  onClose: () => void
}

export function DiscountCodeRedemptionsModal({ item, onClose }: DiscountCodeRedemptionsModalProps) {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [item?.id])

  const { data, isLoading } = useDiscountCodeRedemptions(item?.id ?? null, page)
  const rows = data?.data ?? []

  const columnDefs = useMemo<ColDef<DiscountCodeRedemption>[]>(
    () => [
      {
        headerName: t('user'),
        filter: false,
        sortable: false,
        flex: 1.4,
        minWidth: 200,
        cellRenderer: (params: { data?: DiscountCodeRedemption }) => {
          const user = params.data?.user
          if (!user) return <span className="text-muted-foreground">—</span>
          return (
            <div className="flex flex-col justify-center h-full leading-tight min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">{user.name || user.email || '—'}</span>
              <span className="text-xs text-muted-foreground truncate" dir="ltr">
                {user.phone || user.email || '—'}
              </span>
            </div>
          )
        },
      },
      {
        headerName: t('status'),
        filter: false,
        sortable: false,
        width: 130,
        cellRenderer: (params: { data?: DiscountCodeRedemption }) => {
          const row = params.data
          if (!row) return null
          return (
            <Badge variant={getRedemptionStatusVariant(row.status)} dot>
              {row.status_label}
            </Badge>
          )
        },
      },
      {
        headerName: t('discountCodeOriginalAmount'),
        filter: false,
        sortable: false,
        width: 140,
        valueGetter: (params) => (params.data ? formatAmount(params.data.original_amount, params.data.currency) : ''),
      },
      {
        headerName: t('discountCodeDiscountAmount'),
        filter: false,
        sortable: false,
        width: 130,
        valueGetter: (params) => (params.data ? formatAmount(params.data.discount_amount, params.data.currency) : ''),
      },
      {
        headerName: t('discountCodeFinalAmount'),
        filter: false,
        sortable: false,
        width: 140,
        valueGetter: (params) => (params.data ? formatAmount(params.data.final_amount, params.data.currency) : ''),
      },
      {
        headerName: t('discountCodeRedeemedAt'),
        filter: false,
        sortable: false,
        minWidth: 170,
        flex: 1,
        valueGetter: (params) => params.data?.redeemed_at || params.data?.created_at || '—',
      },
    ],
    [t]
  )

  return (
    <ModalStatus
      open={!!item}
      onOpenChange={(v) => !v && onClose()}
      title={`${t('discountCodeUsageLog')} — ${item?.code ?? ''}`}
      agreeLabel={t('close')}
      cancelLabel={null}
      onAgreeButtonClick={onClose}
      onCancelButtonClick={onClose}
      size="3xl"
    >
      <div className="space-y-3" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        {item && (
          <p className="text-sm text-muted-foreground">
            {t('discountCodeUses')}: <span className="font-bold text-foreground">{item.uses_count}</span>
            {' · '}
            {t('discountCodePendingUses')}:{' '}
            <span className="font-bold text-foreground">{item.pending_uses_count}</span>
          </p>
        )}

        {!isLoading && rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">{t('discountCodeNoRedemptions')}</p>
        ) : (
          <GenericDataGrid
            rowData={rows}
            columnDefs={columnDefs}
            rowHeight={56}
            headerHeight={48}
            height={420}
            loading={isLoading}
            defaultColDef={{ filter: false, sortable: false }}
            isServerSide
            currentPage={page}
            totalPages={data?.meta?.last_page ?? 1}
            onPageChange={setPage}
            paginationLinks={data?.meta?.links ?? data?.links}
          />
        )}
      </div>
    </ModalStatus>
  )
}
