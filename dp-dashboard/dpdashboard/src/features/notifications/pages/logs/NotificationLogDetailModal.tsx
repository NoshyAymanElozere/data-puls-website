import { useTranslation } from 'react-i18next'
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Mail,
  Phone,
  User,
  Zap,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import { Badge } from '@/shared/components/badge'
import { useNotificationLog } from '../../api/useNotificationLogs'

interface NotificationLogDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  logId: string | null
}

export function NotificationLogDetailModal({
  open,
  onOpenChange,
  logId,
}: NotificationLogDetailModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const { data: log, isLoading } = useNotificationLog(open ? logId : null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <DialogHeader className="p-6 border-b border-border/50 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-xs shrink-0"
              style={{ backgroundColor: log?.icon_bg_color || '#5B4B8A' }}
            >
              <i className={log?.icon || 'fa-solid fa-bell'} style={{ fontSize: '18px' }} />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-foreground">
                {t('logDetails')}
              </DialogTitle>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                ID: {logId || '-'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-main border-t-transparent" />
            <span className="text-xs font-semibold text-muted-foreground">
              {isRtl ? 'جاري تحميل تفاصيل الإشعار...' : 'Loading notification details...'}
            </span>
          </div>
        ) : !log ? (
          <div className="py-16 text-center text-xs font-semibold text-muted-foreground">
            {t('noDataFound')}
          </div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Recipient Card */}
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-main" />
                {t('recipient')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-card border border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold block">
                    {t('recipientName')}
                  </span>
                  <span className="text-xs font-bold text-foreground truncate block mt-0.5">
                    {log.user?.name || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5" />
                    {t('recipientPhone')}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground truncate block mt-0.5" dir="ltr">
                    {log.user?.phone || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/40">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    {t('recipientEmail')}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground truncate block mt-0.5" dir="ltr">
                    {log.user?.email || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Content Box */}
            <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs font-bold">
                  {log.type_label || log.type}
                </Badge>
                <div className="flex items-center gap-2">
                  {log.is_read ? (
                    <Badge variant="success" className="gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('isRead')} ({log.read_at || '-'})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-[11px] font-bold text-muted-foreground">
                      <CircleDashed className="h-3 w-3 text-amber-500" />
                      {t('isUnread')}
                    </Badge>
                  )}
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {log.created_at}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h4 className="text-sm font-black text-foreground">
                  {log.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {log.body}
                </p>
              </div>
            </div>

            {/* Action / Trigger Details (if any) */}
            {(log.action_type || log.action_id || log.action_url) && (
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  {t('actionType')}
                </span>
                <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
                  {log.action_type && (
                    <Badge variant="outline" className="bg-card">
                      {t('actionType')}: <strong className="ml-1 font-mono">{log.action_type}</strong>
                    </Badge>
                  )}
                  {log.action_id && (
                    <Badge variant="outline" className="bg-card">
                      {t('actionId')}: <strong className="ml-1 font-mono">#{log.action_id}</strong>
                    </Badge>
                  )}
                  {log.action_url && (
                    <a
                      href={log.action_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-main hover:underline text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {log.action_url}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Payload Data */}
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t('payloadData')}
              </span>
              {log.data && Object.keys(log.data).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(log.data).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-2.5 rounded-xl bg-card border border-border/40 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-muted-foreground text-[11px]">{k}</span>
                      <span className="font-bold text-foreground truncate max-w-[200px]">
                        {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t('noPayloadData')}
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
