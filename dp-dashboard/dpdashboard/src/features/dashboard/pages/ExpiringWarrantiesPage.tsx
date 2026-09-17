import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  ShieldAlert,
  Search,
  Calendar,
  Clock,
  FolderTree,
  AlertTriangle,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/card'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { InvoiceDetailModal } from '@/features/users/components/InvoiceDetailModal'
import type { InvoiceListItem } from '@/features/users/types/invoices'
import { useExpiringWarranties, type ExpiringWarranty } from '../api/useDashboard'

export default function ExpiringWarrantiesPage() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const navigate = useNavigate()

  const { data: warranties, isLoading, isError, refetch, isRefetching } = useExpiringWarranties()

  const [search, setSearch] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'urgent' | 'approaching' | 'later'>('all')

  // Invoice Detail Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null | undefined>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Calculate statistics
  const stats = useMemo(() => {
    const list = warranties ?? []
    const total = list.length
    const urgent = list.filter((item) => Math.round(item.days_remaining) <= 15).length
    const approaching = list.filter((item) => {
      const days = Math.round(item.days_remaining)
      return days > 15 && days <= 30
    }).length
    const later = list.filter((item) => Math.round(item.days_remaining) > 30).length

    return { total, urgent, approaching, later }
  }, [warranties])

  // Filter items based on search and urgency
  const filteredWarranties = useMemo(() => {
    if (!warranties) return []

    return warranties.filter((item) => {
      const days = Math.round(item.days_remaining)

      // Filter by urgency
      if (urgencyFilter === 'urgent' && days > 15) return false
      if (urgencyFilter === 'approaching' && (days <= 15 || days > 30)) return false
      if (urgencyFilter === 'later' && days <= 30) return false

      // Filter by search term
      if (search.trim()) {
        const query = search.toLowerCase().trim()
        const matchTitle = (item.title || '').toLowerCase().includes(query)
        const matchCategory = (item.category || '').toLowerCase().includes(query)
        if (!matchTitle && !matchCategory) return false
      }

      return true
    })
  }, [warranties, urgencyFilter, search])

  const handleOpenInvoiceDetail = (item: ExpiringWarranty) => {
    const invoiceId = item.invoice_id || item.id
    const invoiceItem: InvoiceListItem = {
      id: invoiceId,
      invoice_number: `#${invoiceId}`,
      store_name: item.store_name || item.title,
      image: null,
      purchase_date: item.due_date,
      total_amount: 0,
      category: item.category ? { id: 0, name: item.category } : null,
      has_warranty: true,
      products: [
        {
          id: item.id,
          name: item.title,
          quantity: 1,
          unit_price: 0,
          total_price: 0,
          warranty_period_name: null,
          warranty_end_date: item.due_date,
        },
      ],
    }

    setSelectedUserId(item.user_id)
    setSelectedInvoice(invoiceItem)
    setIsDetailOpen(true)
  }

  const BackArrow = isRtl ? ArrowRight : ArrowLeft
  const RowArrow = isRtl ? ChevronLeft : ChevronRight

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="h-9 w-9 p-0 rounded-xl border-gray-200 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 shrink-0"
            title={t('backToDashboard')}
          >
            <BackArrow className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t('expiringWarranties')}
              </h1>
              {warranties && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                >
                  {warranties.length} {t('recordsCount') || 'records'}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {t('expiringWarrantiesSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-xl border-gray-200 text-xs font-medium dark:border-gray-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRtl ? 'ml-1.5' : 'mr-1.5'} ${isRefetching ? 'animate-spin' : ''}`} />
            {t('refresh') || 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setUrgencyFilter('all')}
          className={`cursor-pointer transition-all border rounded-2xl p-4 ${
            urgencyFilter === 'all'
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
              : 'border-gray-100 bg-white hover:border-gray-200 dark:bg-card dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('allUrgency')}
            </span>
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </span>
            <span className="text-xs text-gray-400">{t('recordsCount') || 'records'}</span>
          </div>
        </Card>

        <Card
          onClick={() => setUrgencyFilter('urgent')}
          className={`cursor-pointer transition-all border rounded-2xl p-4 ${
            urgencyFilter === 'urgent'
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 shadow-xs dark:bg-rose-950/20'
              : 'border-gray-100 bg-white hover:border-gray-200 dark:bg-card dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {t('urgent15Days')}
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center dark:bg-rose-900/30">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats.urgent}
            </span>
            <span className="text-xs text-gray-400">{t('recordsCount') || 'records'}</span>
          </div>
        </Card>

        <Card
          onClick={() => setUrgencyFilter('approaching')}
          className={`cursor-pointer transition-all border rounded-2xl p-4 ${
            urgencyFilter === 'approaching'
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 shadow-xs dark:bg-amber-950/20'
              : 'border-gray-100 bg-white hover:border-gray-200 dark:bg-card dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {t('approaching30Days')}
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-900/30">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.approaching}
            </span>
            <span className="text-xs text-gray-400">{t('recordsCount') || 'records'}</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchProductOrCategory') || 'Search product or category...'}
            className={`w-full h-10 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { key: 'all', label: t('allUrgency') },
              { key: 'urgent', label: t('urgent15Days') },
              { key: 'approaching', label: t('approaching30Days') },
              { key: 'later', label: t('moreThan30Days') },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setUrgencyFilter(tab.key)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                urgencyFilter === tab.key
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-gray-100/70 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Table / Cards */}
      <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden bg-white dark:bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <ShieldAlert className="h-10 w-10 text-rose-500" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {t('errorLoadingData') || 'Failed to load expiring warranties'}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl text-xs">
                {t('retry') || 'Retry'}
              </Button>
            </div>
          ) : filteredWarranties.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {search ? (t('noSearchResults') || 'No matching warranties found.') : t('noExpiringWarranties')}
              </span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Header row for desktop */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50/60 dark:bg-gray-800/40 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                <div className="col-span-6">{t('name') || 'Item'}</div>
                <div className="col-span-3">{t('warrantyExpiry')}</div>
                <div className={`col-span-3 ${isRtl ? 'text-left' : 'text-right'}`}>{t('urgencyStatus')}</div>
              </div>

              {/* Items List */}
              {filteredWarranties.map((item: ExpiringWarranty) => {
                const roundedDays = Math.max(0, Math.ceil(Number(item.days_remaining) || 0))
                const isUrgent = roundedDays <= 15
                const isApproaching = roundedDays > 15 && roundedDays <= 30

                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenInvoiceDetail(item)}
                    className="p-4 sm:px-6 hover:bg-primary/5 dark:hover:bg-gray-800/60 transition-all cursor-pointer group flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 md:gap-4"
                    title={t('viewInvoiceDetails') || 'View invoice details'}
                  >
                    {/* Product & Category */}
                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <div
                        className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:border-rose-900'
                            : isApproaching
                            ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900'
                            : 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20'
                        }`}
                      >
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors" title={item.title}>
                            {item.title}
                          </h3>
                        </div>
                        {item.category && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            <FolderTree className="h-3 w-3 shrink-0" />
                            <span className="truncate">{item.category}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Warranty Expiration Date */}
                    <div className="col-span-3 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>{item.formatted_due_date || item.due_date || '-'}</span>
                    </div>

                    {/* Status Badge and Action Chevron */}
                    <div className="col-span-3 flex items-center justify-between md:justify-end gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : isApproaching
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        <Clock className={`h-3 w-3 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                        {roundedDays} {t('daysRemaining')}
                      </Badge>

                      <div className="h-7 w-7 rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        userId={selectedUserId}
        invoiceItem={selectedInvoice}
      />
    </div>
  )
}
