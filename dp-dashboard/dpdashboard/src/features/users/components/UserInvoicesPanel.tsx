import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Receipt,
  Search,
  ShieldCheck,
  Store,
  Tag,
  Trash2,
  Users2,
  X,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import ModalStatus from '@/shared/components/modal-status'
import { cn } from '@/shared/utils/utils'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { useDeleteUserInvoice, useUserInvoices } from '../api/useUserInvoices'
import type { InvoiceListItem } from '../types/invoices'
import { resolveInvoiceAttachment } from '../utils/invoiceAttachment'
import { InvoiceDetailModal } from './InvoiceDetailModal'

interface UserInvoicesPanelProps {
  userId: number | null | undefined
  showFamilyFilter?: boolean
}

export function UserInvoicesPanel({ userId, showFamilyFilter = true }: UserInvoicesPanelProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [includeFamily, setIncludeFamily] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [deletingInvoice, setDeletingInvoice] = useState<InvoiceListItem | null>(null)

  const { data: paginatedData, isLoading } = useUserInvoices(userId, page, search, 10, includeFamily)
  const deleteInvoiceMutation = useDeleteUserInvoice(userId)

  const invoices = paginatedData?.data ?? []
  const meta = paginatedData?.meta
  const totalCount = meta?.total ?? (paginatedData as unknown as { total?: number })?.total ?? invoices.length

  const getCategoryName = (cat: InvoiceListItem['category']) => {
    if (!cat) return null
    if (typeof cat.name === 'string') return cat.name
    return isRtl ? cat.name.ar || cat.name.en : cat.name.en || cat.name.ar
  }

  const handleDelete = () => {
    if (!deletingInvoice) return
    deleteInvoiceMutation.mutate(deletingInvoice.id, {
      onSuccess: () => setDeletingInvoice(null),
    })
  }

  return (
    <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/20 p-2.5 rounded-2xl border border-border/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchInvoices')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full h-10 pl-9 pr-9 rtl:pl-9 rtl:pr-9 rounded-xl border border-border/60 bg-card text-xs font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main transition-all shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Family Filter Toggle */}
          {showFamilyFilter && (
            <label
              className={cn(
                'flex items-center gap-2 h-10 px-3.5 rounded-xl border text-xs font-bold whitespace-nowrap cursor-pointer transition-all select-none shadow-xs',
                includeFamily
                  ? 'bg-main/10 border-main/40 text-main font-black'
                  : 'bg-card border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              <input
                type="checkbox"
                checked={includeFamily}
                onChange={(e) => {
                  setIncludeFamily(e.target.checked)
                  setPage(1)
                }}
                className="h-4 w-4 rounded border-border text-main focus:ring-main"
              />
              <Users2 className="h-3.5 w-3.5" />
              <span>{t('includeFamilyInvoices')}</span>
            </label>
          )}
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border/60 bg-card text-xs font-bold text-muted-foreground shadow-xs">
            <Receipt className="h-3.5 w-3.5 text-main" />
            <span>
              {totalCount} {t('invoicesCount')}
            </span>
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead className="bg-muted/50 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-start whitespace-nowrap min-w-[150px]">{t('invoiceNumber')}</th>
                <th className="px-4 py-3.5 text-start whitespace-nowrap min-w-[130px]">{t('storeName')}</th>
                <th className="px-3.5 py-3.5 text-start whitespace-nowrap min-w-[120px]">{t('category')}</th>
                <th className="px-3.5 py-3.5 text-start whitespace-nowrap min-w-[110px]">{t('purchaseDate')}</th>
                <th className="px-3.5 py-3.5 text-start whitespace-nowrap min-w-[120px]">{t('totalAmount')}</th>
                <th className="px-3 py-3.5 text-center whitespace-nowrap min-w-[90px]">{t('warranty')}</th>
                <th className="px-3 py-3.5 text-center whitespace-nowrap min-w-[95px]">{t('returnPeriod')}</th>
                <th className="px-3 py-3.5 text-center whitespace-nowrap min-w-[95px]">{t('exchangePeriod')}</th>
                <th className="px-4 py-3.5 text-center whitespace-nowrap min-w-[100px]">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-main border-t-transparent" />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {isRtl ? 'جاري تحميل الفواتير...' : 'Loading invoices...'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Receipt className="h-8 w-8 opacity-30" />
                      <span className="text-sm font-semibold">{t('noInvoicesFound')}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const catName = getCategoryName(inv.category)
                  const { imageUrl, file } = resolveInvoiceAttachment(inv)
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(inv)
                        setIsDetailOpen(true)
                      }}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {file ? (
                            <div
                              className="h-10 w-10 rounded-xl bg-muted text-muted-foreground border border-border/60 flex items-center justify-center shrink-0 shadow-xs"
                              title={file.name}
                            >
                              <FileText className="h-5 w-5" />
                            </div>
                          ) : imageUrl ? (
                            <img
                              src={resolveMediaUrl(imageUrl)}
                              alt={inv.invoice_number}
                              className="h-10 w-10 rounded-xl object-cover border border-border/60 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-main/10 text-main border border-main/20 flex items-center justify-center shrink-0 shadow-xs">
                              <Receipt className="h-5 w-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-black text-foreground text-xs block group-hover:text-main transition-colors">
                              #{inv.invoice_number}
                            </span>
                            {inv.creator?.name && (
                              <span className="block text-[10px] text-muted-foreground font-normal truncate max-w-[130px]">
                                {inv.creator.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground">
                            <Store className="h-3.5 w-3.5" />
                          </div>
                          <span className="truncate max-w-[160px] text-xs">{inv.store_name}</span>
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        {catName ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            <Tag className="h-3 w-3 opacity-70" />
                            <span>{catName}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40 font-medium">—</span>
                        )}
                      </td>

                      <td className="px-3.5 py-3.5 text-muted-foreground whitespace-nowrap font-medium">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3.5 w-3.5 opacity-60 shrink-0" />
                          <span>{inv.purchase_date}</span>
                        </div>
                      </td>

                      <td className="px-3.5 py-3.5 whitespace-nowrap">
                        <div className="flex items-baseline gap-1 font-bold">
                          <span className="text-sm font-black text-main">
                            {inv.total_amount?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground">SAR</span>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        {inv.has_warranty ? (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold py-0.5 px-2">
                            <ShieldCheck className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                            {t('yes')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/40 font-medium">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        {inv.return?.is_applicable ? (
                          inv.return.is_expired ? (
                            <Badge variant="destructive" className="text-[10px] py-0.5 px-2 font-bold">
                              <XCircle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                              {t('expired')}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold py-0.5 px-2">
                              <CheckCircle2 className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                              {inv.return.period_days} {t('days')}
                            </Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground/40 font-medium">—</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        {inv.exchange?.is_applicable ? (
                          inv.exchange.is_expired ? (
                            <Badge variant="destructive" className="text-[10px] py-0.5 px-2 font-bold">
                              <XCircle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                              {t('expired')}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold py-0.5 px-2">
                              <CheckCircle2 className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                              {inv.exchange.period_days} {t('days')}
                            </Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground/40 font-medium">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(inv)
                              setIsDetailOpen(true)
                            }}
                            className="h-8 px-2.5 rounded-lg text-xs font-bold text-main hover:bg-main/10 gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t('view')}</span>
                          </Button>

                          <button
                            type="button"
                            onClick={() => setDeletingInvoice(inv)}
                            title={t('deleteInvoice')}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
            <span className="text-xs text-muted-foreground font-semibold">
              {isRtl
                ? `الصفحة ${meta.current_page} من ${meta.last_page}`
                : `Page ${meta.current_page} of ${meta.last_page}`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 rounded-lg text-xs font-bold"
              >
                {isRtl ? 'السابق' : 'Previous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-3 rounded-lg text-xs font-bold"
              >
                {isRtl ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Detail Drawer / Modal */}
      <InvoiceDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        userId={userId}
        invoiceItem={selectedInvoice}
      />

      {/* Delete Invoice Confirmation Modal */}
      <ModalStatus
        open={!!deletingInvoice}
        onOpenChange={(v) => !v && setDeletingInvoice(null)}
        title={t('deleteInvoice')}
        description={t('deleteInvoiceConfirmation')}
        agreeLabel={t('delete')}
        cancelLabel={t('cancel')}
        onAgreeButtonClick={handleDelete}
        onCancelButtonClick={() => setDeletingInvoice(null)}
        loading={deleteInvoiceMutation.isPending}
        type="delete"
      />
    </div>
  )
}
