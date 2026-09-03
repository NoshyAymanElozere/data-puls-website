import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalStatus from '@/shared/components/modal-status'
import { SubscriptionPackageForm } from './SubscriptionPackageForm'
import { getInitialValues } from './validationSchema'
import type { SubscriptionPackage } from '../api/useSubscriptionPackages'

interface SubscriptionPackageFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: SubscriptionPackage | null
  onSave: (data: unknown) => void
  loading: boolean
  label: string
  isViewOnly?: boolean
}

export function SubscriptionPackageFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
  label,
  isViewOnly = false,
}: SubscriptionPackageFormModalProps) {
  const { t } = useTranslation()
  const { reset, handleSubmit } = useFormContext()

  useEffect(() => {
    if (open) {
      reset(getInitialValues(editingItem))
    }
  }, [editingItem, open, reset])

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? `${t('edit')} ${label}` : `${t('add')} ${label}`}
      agreeLabel={isViewOnly ? t('close') : t('save')}
      cancelLabel={t('cancel')}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
      size="xl"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <SubscriptionPackageForm disabled={isViewOnly} />
      </div>
    </ModalStatus>
  )
}
