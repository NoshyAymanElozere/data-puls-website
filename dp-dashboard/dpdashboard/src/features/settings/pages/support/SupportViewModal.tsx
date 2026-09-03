import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ModalStatus from '@/shared/components/modal-status'
import { Avatar } from '@/shared/components/misc'
import { cn } from '@/shared/utils/utils'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { useContactMessageDetails } from '@/features/contact/api/useContactMessages'
import { getSubjectName } from '@/features/contact/api/useContactSubjects'

interface SupportViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: number | null
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-start font-semibold text-foreground text-sm">
        {children}
      </div>
    </div>
  )
}

export function SupportViewModal({ open, onOpenChange, messageId }: SupportViewModalProps) {
  const { t, i18n } = useTranslation()
  const { data: item, isLoading } = useContactMessageDetails(messageId)
  const isRtl = i18n.language === 'ar'

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={t('contactMessages') || 'Message Details'}
      cancelLabel={t('close') || 'Close'}
      onCancelButtonClick={() => onOpenChange(false)}
      size="lg"
      loading={isLoading}
    >
      {item && (
        <div className={cn('space-y-4', isRtl ? 'text-right' : 'text-left')} dir={isRtl ? 'rtl' : 'ltr'}>
          {item.user && (
            <div className="flex items-center gap-3 pb-2 border-b border-border/40">
              <Avatar
                src={resolveMediaUrl(item.user.avatar_url)}
                name={item.user.email}
                size="md"
                className="h-12 w-12"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.user.email}</p>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">
                  {item.user.phone || '—'}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <DetailField label={t('email')}>
              {item.user?.email ? (
                <Link to="/users" className="text-primary hover:underline truncate">
                  {item.user.email}
                </Link>
              ) : (
                '-'
              )}
            </DetailField>
            <DetailField label={t('contactPhone')}>
              <span dir="ltr">{item.user?.phone || '-'}</span>
            </DetailField>
            <DetailField label={t('subject')}>
              {getSubjectName(item.subject?.name ?? '', i18n.language) || '-'}
            </DetailField>
            <DetailField label={t('status')}>
              {item.subject?.is_active == null
                ? '-'
                : item.subject.is_active
                  ? t('active')
                  : t('inactive')}
            </DetailField>
            <DetailField label={t('createdAt')}>{item.created_at || '-'}</DetailField>
            <DetailField label={t('updatedAt')}>{item.updated_at || '-'}</DetailField>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              {t('message')}
            </label>
            <div className="w-full p-4 rounded-xl border border-border/40 bg-muted/20 font-semibold text-foreground text-sm min-h-[120px] whitespace-pre-wrap leading-relaxed text-start">
              {item.message}
            </div>
          </div>
        </div>
      )}
    </ModalStatus>
  )
}
