import { useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { Controller, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/components/button'
import { Card, CardContent } from '@/shared/components/card'
import { StickyFormActions } from '@/shared/components/StickyFormActions'
import { BaseInputField } from '@/shared/components/base-input-field'
import { useZodForm } from '@/shared/components/form-fields'
import { TableSkeleton } from '@/shared/components/table'
import { FormStatusField } from '@/shared/components/FormStatusField'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { useCategory, useUpdateCategory } from '../api/useCategories'
import { getInitialValues, updateSchema, type CategoryFormValues } from './validationSchema'

export default function CategoryEditPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const categoryId = Number(id)
  const label = t('categories')
  const { data: admin } = useProfile()

  const canUpdate = hasPermission(admin, 'categories.update')

  const { data: categoryData, isLoading } = useCategory(Number.isNaN(categoryId) ? null : categoryId)

  const methods = useZodForm(updateSchema, getInitialValues())
  const updateMutation = useUpdateCategory(methods.setError)

  useEffect(() => {
    if (categoryData) {
      methods.reset(getInitialValues(categoryData))
    }
  }, [categoryData, methods.reset])

  const onSubmit = (formData: CategoryFormValues) => {
    if (!categoryId || Number.isNaN(categoryId)) return
    updateMutation.mutate(
      { id: categoryId, payload: formData },
      { onSuccess: () => navigate('/categories') }
    )
  }

  const isRtl = i18n.language === 'ar'
  const categoryTitle = categoryData ? getLocalizedValue(categoryData.name, i18n.language) : ''

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <TableSkeleton rows={4} cols={1} />
      </Card>
    )
  }

  if (!categoryData) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <p className="text-muted-foreground text-center py-8">{t('pageNotFound')}</p>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {label}
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="h-9 px-3">
        <Link to="/categories">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Link>
      </Button>

      <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
        <StickyFormActions title={`${t('edit')} ${categoryTitle || label}`}>
          {canUpdate && (
            <Button
              onClick={methods.handleSubmit(onSubmit)}
              loading={updateMutation.isPending}
              className="h-9 px-4 rounded-xl"
            >
              <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
            </Button>
          )}
        </StickyFormActions>
        <CardContent className="p-6">
          <FormProvider {...methods}>
            <div className="space-y-4 max-w-xl" dir={isRtl ? 'rtl' : 'ltr'}>
              <BaseInputField name="nameAr" label={t('arabicName')} required disabled={!canUpdate} />
              <BaseInputField name="nameEn" label={t('englishName')} required disabled={!canUpdate} />
              <BaseInputField name="slug" label={t('slug')} disabled />
              <BaseInputField name="sort_order" label={t('sortOrder')} type="number" disabled={!canUpdate} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </label>
                <Controller
                  name="is_active"
                  control={methods.control}
                  render={({ field }) => (
                    <FormStatusField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!canUpdate}
                    />
                  )}
                />
              </div>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
