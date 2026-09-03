import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { AppLogo } from '@/shared/components/AppLogo'
import { useZodForm } from '@/shared/components/form-fields'
import { useAppBranding } from '@/shared/hooks/useAppBranding'
import { useLogin } from '../api/useAuth'

export default function Login() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { mutate: login, isPending } = useLogin()
  const { appName } = useAppBranding('public')

  const loginSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired')),
  })

  const methods = useZodForm(loginSchema, { email: '', password: '' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-[420px] bg-card rounded-[32px] shadow-xs px-8 py-10 flex flex-col items-center border border-border">
        <div className="flex items-center justify-center mb-4 select-none">
          <AppLogo source="public" className="h-16 max-w-[12rem] object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2 text-center">{appName}</h1>
        <p className="text-sm text-muted-foreground mb-8 text-center">{t('loginTitle')}</p>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((data) => login(data))} className="w-full space-y-6">
            <BaseInputField
              name="email"
              label={`${t('email')} *`}
              placeholder="admin@example.com"
              className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:ring-primary/20 focus:border-primary text-left font-semibold text-foreground placeholder:text-muted-foreground/50 transition-all outline-none"
              dir="ltr"
              required
            />
            <BaseInputField
              name="password"
              label={`${t('password')} *`}
              type="password"
              placeholder="********"
              className="w-full h-12 px-4 rounded-xl border border-primary/30 focus:ring-primary/20 focus:border-primary text-left font-bold text-foreground placeholder:text-muted-foreground/50 transition-all outline-none"
              dir="ltr"
              required
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl font-bold text-base shadow-xs mt-2"
              variant="default"
            >
              {isPending ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('login')}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
