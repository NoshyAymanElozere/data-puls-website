import { useTranslation } from 'react-i18next'
import { Calendar, CheckCircle2, HeartHandshake, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/dialog'
import { Badge } from '@/shared/components/badge'
import { useFamilyRelation } from '../api/useFamilyRelations'

interface FamilyRelationDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  relationId: number | null
}

export function FamilyRelationDetailModal({
  open,
  onOpenChange,
  relationId,
}: FamilyRelationDetailModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { data: relation, isLoading } = useFamilyRelation(open ? relationId : null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="p-0">
        <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 space-y-6">
          <DialogHeader className="p-0 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-main/10 text-main border border-main/20 shadow-xs">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-foreground">
                  {t('relationDetails')}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  ID: #{relationId}
                </p>
              </div>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-main border-t-transparent" />
              <span className="text-xs font-semibold text-muted-foreground">
                {isRtl ? 'جاري تحميل تفاصيل صلة القرابة...' : 'Loading relation details...'}
              </span>
            </div>
          ) : !relation ? (
            <div className="py-8 text-center text-xs font-semibold text-muted-foreground">
              {t('noRelationsFound')}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bilingual Names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('englishNameCol')}
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {relation.name?.en || '-'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('arabicNameCol')}
                  </span>
                  <p className="text-sm font-bold text-foreground font-arabic">
                    {relation.name?.ar || '-'}
                  </p>
                </div>
              </div>

              {/* Status and Sort Order */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('status')}
                  </span>
                  <div>
                    {relation.is_active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                        {t('active')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <XCircle className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" />
                        {t('inactive')}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('sortOrderCol')}
                  </span>
                  <p className="text-sm font-black text-foreground">
                    {relation.sort_order}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 opacity-60" />
                  <span>{t('createdAt')}: {relation.created_at}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 opacity-60" />
                  <span>{t('updatedAt')}: {relation.updated_at}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
