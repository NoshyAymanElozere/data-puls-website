import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutTemplate, ShieldOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { SearchInput } from '@/shared/components/input'
import { Pagination } from '@/shared/components/pagination'
import { useTableState } from '@/shared/hooks/useTableState'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { useScreensList } from '../api/useScreens'
import { GlobalThemeCard, ScreenCard } from '../components/ScreenCard'
import { SCREEN_GROUPS, SCREEN_TYPES, SCREENS_PERMISSIONS } from '../constants'

const selectClass = 'w-full sm:w-44 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold'

export function ScreensNoPermission() {
  const { t } = useTranslation()
  return (
    <Card className="border-border/60 shadow-sm rounded-2xl p-10 bg-card">
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        <ShieldOff className="h-8 w-8 opacity-60" />
        <p className="text-sm font-semibold">{t('noActionPermission')}</p>
      </div>
    </Card>
  )
}

export default function ScreensPage() {
  const { t } = useTranslation()
  const label = t('appScreens')
  const table = useTableState({ pageSize: 24 })
  const { data: admin, isLoading: profileLoading } = useProfile()
  const canView = hasPermission(admin, SCREENS_PERMISSIONS.view)

  const [typeFilter, setTypeFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')

  const { data: paginatedData, isLoading, isFetching } = useScreensList({
    page: table.page,
    search: table.search,
    type: typeFilter,
    group: groupFilter,
    perPage: table.pageSize,
  })

  if (!profileLoading && !canView) return <ScreensNoPermission />

  const items = paginatedData?.data ?? []
  const globalItems = items.filter((item) => item.type === 'global')
  const screenItems = items.filter((item) => item.type !== 'global')
  const meta = paginatedData?.meta
  const hasFilters = !!(table.search || typeFilter || groupFilter)

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40 px-6 py-5">
        <div>
          <CardTitle className="text-lg font-bold text-foreground">{label}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{t('appScreensSubtitle')}</p>
        </div>
        {meta?.total !== undefined && (
          <span className="text-xs font-semibold text-muted-foreground">
            {t('total')}: {meta.total}
          </span>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder={`${t('search')} ${label}...`}
              value={table.search}
              onChange={(e) => table.setSearch(e.target.value)}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              table.setPage(1)
            }}
            className={selectClass}
            aria-label={t('type')}
          >
            <option value="">{`${t('type')}: ${t('all')}`}</option>
            {SCREEN_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`screenType_${type}`)}
              </option>
            ))}
          </select>
          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value)
              table.setPage(1)
            }}
            className={selectClass}
            aria-label={t('screenGroup')}
          >
            <option value="">{`${t('screenGroup')}: ${t('all')}`}</option>
            {SCREEN_GROUPS.map((group) => (
              <option key={group} value={group}>
                {t(`screenGroup_${group}`)}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[22rem] animate-pulse rounded-2xl bg-muted/60" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <LayoutTemplate className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm font-semibold">{hasFilters ? t('screensNoResults') : t('screensEmpty')}</p>
          </div>
        ) : (
          <div className={isFetching ? 'opacity-70 transition-opacity' : 'transition-opacity'}>
            {globalItems.map((item) => (
              <div key={item.id} className="mb-5">
                <GlobalThemeCard item={item} />
              </div>
            ))}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {screenItems.map((item) => (
                <ScreenCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {(meta?.last_page ?? 1) > 1 && (
          <div className="flex justify-center pt-2" dir="ltr">
            <Pagination page={table.page} totalPages={meta?.last_page ?? 1} onPageChange={table.setPage} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
