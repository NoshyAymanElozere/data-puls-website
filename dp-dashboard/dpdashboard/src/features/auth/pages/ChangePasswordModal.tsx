import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useZodForm } from '@/shared/components/form-fields'
import { BaseInputField } from '@/shared/components/base-input-field'
import ModalStatus from '@/shared/components/modal-status'
import { useChangePassword } from '../api/useAuth'

const schema = z
  .object({
    current_password: z.string().min(1, 'requiredField'),
    password: z.string().min(8, 'passwordMinLength'),
    password_confirmation: z.string().min(1, 'requiredField'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'passwordMismatch',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof schema>

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const { t } = useTranslation()
  const methods = useZodForm(schema, {
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const changePassword = useChangePassword(methods.setError)

  useEffect(() => {
    if (open) {
      methods.reset({ current_password: '', password: '', password_confirmation: '' })
    }
  }, [open, methods.reset])

  const handleSave = (formData: FormValues) => {
    changePassword.mutate(formData, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <FormProvider {...methods}>
      <ModalStatus
        open={open}
        onOpenChange={onOpenChange}
        title={t('changePassword') || 'Change Password'}
        agreeLabel={t('save') || 'Save'}
        cancelLabel={t('cancel') || 'Cancel'}
        onAgreeButtonClick={methods.handleSubmit(handleSave)}
        onCancelButtonClick={() => onOpenChange(false)}
        loading={changePassword.isPending}
      >
        <div className="space-y-4 py-2">
          <BaseInputField
            name="current_password"
            type="password"
            label={t('currentPassword') || 'Current Password'}
            required
          />
          <BaseInputField
            name="password"
            type="password"
            label={t('newPassword') || 'New Password'}
            required
          />
          <BaseInputField
            name="password_confirmation"
            type="password"
            label={t('confirmPassword') || 'Confirm Password'}
            required
          />
        </div>
      </ModalStatus>
    </FormProvider>
  )
}
