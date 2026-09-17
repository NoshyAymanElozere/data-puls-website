import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BaseInputField } from '@/shared/components/base-input-field'
import { BaseTextAreaField } from '@/shared/components/base-textarea-field'
import { CategoryIconPicker } from '@/features/categories/components/CategoryIconPicker'
import { Badge } from '@/shared/components/badge'
import ModalStatus from '@/shared/components/modal-status'
import { StatusDropdown } from '@/shared/components/StatusDropdown'
import { useZodForm } from '@/shared/components/form-fields'
import { FormProvider } from 'react-hook-form'
import {
  useCreateUserCategory,
  useUpdateUserCategory,
  useUserCategoryDetail,
} from '../api/useUserCategories'
import type { UserCategoryDetail, UserCategoryFormValues, UserCategoryItem } from '../types/categories'
import { getUserCategoryInitialValues, userCategorySchema } from '../validation/userCategorySchema'
import { Receipt } from 'lucide-react'

interface UserCategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number
  category: UserCategoryItem | UserCategoryDetail | null
  isViewOnly?: boolean
  onSuccess?: () => void
}

export function UserCategoryFormModal({
  open,
  onOpenChange,
  userId,
  category,
  isViewOnly = false,
  onSuccess,
}: UserCategoryFormModalProps) {
  const { i18n, t } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const { data: detail, isLoading: isDetailLoading } = useUserCategoryDetail(
    userId,
    open && category?.id ? category.id : null
  )

  const activeItem = detail ?? category

  const methods = useZodForm<UserCategoryFormValues>(
    userCategorySchema,
    getUserCategoryInitialValues(activeItem)
  )

  const { control, reset, handleSubmit, setError } = methods

  useEffect(() => {
    if (open) {
      reset(getUserCategoryInitialValues(activeItem))
    }
  }, [open, activeItem, reset])

  const createMutation = useCreateUserCategory(userId, setError)
  const updateMutation = useUpdateUserCategory(userId, setError)

  const isSaving = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: UserCategoryFormValues) => {
    if (category?.id) {
      updateMutation.mutate(
        { categoryId: category.id, payload: values },
        {
          onSuccess: () => {
            onOpenChange(false)
            onSuccess?.()
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      })
    }
  }

  const modalTitle = isViewOnly
    ? `${t('view')} ${t('category')}`
    : category
      ? `${t('edit')} ${t('category')}`
      : `${t('add')} ${t('category')}`

  return (
    <ModalStatus
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      agreeLabel={isViewOnly ? t('close') : category ? t('saveChanges') : t('add')}
      cancelLabel={t('cancel')}
      onAgreeButtonClick={isViewOnly ? () => onOpenChange(false) : handleSubmit(onSubmit)}
      onCancelButtonClick={() => onOpenChange(false)}
      loading={isSaving || (!!category?.id && isDetailLoading)}
      size="lg"
    >
      <FormProvider {...methods}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 py-1" dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Metadata Banner if editing or viewing */}
          {activeItem && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="purple" dot>
                  {t('userCustom')}
                </Badge>
                {activeItem.slug && (
                  <span className="font-mono text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {activeItem.slug}
                  </span>
                )}
              </div>

              {'invoices_count' in activeItem && (activeItem.invoices_count ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>
                    {activeItem.invoices_count} {t('invoicesLinked')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Icon & Color Picker */}
          <div>
            <CategoryIconPicker disabled={isViewOnly} />
          </div>

          {/* Localized Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInputField
              name="nameAr"
              label={t('arabicName')}
              required
              disabled={isViewOnly}
              placeholder={t('arabicName')}
            />
            <BaseInputField
              name="nameEn"
              label={t('englishName')}
              required
              disabled={isViewOnly}
              placeholder={t('englishName')}
            />
          </div>

          {/* Localized Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseTextAreaField
              name="descriptionAr"
              label={t('arabicDescription')}
              rows={2}
              disabled={isViewOnly}
              placeholder={t('arabicDescription')}
            />
            <BaseTextAreaField
              name="descriptionEn"
              label={t('englishDescription')}
              rows={2}
              disabled={isViewOnly}
              placeholder={t('englishDescription')}
            />
          </div>

          {/* Sort Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInputField
              name="sort_order"
              label={t('sortOrder')}
              type="number"
              disabled={isViewOnly}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('status')}
              </label>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <StatusDropdown
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isViewOnly}
                    usePortal={false}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </ModalStatus>
  )
}
