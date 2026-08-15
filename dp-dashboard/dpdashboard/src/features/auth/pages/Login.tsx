import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/shared/components/button'
import { BaseInputField } from '@/shared/components/base-input-field'
import { useZodForm } from '@/shared/components/form-fields'
import { useLogin } from '../api/useAuth'

export default function Login() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { mutate: login, isPending } = useLogin()

  const loginSchema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired'))
  })

  const methods = useZodForm(loginSchema, {
    email: '',
    password: ''
  })

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-[420px] bg-[#F8F9FA] rounded-[32px] shadow-xs px-8 py-10 flex flex-col items-center border border-gray-100/50">

        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-8 select-none">
          <img src={`${import.meta.env.BASE_URL}dpLogo.png`} alt="Data Pulse Logo" className="h-16 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#111] mb-8 text-center">
          {t('loginTitle')}
        </h2>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full space-y-6">

            {/* Email Field */}
            <div>
              <BaseInputField
                name="email"
                label={t('email') + ' *'}
                placeholder="admin@example.com"
                className="w-full h-12 px-4 rounded-xl border border-main/40 focus:ring-main/20 focus:border-main text-left font-semibold text-gray-800 placeholder-gray-300 transition-all outline-none"
                dir="ltr"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <BaseInputField
                name="password"
                label={t('password') + ' *'}
                type="password"
                placeholder="********"
                className="w-full h-12 px-4 rounded-xl border border-main/40 focus:ring-main/20 focus:border-main text-left font-bold text-gray-800 placeholder-gray-300 transition-all outline-none"
                dir="ltr"
                required
              />
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-main hover:bg-main/90 text-white rounded-xl font-bold text-base shadow-xs transition-colors mt-2"
            >
              {isPending ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('login')}
            </Button>


          </form>
        </FormProvider>
      </div>
    </div>
  )
}
