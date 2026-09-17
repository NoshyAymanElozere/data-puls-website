import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckCircle2, CircleDashed, FilterX, Percent, ScrollText, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { GenericDataGrid } from '@/shared/components/GenericDataGrid'
import { SearchInput } from '@/shared/components/input'
import { ModalStatus } from '@/shared/components/modal-status'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useDeleteNotificationLog,
  useNotificationLogsList,
  type NotificationLogItem,
} from '../../api/useNotificationLogs'
import { EVENT_CATALOG } from '../settings/eventTokensCatalog'
import { getLogsColumnDefs } from './LogsColumnDefs'
import { NotificationLogDetailModal } from './NotificationLogDetailModal'

export default function NotificationLogsPage() {
  const { t, i18n } = useTranslation()
  const { data: admin } = useProfile()
  const isRtl = i18n.language === 'ar'

  const canDelete = hasPermission(admin, 'notification_logs.delete')
  const canSend = hasPermission(admin, 'notification_logs.create')

  // Filter states
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Modals state
  const [viewingLogId, setViewingLogId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<NotificationLogItem | null>(null)

  const { data: paginatedData, isLoading } = useNotificationLogsList({
    page,
    search,
    type: typeFilter,
    is_read: readFilter,
    date_from: dateFrom,
    date_to: dateTo,
  })

  const deleteMutation = useDeleteNotificationLog()

  const items = paginatedData?.data ?? []
  const totalLogs = paginatedData?.meta?.total ?? 0

  // Calculate stats based on current returned data
  const readCount = items.filter((i) => i.is_read).length
  const unreadCount = items.filter((i) => !i.is_read).length
  const readRate = items.length > 0 ? Math.round((readCount / items.length) * 100) : 0

  const handleResetFilters = () => {
    setSearch('')
    setTypeFilter('')
    setReadFilter('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const hasActiveFilters = search || typeFilter || readFilter || dateFrom || dateTo

  const columnDefs = useMemo(
    () =>
      getLogsColumnDefs({
        t,
        canDelete,
        isRtl,
        onView: (item) => {
          setViewingLogId(item.id)
          setIsDetailModalOpen(true)
        },
        onDelete: (item) => {
          setDeletingItem(item)
        },
      }),
    [t, canDelete, isRtl]
  )

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('totalLogs')}
            </p>
            <h3 className="text-2xl font-black text-foreground mt-1">{totalLogs}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-main/10 text-main flex items-center justify-center">
            <Send className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {t('readCount')}
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {readCount}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              {t('unreadCount')}
            </p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">{unreadCount}</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <CircleDashed className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              {t('readRate')}
            </p>
            <h3 className="text-2xl font-black text-blue-500 mt-1">{readRate}%</h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-main/10 text-main border border-main/20">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {t('notificationLogs')}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('notificationLogsDesc')}
              </p>
            </div>
          </div>

          {canSend && (
            <Link to="/send-notification">
              <Button size="sm" className="h-9 px-3.5 text-xs font-bold gap-1.5 bg-main hover:bg-main/90 text-white rounded-xl shadow-xs">
                <Send className="h-3.5 w-3.5" />
                {t('sendNotification')}
              </Button>
            </Link>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Filters Bar */}
          <div
            className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 flex-wrap"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Search */}
            <div className="flex-1 min-w-[220px]">
              <SearchInput
                placeholder={t('searchLogsPlaceholder')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-48 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('allTypes')}</option>
              {Object.values(EVENT_CATALOG).map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {isRtl ? cat.labelAr : cat.labelEn}
                </option>
              ))}
            </select>

            {/* Read Status Filter */}
            <select
              value={readFilter}
              onChange={(e) => {
                setReadFilter(e.target.value)
                setPage(1)
              }}
              className="w-full sm:w-36 h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
            >
              <option value="">{t('allReadStatuses')}</option>
              <option value="true">{t('isRead')}</option>
              <option value="false">{t('isUnread')}</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setPage(1)
                }}
                className="h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
                aria-label={t('dateFrom')}
              />
              <span className="text-muted-foreground text-xs">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setPage(1)
                }}
                className="h-10 px-3 rounded-xl border border-border/60 bg-card text-xs font-bold"
                aria-label={t('dateTo')}
              />
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-10 px-3 text-xs font-bold gap-1 text-muted-foreground hover:text-foreground"
              >
                <FilterX className="h-3.5 w-3.5" />
                {t('resetFilters')}
              </Button>
            )}
          </div>

          {/* AG Grid */}
          <div className="rounded-xl overflow-hidden border border-border/60">
            <GenericDataGrid
              rowData={items}
              columnDefs={columnDefs}
              loading={isLoading}
              isServerSide={true}
              currentPage={paginatedData?.meta?.current_page || 1}
              totalPages={paginatedData?.meta?.last_page || 1}
              onPageChange={(p) => setPage(p)}
              height={580}
              rowHeight={64}
              headerHeight={44}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <NotificationLogDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open)
          if (!open) setViewingLogId(null)
        }}
        logId={viewingLogId}
      />

      {/* Delete Confirmation Modal */}
      <ModalStatus
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null)
        }}
        type="delete"
        title={t('deleteNotificationLog')}
        description={t('deleteNotificationLogConfirm')}
        agreeLabel={t('delete')}
        cancelLabel={t('cancel')}
        loading={deleteMutation.isPending}
        onAgreeButtonClick={() => {
          if (deletingItem) {
            deleteMutation.mutate(deletingItem.id, {
              onSuccess: () => setDeletingItem(null),
            })
          }
        }}
        onCancelButtonClick={() => setDeletingItem(null)}
      />
    </div>
  )
}
