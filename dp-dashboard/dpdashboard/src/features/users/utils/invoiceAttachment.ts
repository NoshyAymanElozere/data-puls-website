import type { InvoiceAttachment, InvoiceListItem } from '../types/invoices'

export interface ResolvedInvoiceAttachment {
  /** Image URL to preview (images only). */
  imageUrl: string | null
  /** Non-image file (PDF / document) to show as a download tile. */
  file: InvoiceAttachment | null
}

/** Prefer the structured `attachment`; fall back to the legacy `image` URL. */
export function resolveInvoiceAttachment(
  invoice: Pick<InvoiceListItem, 'image' | 'attachment'>
): ResolvedInvoiceAttachment {
  const attachment = invoice.attachment
  if (attachment) {
    return attachment.is_image
      ? { imageUrl: attachment.url || invoice.image, file: null }
      : { imageUrl: null, file: attachment }
  }
  return { imageUrl: invoice.image ?? null, file: null }
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: unit === 0 ? 0 : 1 })} ${units[unit]}`
}
