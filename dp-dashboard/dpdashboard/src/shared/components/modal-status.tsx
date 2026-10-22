import * as React from 'react'
import { Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from './dialog'
import { cn } from '@/shared/utils/utils'

export interface ModalStatusProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  agreeLabel?: string | null
  cancelLabel?: string | null
  onAgreeButtonClick?: () => void
  onCancelButtonClick: () => void
  loading?: boolean
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  type?: 'default' | 'delete'
}

export function ModalStatus({
  open,
  onOpenChange,
  title,
  description,
  agreeLabel = 'Agree',
  cancelLabel,
  onAgreeButtonClick,
  onCancelButtonClick,
  loading = false,
  children,
  size = 'md',
  type = 'default'
}: ModalStatusProps) {
  const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
  const resolvedCancel = cancelLabel !== undefined ? cancelLabel : (isRtl ? 'إلغاء' : 'Cancel')

  if (type === 'delete') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size={size || 'sm'} className="max-h-[92vh] overflow-visible">
          <div className="flex flex-col items-center text-center p-4">
            {/* Trash Icon */}
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mb-6 border border-rose-100 dark:border-rose-900/40 shadow-sm">
              <Trash2 className="h-8 w-8" />
            </div>

            {/* Description */}
            <p className="text-sm font-semibold text-muted-foreground mb-8 max-w-[280px]">
              {description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 w-full">
              {resolvedCancel && (
                <button
                  type="button"
                  onClick={onCancelButtonClick}
                  className="flex-1 h-11 items-center justify-center rounded-xl bg-muted/60 px-4 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-98 cursor-pointer"
                >
                  {resolvedCancel}
                </button>
              )}
              {agreeLabel && onAgreeButtonClick && (
                <button
                  type="button"
                  onClick={onAgreeButtonClick}
                  disabled={loading}
                  className="flex-1 h-11 items-center justify-center rounded-xl bg-rose-500 px-4 text-xs font-bold text-white hover:bg-rose-600 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (isRtl ? 'جاري المعالجة...' : 'Processing...') : agreeLabel}
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* overflow-visible: avoids clipping react-select menus inside the dialog */}
      <DialogContent size={size} className="max-h-[92vh] overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && (
          <div className="py-2 overflow-visible">
            {children}
          </div>
        )}

        <DialogFooter className="mt-4">
          {resolvedCancel && (
            <button
              type="button"
              onClick={onCancelButtonClick}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border/60 bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
            >
              {resolvedCancel}
            </button>
          )}
          {agreeLabel && onAgreeButtonClick && (
            <button
              type="button"
              onClick={onAgreeButtonClick}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (isRtl ? 'جاري المعالجة...' : 'Processing...') : agreeLabel}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ModalStatus
