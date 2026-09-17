import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ModalStatus from '@/shared/components/modal-status'
import { Avatar } from '@/shared/components/misc'
import { Button } from '@/shared/components/button'
import { Textarea } from '@/shared/components/textarea'
import { cn } from '@/shared/utils/utils'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import {
  useContactMessageDetails,
  useReplyContactMessage,
} from '@/features/contact/api/useContactMessages'
import { getSubjectName } from '@/features/contact/api/useContactSubjects'
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Pencil,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Info,
  X,
  ExternalLink,
} from 'lucide-react'

interface SupportViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: number | null
  initialReplyMode?: boolean
  canReply?: boolean
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

export function SupportViewModal({
  open,
  onOpenChange,
  messageId,
  initialReplyMode = false,
  canReply = true,
}: SupportViewModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { data: item, isLoading } = useContactMessageDetails(messageId)
  const replyMutation = useReplyContactMessage()

  const [replyText, setReplyText] = useState('')
  const [isEditingReply, setIsEditingReply] = useState(false)

  useEffect(() => {
    if (item) {
      setReplyText(item.reply || '')
      if (initialReplyMode && !item.is_replied) {
        setIsEditingReply(false)
      } else if (initialReplyMode && item.is_replied) {
        setIsEditingReply(true)
      } else {
        setIsEditingReply(false)
      }
    }
  }, [item, initialReplyMode, open])

  const senderName =
    item?.name ||
    item?.user?.name ||
    (item?.user_id ? `${t('user') || 'User'} #${item.user_id}` : t('guest') || 'Guest')
  const senderEmail = item?.email || item?.user?.email
  const senderPhone = item?.phone || item?.user?.phone
  const isGuest = !item?.user_id && !item?.user

  const trimmedReply = replyText.trim()
  const isReplyValid = trimmedReply.length >= 3 && trimmedReply.length <= 5000

  const handleSendReply = () => {
    if (!item || !isReplyValid) return
    replyMutation.mutate(
      { id: item.id, reply: trimmedReply },
      {
        onSuccess: () => {
          setIsEditingReply(false)
        },
      }
    )
  }

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={t('contactMessages') || 'Message Details'}
      cancelLabel={t('close') || 'Close'}
      onCancelButtonClick={() => onOpenChange(false)}
      size="xl"
      loading={isLoading}
    >
      {item && (
        <div className={cn('space-y-5', isRtl ? 'text-right' : 'text-left')} dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Sender Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-muted/10">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={resolveMediaUrl(item.user?.avatar_url)}
                name={senderName || senderEmail || 'U'}
                size="lg"
                className="h-12 w-12 rounded-full border border-border/60 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-foreground truncate">{senderName}</h4>
                  {item.user_id ? (
                    <Link
                      to={`/users/${item.user_id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full transition-colors"
                      title={t('registeredUser') || 'Registered User'}
                    >
                      <User className="w-3 h-3" />
                      <span>{t('registeredUser') || 'Registered User'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  ) : (
                    <span className="text-[11px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {t('guest') || 'Guest'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                  {senderEmail && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="font-medium text-foreground/90">{senderEmail}</span>
                    </span>
                  )}
                  {senderPhone && (
                    <span className="inline-flex items-center gap-1" dir="ltr">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="font-medium text-foreground/90">{senderPhone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="shrink-0 self-end sm:self-auto">
              {item.is_replied ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('replied') || 'Replied'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  {t('pending') || 'Pending'}
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <DetailField label={t('subject')}>
              <span className="truncate">
                {item.subject_name || getSubjectName(item.subject?.name ?? '', i18n.language) || '-'}
              </span>
            </DetailField>
            <DetailField label={t('createdAt')}>
              <span className="truncate">{item.created_at || '-'}</span>
            </DetailField>
            <DetailField label={t('repliedAt')}>
              <span className="truncate">{item.replied_at || '-'}</span>
            </DetailField>
          </div>

          {/* Original Message Card */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('message')}</span>
            </div>
            <div className="w-full p-4 rounded-xl border border-border/50 bg-muted/20 font-medium text-foreground text-sm min-h-[90px] whitespace-pre-wrap leading-relaxed">
              {item.message}
            </div>
          </div>

          {/* Admin Reply Section */}
          <div className="pt-2 border-t border-border/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">{t('adminReply') || 'Admin Reply'}</h4>
              </div>

              {item.is_replied && !isEditingReply && canReply && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingReply(true)}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Pencil className="w-3 h-3" />
                  {t('editReply') || 'Edit Reply'}
                </Button>
              )}
            </div>

            {/* Display Existing Reply (Read-Only) */}
            {item.is_replied && !isEditingReply ? (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2 pb-2 border-b border-emerald-500/10">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t('repliedBy') || 'Replied by'}:{' '}
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {item.replied_by_admin?.name || t('admin') || 'Admin'}
                    </span>
                    {item.replied_by_admin?.email && (
                      <span className="text-muted-foreground font-normal">
                        ({item.replied_by_admin.email})
                      </span>
                    )}
                  </span>
                  {item.replied_at && (
                    <span className="text-muted-foreground font-medium" dir="ltr">
                      {item.replied_at}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed pt-1">
                  {item.reply}
                </p>
              </div>
            ) : null}

            {/* Reply Composer (New reply or Editing existing) */}
            {(!item.is_replied || isEditingReply) && (
              <div className="space-y-3">
                {canReply ? (
                  <div className="space-y-2.5 p-4 rounded-xl border border-border/60 bg-card shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground">
                        {isEditingReply
                          ? t('editReply') || 'Edit Reply'
                          : t('sendReply') || 'Write Reply'}
                      </label>
                      <span
                        className={cn(
                          'text-[11px] font-medium',
                          replyText.length > 5000
                            ? 'text-rose-500'
                            : 'text-muted-foreground'
                        )}
                      >
                        {replyText.length} / 5000
                      </span>
                    </div>

                    <Textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('replyPlaceholder') || 'Write your reply to the sender here...'}
                      className="text-sm"
                    />

                    {trimmedReply.length > 0 && trimmedReply.length < 3 && (
                      <p className="text-xs font-semibold text-rose-500">
                        {t('replyMinChars') || 'Reply must be at least 3 characters.'}
                      </p>
                    )}

                    {!isGuest && (
                      <div className="flex items-center gap-1.5 text-xs text-primary/90 bg-primary/5 p-2 rounded-lg border border-primary/10">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {t('replyNoticeUserPush') ||
                            'If the sender is a registered user, they will receive this reply in real-time.'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {isEditingReply && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditingReply(false)
                            setReplyText(item.reply || '')
                          }}
                          disabled={replyMutation.isPending}
                          className="text-xs font-semibold gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          {t('cancel') || 'Cancel'}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={handleSendReply}
                        disabled={!isReplyValid || replyMutation.isPending}
                        className="text-xs font-semibold gap-1.5"
                      >
                        {replyMutation.isPending ? (
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        {isEditingReply
                          ? t('update') || 'Update Reply'
                          : t('sendReply') || 'Send Reply'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {t('noReplyYet') || 'No reply has been sent yet.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalStatus>
  )
}
