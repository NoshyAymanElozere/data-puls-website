import { useEffect } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/components/button'
import { Card, CardContent } from '@/shared/components/card'
import { StickyFormActions } from '@/shared/components/StickyFormActions'
import { useZodForm } from '@/shared/components/form-fields'
import { TableSkeleton } from '@/shared/components/table'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import {
  useSubscriptionPackage,
  useUpdateSubscriptionPackage,
} from '../api/useSubscriptionPackages'
import { SubscriptionPackageForm } from './SubscriptionPackageForm'
import { PackageSubscribersPanel } from '../components/PackageSubscribersPanel'
import { getInitialValues, updateSchema, type SubscriptionPackageFormValues } from './validationSchema'

export default function SubscriptionPackageEditPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const packageId = Number(id)
  const label = t('subscriptionPackages')
  const { data: admin } = useProfile()

  const canUpdate = hasPermission(admin, 'subscription_packages.update')

  const { data: packageData, isLoading } = useSubscriptionPackage(
    Number.isNaN(packageId) ? null : packageId
  )

  const methods = useZodForm(updateSchema, getInitialValues())
  const updateMutation = useUpdateSubscriptionPackage(methods.setError)

  useEffect(() => {
    if (packageData) {
      methods.reset(getInitialValues(packageData))
    }
  }, [packageData, methods.reset])

  const onSubmit = (formData: SubscriptionPackageFormValues) => {
    if (!packageId || Number.isNaN(packageId)) return
    updateMutation.mutate(
      { id: packageId, payload: formData },
      { onSuccess: () => navigate('/subscription-packages') }
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <TableSkeleton rows={6} cols={1} />
      </Card>
    )
  }

  if (!packageData) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <p className="text-muted-foreground text-center py-8">{t('pageNotFound')}</p>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/subscription-packages">
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
        <Link to="/subscription-packages">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Link>
      </Button>

      <Card className="border-border/60 shadow-sm rounded-2xl bg-card">
        <StickyFormActions title={`${t('edit')} ${label}`}>
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
            <SubscriptionPackageForm disabled={!canUpdate} />
          </FormProvider>
        </CardContent>
      </Card>

      <PackageSubscribersPanel
        subscribers={packageData.subscribers}
        subscribersCount={packageData.subscribers_count}
      />
    </div>
  )
}
