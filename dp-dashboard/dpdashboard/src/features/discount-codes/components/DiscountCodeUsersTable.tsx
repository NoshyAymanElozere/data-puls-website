import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColDef } from 'ag-grid-community'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { useDiscountCodeRedemptions, type DiscountCodeRedemption } from '../api/useDiscountCodes'

/** Users who used a coupon, with the usage date. Shown in the coupon details view. */
export function DiscountCodeUsersTable({ codeId }: { codeId: number }) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [codeId])

  const { data, isLoading } = useDiscountCodeRedemptions(codeId, page)
  const rows = data?.data ?? []

  const columnDefs = useMemo<ColDef<DiscountCodeRedemption>[]>(
    () => [
      {
        headerName: t('discountCodeUserId'),
        filter: false,
        sortable: false,
        width: 110,
        valueGetter: (params) => (params.data?.user ? `#${params.data.user.id}` : '—'),
      },
      {
        headerName: t('user'),
        filter: false,
        sortable: false,
        flex: 1.4,
        minWidth: 180,
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
        headerName: t('discountCodeRedeemedAt'),
        filter: false,
        sortable: false,
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.data?.redeemed_at || params.data?.created_at || '—',
      },
    ],
    [t]
  )

  return (
    <section className="space-y-2">
      <h4 className="text-sm font-bold text-foreground">
        {t('discountCodeUsersTitle')}
        {data?.meta?.total != null && (
          <span className="ms-2 text-xs font-medium text-muted-foreground">({data.meta.total})</span>
        )}
      </h4>
      {!isLoading && rows.length === 0 ? (
        <p className="rounded-xl border border-border/60 py-8 text-center text-sm text-muted-foreground">
          {t('discountCodeNoRedemptions')}
        </p>
      ) : (
        <GenericDataGrid
          rowData={rows}
          columnDefs={columnDefs}
          rowHeight={52}
          headerHeight={44}
          height={320}
          loading={isLoading}
          defaultColDef={{ filter: false, sortable: false }}
          isServerSide
          currentPage={page}
          totalPages={data?.meta?.last_page ?? 1}
          onPageChange={setPage}
          paginationLinks={data?.meta?.links ?? data?.links}
        />
      )}
    </section>
  )
}
