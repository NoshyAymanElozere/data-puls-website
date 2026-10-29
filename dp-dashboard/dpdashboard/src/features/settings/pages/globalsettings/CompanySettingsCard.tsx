import { useEffect } from 'react'
import { Building2, Loader2, Save } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useProfile } from '@/features/auth/api/useAuth'
import { BaseInputField } from '@/shared/components/base-input-field'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { hasPermission } from '@/shared/utils/permissions'
import {
  mapCompanySettingsToForm,
  useAppSettingsCompany,
  useUpdateAppSettingsCompany,
  type CompanySettingsFormData,
} from '../../api/useAppSettings'

const companySchema = z.object({
  nameEn: z.string().max(255, 'maxLength'),
  nameAr: z.string().max(255, 'maxLength'),
  commercial_registration_number: z.string().max(255, 'maxLength'),
  vat_number: z.string().max(255, 'maxLength'),
})

type CompanyFormValues = z.infer<typeof companySchema>

/** `company` settings group: legal details shown at the bottom of "My Account" in the mobile app. */
export function CompanySettingsCard() {
  const { t } = useTranslation()
  const { data: admin } = useProfile()
  const canUpdate = hasPermission(admin, 'app_settings.update')

  const { data: settings, isLoading, isError } = useAppSettingsCompany()
  const methods = useZodForm<CompanyFormValues>(companySchema, mapCompanySettingsToForm(null))
  const save = useUpdateAppSettingsCompany(methods.setError)

  const onSubmit = (values: CompanyFormValues) => save.mutate(values as CompanySettingsFormData)

  useEffect(() => {
    if (settings) methods.reset(mapCompanySettingsToForm(settings))
  }, [settings, methods.reset])

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-main" />
          {t('companySettings')}
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">{t('companySettingsHint')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-main" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">{t('settingsLoadError')}</p>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInputField name="nameAr" label={t('companyNameAr')} dir="rtl" disabled={!canUpdate} />
                <BaseInputField name="nameEn" label={t('companyNameEn')} dir="ltr" disabled={!canUpdate} />
                <BaseInputField
                  name="commercial_registration_number"
                  label={t('commercialRegistrationNumber')}
                  dir="ltr"
                  disabled={!canUpdate}
                />
                <BaseInputField name="vat_number" label={t('vatNumber')} dir="ltr" disabled={!canUpdate} />
              </div>
              {canUpdate && (
                <div className="flex justify-end">
                  <Button type="submit" loading={save.isPending} className="px-6 h-10 rounded-xl">
                    <Save className="mr-2 h-4 w-4" />
                    {t('saveChanges')}
                  </Button>
                </div>
              )}
            </form>
          </FormProvider>
        )}
      </CardContent>
    </Card>
  )
}
