import { useEffect } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Gift, Loader2, Save, Smartphone } from 'lucide-react'
import { ControlledInput } from '@/shared/components/form-fields'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import { Switch } from '@/shared/components/controls'
import { Label } from '@/shared/components/label'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import {
  DEFAULT_STATISTICS_SETTINGS,
  DEFAULT_SUBSCRIPTIONS_SETTINGS,
  useStatisticsSettings,
  useSubscriptionsSettings,
  useUpdateStatisticsSettings,
  useUpdateSubscriptionsSettings,
  type StatisticsSettings,
  type SubscriptionsSettings,
} from '../../api/useSubscriptionSettings'

const wholeNumber = () => z.coerce.number({ invalid_type_error: 'mustBeWholeNumber' }).int('mustBeWholeNumber')

const subscriptionsSchema = z.object({
  free_trial_enabled: z.boolean(),
  free_trial_months: wholeNumber().min(0, 'freeTrialMonthsRange').max(60, 'freeTrialMonthsRange'),
  expiring_soon_days: wholeNumber().min(1, 'expiringSoonDaysRange').max(90, 'expiringSoonDaysRange'),
})

const statisticsSchema = z.object({
  app_downloads_ios: wholeNumber().min(0, 'downloadsMinZero'),
  app_downloads_android: wholeNumber().min(0, 'downloadsMinZero'),
})

type SubscriptionsFormValues = z.infer<typeof subscriptionsSchema>
type StatisticsFormValues = z.infer<typeof statisticsSchema>

function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-7 w-7 animate-spin text-main" />
    </div>
  )
}

function SectionError() {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
      {t('settingsLoadError')}
    </div>
  )
}

function FreeTrialSwitch({ control, disabled }: { control: Control<SubscriptionsFormValues>; disabled?: boolean }) {
  const { t } = useTranslation()
  return (
    <Controller
      name="free_trial_enabled"
      control={control}
      render={({ field }) => (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="space-y-1">
            <Label htmlFor="free_trial_enabled" className="text-sm font-bold text-foreground cursor-pointer">
              {t('freeTrialEnabled')}
            </Label>
            <p className="text-xs text-muted-foreground">{t('freeTrialEnabledHint')}</p>
          </div>
          <Switch
            id="free_trial_enabled"
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        </div>
      )}
    />
  )
}

function SubscriptionsSection({ canUpdate }: { canUpdate: boolean }) {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useSubscriptionsSettings()
  const methods = useForm<SubscriptionsFormValues>({
    resolver: zodResolver(subscriptionsSchema),
    defaultValues: DEFAULT_SUBSCRIPTIONS_SETTINGS,
  })
  const save = useUpdateSubscriptionsSettings(methods.setError)
  const { reset } = methods

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const trialEnabled = methods.watch('free_trial_enabled')

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Gift className="h-4 w-4 text-main" />
          {t('freeTrialAndSubscriptions')}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{t('freeTrialAndSubscriptionsDesc')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <SectionLoader />
        ) : isError ? (
          <SectionError />
        ) : (
          <form onSubmit={methods.handleSubmit((values) => save.mutate(values as SubscriptionsSettings))} className="space-y-6" noValidate>
            <FreeTrialSwitch control={methods.control} disabled={!canUpdate} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ControlledInput
                name="free_trial_months"
                control={methods.control}
                type="number"
                label={t('freeTrialMonths')}
                hint={t('freeTrialMonthsHint')}
                disabled={!canUpdate || !trialEnabled}
                required
              />
              <ControlledInput
                name="expiring_soon_days"
                control={methods.control}
                type="number"
                label={t('expiringSoonDays')}
                hint={t('expiringSoonDaysHint')}
                disabled={!canUpdate}
                required
              />
            </div>

            {canUpdate && (
              <div className="flex justify-end">
                <Button type="submit" loading={save.isPending} disabled={!data} className="px-6 h-10 rounded-xl gap-2">
                  <Save className="h-4 w-4" />
                  {t('saveChanges')}
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}

function StatisticsSection({ canUpdate }: { canUpdate: boolean }) {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useStatisticsSettings()
  const methods = useForm<StatisticsFormValues>({
    resolver: zodResolver(statisticsSchema),
    defaultValues: DEFAULT_STATISTICS_SETTINGS,
  })
  const save = useUpdateStatisticsSettings(methods.setError)
  const { reset } = methods

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  return (
    <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border/40 px-6 py-5">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-main" />
          {t('appDownloads')}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{t('downloadsManualHint')}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <SectionLoader />
        ) : isError ? (
          <SectionError />
        ) : (
          <form
            onSubmit={methods.handleSubmit((values) => save.mutate(values as StatisticsSettings))}
            className="space-y-6"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ControlledInput
                name="app_downloads_ios"
                control={methods.control}
                type="number"
                label={t('appDownloadsIos')}
                hint={t('appDownloadsIosHint')}
                disabled={!canUpdate}
                required
              />
              <ControlledInput
                name="app_downloads_android"
                control={methods.control}
                type="number"
                label={t('appDownloadsAndroid')}
                hint={t('appDownloadsAndroidHint')}
                disabled={!canUpdate}
                required
              />
            </div>

            {canUpdate && (
              <div className="flex justify-end">
                <Button type="submit" loading={save.isPending} disabled={!data} className="px-6 h-10 rounded-xl gap-2">
                  <Save className="h-4 w-4" />
                  {t('saveChanges')}
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function SubscriptionSettingsPage() {
  const { i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { data: admin } = useProfile()
  const canUpdate = hasPermission(admin, 'app_settings.update')

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <SubscriptionsSection canUpdate={canUpdate} />
      <StatisticsSection canUpdate={canUpdate} />
    </div>
  )
}
