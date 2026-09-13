import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HeartHandshake } from 'lucide-react'
import ModalStatus from '@/shared/components/modal-status'
import { useFamilyRelation } from '../api/useFamilyRelations'
import type { FamilyRelationFormValues } from '../api/useFamilyRelations'
import type { FamilyRelationListItem } from '../types/family-relations'

interface FamilyRelationsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: FamilyRelationListItem | null
  onSave: (data: FamilyRelationFormValues) => void
  loading?: boolean
}

export function FamilyRelationsFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading = false,
}: FamilyRelationsFormModalProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const { data: detail } = useFamilyRelation(open && editingItem ? editingItem.id : null)

  const [nameEn, setNameEn] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [sortOrder, setSortOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (open) {
      if (detail) {
        setNameEn(detail.name?.en || '')
        setNameAr(detail.name?.ar || '')
        setSortOrder(detail.sort_order ?? 1)
        setIsActive(detail.is_active ?? true)
      } else if (editingItem) {
        setNameEn(editingItem.name || '')
        setNameAr(editingItem.name || '')
        setSortOrder(editingItem.sort_order ?? 1)
        setIsActive(editingItem.is_active ?? true)
      } else {
        setNameEn('')
        setNameAr('')
        setSortOrder(1)
        setIsActive(true)
      }
    }
  }, [open, editingItem, detail])

  const handleSubmit = () => {
    onSave({
      name: {
        en: nameEn,
        ar: nameAr,
      },
      sort_order: Number(sortOrder) || 1,
      is_active: isActive,
    })
  }

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? t('editRelation') : t('addRelation')}
      agreeLabel={t('save')}
      cancelLabel={t('cancel')}
      onAgreeButtonClick={handleSubmit}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
      size="md"
    >
      <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('englishNameCol')} *
          </label>
          <input
            type="text"
            required
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="e.g. Grandfather"
            className="h-10 px-3.5 rounded-xl border border-border/60 bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main"
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t('arabicNameCol')} *
          </label>
          <input
            type="text"
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="مثال: الجد"
            className="h-10 px-3.5 rounded-xl border border-border/60 bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main font-arabic"
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('sortOrderCol')}
            </label>
            <input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="h-10 px-3.5 rounded-xl border border-border/60 bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-main/20 focus:border-main"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t('status')}
            </label>
            <label className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-border/60 bg-card text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border text-main focus:ring-main"
              />
              <span>{isActive ? t('active') : t('inactive')}</span>
            </label>
          </div>
        </div>
      </div>
    </ModalStatus>
  )
}
