import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { ImageUpload } from '@/shared/components/image-upload'
import type { PageSection } from '@/features/pages/api/usePageSections'
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react'
// @ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

interface PageSectionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: PageSection | null
  onSave: (data: unknown) => void
  loading: boolean
}

export function PageSectionFormModal({
  open,
  onOpenChange,
  editingItem,
  onSave,
  loading,
}: PageSectionFormModalProps) {
  const { t, i18n } = useTranslation()
  const { control, handleSubmit } = useFormContext()
  const isRtl = i18n.language === 'ar'

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={editingItem ? t('edit') || 'Edit' : t('addSection') || 'Add Section'}
      agreeLabel={t('save') || 'Save'}
      cancelLabel={t('cancel') || 'Cancel'}
      onAgreeButtonClick={handleSubmit(onSave)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={loading}
      size="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-2 gap-4">
          <BaseInputField name="titleAr" label={t('arabicName') || 'Arabic Title'} required />
          <BaseInputField name="titleEn" label={t('englishName') || 'English Title'} required />
        </div>
        <BaseInputField name="sort_order" label={t('sortOrder') || 'Sort Order'} type="number" />
        <ImageUpload
          name="icon"
          label={t('sectionIcon') || 'Section Icon'}
          currentImageUrl={editingItem?.icon_url || undefined}
          aspectRatio="h-20 w-20"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2" dir="rtl">
            <label className="text-xs font-bold text-gray-500 uppercase">{t('arabicName') || 'Arabic'} Description</label>
            <Controller
              name="descriptionAr"
              control={control}
              render={({ field }) => (
                /* @ts-ignore */
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ''}
                  onChange={(_, editor) => field.onChange(editor.getData())}
                />
              )}
            />
          </div>
          <div className="space-y-2" dir="ltr">
            <label className="text-xs font-bold text-gray-500 uppercase">{t('englishName') || 'English'} Description</label>
            <Controller
              name="descriptionEn"
              control={control}
              render={({ field }) => (
                /* @ts-ignore */
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ''}
                  onChange={(_, editor) => field.onChange(editor.getData())}
                />
              )}
            />
          </div>
        </div>
      </div>
    </ModalStatus>
  )
}
