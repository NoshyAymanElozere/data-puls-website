import React from 'react'
import { Mail, Save, Loader2, Globe } from 'lucide-react'
import { FormProvider, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useZodForm } from '@/shared/components/form-fields'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { ImageUpload } from '@/shared/components/image-upload'
import {
  useAppSettingsGroup,
  useAppSettingsContact,
  useUpdateAppSettingsGeneral,
  useUpdateAppSettingsContact,
  mapGeneralSettingsToForm,
  mapContactSettingsToForm,
} from '../../api/useAppSettings'

const generalSchema = z.object({
  nameEn: z.string().min(1, 'requiredField'),
  nameAr: z.string().min(1, 'requiredField'),
  default_locale: z.string().min(1, 'requiredField'),
  logo: z.any().optional(),
})

const contactSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('invalidEmail').optional().or(z.literal('')),
  facebook: z.string().optional(),
  x: z.string().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  youtube: z.string().optional(),
})

const emptyGeneralForm = mapGeneralSettingsToForm(null)
const emptyContactForm = mapContactSettingsToForm(null)

export default function GlobalSettingsPage() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const {
    data: generalSettings,
    isLoading: generalLoading,
    isError: generalError,
  } = useAppSettingsGroup('general')
  const {
    data: contactSettings,
    isLoading: contactLoading,
    isError: contactError,
  } = useAppSettingsContact()
  const saveGeneral = useUpdateAppSettingsGeneral()
  const saveContact = useUpdateAppSettingsContact()

  const generalMethods = useZodForm(generalSchema, emptyGeneralForm)
  const contactMethods = useZodForm(contactSchema, emptyContactForm)

  React.useEffect(() => {
    if (generalSettings) {
      generalMethods.reset(mapGeneralSettingsToForm(generalSettings))
    }
  }, [generalSettings, generalMethods.reset])

  React.useEffect(() => {
    if (contactSettings) {
      contactMethods.reset(mapContactSettingsToForm(contactSettings))
    }
  }, [contactSettings, contactMethods.reset])

  const isLoading = generalLoading || contactLoading

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-main" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {(generalError || contactError) && (
        <Card className="border-destructive/40 bg-destructive/5 rounded-2xl p-4">
          <p className="text-sm text-destructive">
            {t('settingsLoadError') || 'Some settings could not be loaded. Check your permissions or try again.'}
          </p>
        </Card>
      )}

      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-5">
          <CardTitle className="text-lg font-bold">{t('generalSettings') || 'General Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <FormProvider {...generalMethods}>
            <form
              key={generalSettings ? `general-${generalSettings.default_locale}` : 'general-empty'}
              onSubmit={generalMethods.handleSubmit((formData) => saveGeneral.mutate(formData))}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInputField name="nameAr" label={t('arabicName') || 'Arabic Name'} required />
                <BaseInputField name="nameEn" label={t('englishName') || 'English Name'} required />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {t('defaultLocale') || 'Default Locale'}
                  </label>
                  <Controller
                    name="default_locale"
                    control={generalMethods.control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full h-10 px-3 rounded-xl border border-border/60 bg-card text-sm outline-none focus:border-primary/50"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                      </select>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    name="logo"
                    label={t('appLogo') || 'App Logo'}
                    currentImageUrl={generalSettings?.logo_url || undefined}
                    aspectRatio="h-28 w-44"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={saveGeneral.isPending}
                  disabled={!generalSettings}
                  className="px-6 h-10 rounded-xl"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {t('saveChanges') || 'Save Changes'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Mail className="h-4 w-4 text-main" />
            {t('contactSettings') || 'Contact Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <FormProvider {...contactMethods}>
            <form
              key={contactSettings ? 'contact-loaded' : 'contact-empty'}
              onSubmit={contactMethods.handleSubmit((formData) => saveContact.mutate(formData))}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInputField name="phone" label={t('contactPhone') || 'Phone'} />
                <BaseInputField name="whatsapp" label={t('whatsapp') || 'WhatsApp'} />
                <BaseInputField name="email" label={t('contactEmail') || 'Email'} />
                <BaseInputField name="facebook" label={t('facebook') || 'Facebook'} />
                <BaseInputField name="x" label={t('x') || 'X (Twitter)'} />
                <BaseInputField name="instagram" label={t('instagram') || 'Instagram'} />
                <BaseInputField name="telegram" label={t('telegram') || 'Telegram'} />
                <BaseInputField name="youtube" label={t('youtube') || 'YouTube'} />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={saveContact.isPending}
                  disabled={!contactSettings}
                  className="px-6 h-10 rounded-xl"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {t('saveChanges') || 'Save Changes'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  )
}
