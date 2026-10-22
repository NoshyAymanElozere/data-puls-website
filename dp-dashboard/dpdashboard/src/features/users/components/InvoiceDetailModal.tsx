import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Maximize2,
  Package,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Tag,
  User as UserIcon,
  X,
  XCircle,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import { Badge } from '@/shared/components/badge'
import { Avatar } from '@/shared/components/misc'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { useUserInvoiceDetail } from '../api/useUserInvoices'
import type { InvoiceListItem } from '../types/invoices'
import { formatFileSize, resolveInvoiceAttachment } from '../utils/invoiceAttachment'

interface InvoiceDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null | undefined
  invoiceItem: InvoiceListItem | null
}

export function InvoiceDetailModal({
  open,
  onOpenChange,
  userId,
  invoiceItem,
}: InvoiceDetailModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  const { data: fullDetail, isLoading } = useUserInvoiceDetail(
    open ? userId : null,
    open && invoiceItem ? invoiceItem.id : null
  )

  const invoice = fullDetail ?? invoiceItem
  if (!invoice) return null

  const getCategoryName = (cat: typeof invoice.category) => {
    if (!cat) return null
    if (typeof cat.name === 'string') return cat.name
    return isRtl ? cat.name.ar || cat.name.en : cat.name.en || cat.name.ar
  }

  const { imageUrl, file: attachmentFile } = resolveInvoiceAttachment(invoice)
  const categoryLabel = getCategoryName(invoice.category)
  const subcategoryLabel = getCategoryName(invoice.subcategory)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto p-0">
          <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 space-y-6">
            {/* Header */}
            <DialogHeader className="p-0 border-b border-border/50 pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-main/10 text-main border border-main/20 shadow-xs">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
                      <span>{invoice.store_name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {invoice.invoice_number}
                      </span>
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{t('purchaseDate')}: {invoice.purchase_date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-end bg-card border border-border/60 shadow-xs rounded-xl px-4 py-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      {t('totalAmount')}
                    </span>
                    <span className="text-lg font-black text-main">
                      {invoice.total_amount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} <span className="text-xs font-bold text-muted-foreground">SAR</span>
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {isLoading && !fullDetail ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-main border-t-transparent" />
                <p className="text-xs font-semibold text-muted-foreground">
                  {isRtl ? 'جاري تحميل تفاصيل الفاتورة...' : 'Loading invoice details...'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Meta Cards: Creator, Category & Policies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Creator Card */}
                  <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 flex items-center gap-3">
                    <Avatar
                      src={resolveMediaUrl(invoice.creator?.avatar_url)}
                      alt={invoice.creator?.name || 'Creator'}
                      className="h-11 w-11 rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <UserIcon className="h-3 w-3" /> {t('creator')}
                      </span>
                      <p className="text-sm font-bold text-foreground truncate mt-0.5">
                        {invoice.creator?.name || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Return Policy Card */}
                  <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" /> {t('returnPolicy')}
                      </span>
                      {invoice.return?.is_applicable ? (
                        invoice.return.is_expired ? (
                          <Badge variant="destructive" className="text-[10px] h-5">
                            <XCircle className="h-3 w-3 mr-1" /> {t('expired')}
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] h-5">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> {t('applicable')}
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                          {t('notApplicable')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {invoice.return?.is_applicable ? (
                        <p>
                          {invoice.return.period_days} {t('days')}
                          {invoice.return.end_date && (
                            <span className="text-muted-foreground block text-[11px] mt-0.5">
                              {t('validUntil')} {invoice.return.end_date}
                            </span>
                          )}
                        </p>
                      ) : (
                        <span className="text-muted-foreground text-xs">{t('notSpecified')}</span>
                      )}
                    </div>
                  </div>

                  {/* Exchange Policy Card */}
                  <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {t('exchangePolicy')}
                      </span>
                      {invoice.exchange?.is_applicable ? (
                        invoice.exchange.is_expired ? (
                          <Badge variant="destructive" className="text-[10px] h-5">
                            <XCircle className="h-3 w-3 mr-1" /> {t('expired')}
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] h-5">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> {t('applicable')}
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                          {t('notApplicable')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {invoice.exchange?.is_applicable ? (
                        <p>
                          {invoice.exchange.period_days} {t('days')}
                          {invoice.exchange.end_date && (
                            <span className="text-muted-foreground block text-[11px] mt-0.5">
                              {t('validUntil')} {invoice.exchange.end_date}
                            </span>
                          )}
                        </p>
                      ) : (
                        <span className="text-muted-foreground text-xs">{t('notSpecified')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Categories and Badges Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  {categoryLabel && (
                    <Badge variant="secondary" className="gap-1.5 py-1 px-3 rounded-xl font-bold text-xs">
                      <Tag className="h-3.5 w-3.5 text-main" />
                      <span>{categoryLabel}</span>
                      {subcategoryLabel && (
                        <span className="text-muted-foreground font-normal">/ {subcategoryLabel}</span>
                      )}
                    </Badge>
                  )}
                  {invoice.has_warranty && (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 gap-1.5 py-1 px-3 rounded-xl font-bold text-xs">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{t('hasWarranty')}</span>
                    </Badge>
                  )}
                </div>

                {/* Receipt Image & Product List Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Receipt Image */}
                  <div className="lg:col-span-1 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> {t('receiptImage')}
                    </h4>
                    {attachmentFile ? (
                      <div className="rounded-2xl border border-border/70 bg-muted/30 aspect-3/4 flex flex-col items-center justify-center text-center gap-3 p-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main/10 text-main border border-main/20">
                          <FileText className="h-8 w-8" />
                        </div>
                        <div className="min-w-0 w-full space-y-1">
                          <p className="text-sm font-bold text-foreground break-all line-clamp-2" title={attachmentFile.name}>
                            {attachmentFile.name}
                          </p>
                          <p className="text-[11px] font-semibold text-muted-foreground" dir="ltr">
                            {formatFileSize(attachmentFile.size)}
                            {attachmentFile.mime_type ? ` · ${attachmentFile.mime_type}` : ''}
                          </p>
                        </div>
                        <a
                          href={resolveMediaUrl(attachmentFile.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-main text-white text-xs font-bold hover:bg-main/90 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          {t('openOrDownloadFile')}
                        </a>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative group overflow-hidden rounded-2xl border border-border/70 bg-muted/30 aspect-3/4 flex items-center justify-center">
                        <img
                          src={resolveMediaUrl(imageUrl)}
                          alt={invoice.invoice_number}
                          className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                          onClick={() => setIsImageZoomed(true)}
                        />
                        <button
                          type="button"
                          onClick={() => setIsImageZoomed(true)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer backdrop-blur-xs"
                        >
                          <Maximize2 className="h-4 w-4" />
                          <span>{t('clickToZoom')}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 aspect-3/4 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                        <Receipt className="h-8 w-8 mb-2 opacity-40" />
                        <span className="text-xs font-semibold">{t('noReceiptImage')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Products List */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Package className="h-4 w-4" /> {t('products')} ({invoice.products?.length ?? invoice.products_count ?? 0})
                      </h4>
                    </div>

                    <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-xs">
                      <table className="w-full text-xs text-start">
                        <thead className="bg-muted/50 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase">
                          <tr>
                            <th className="px-4 py-3 text-start">{t('productName')}</th>
                            <th className="px-3 py-3 text-center">{t('quantity')}</th>
                            <th className="px-3 py-3 text-end">{t('unitPrice')}</th>
                            <th className="px-3 py-3 text-end">{t('totalPrice')}</th>
                            <th className="px-4 py-3 text-start">{t('warranty')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {(invoice.products && invoice.products.length > 0) ? (
                            invoice.products.map((p) => (
                              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3.5 font-bold text-foreground">{p.name}</td>
                                <td className="px-3 py-3.5 text-center font-semibold text-muted-foreground">
                                  {p.quantity}
                                </td>
                                <td className="px-3 py-3.5 text-end font-semibold text-foreground whitespace-nowrap">
                                  {p.unit_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 py-3.5 text-end font-black text-main whitespace-nowrap">
                                  {p.total_price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-3.5">
                                  {p.warranty_period_name || p.warranty_end_date ? (
                                    <div className="flex flex-col">
                                      {p.warranty_period_name && (
                                        <span className="font-bold text-blue-600 dark:text-blue-400">
                                          {p.warranty_period_name}
                                        </span>
                                      )}
                                      {p.warranty_end_date && (
                                        <span className="text-[10px] text-muted-foreground">
                                          {t('validUntil')} {p.warranty_end_date}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-muted-foreground font-semibold">
                                {t('noFeatures')}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox / Image Zoom Modal */}
      {isImageZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={resolveMediaUrl(imageUrl)}
            alt={invoice.invoice_number}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
