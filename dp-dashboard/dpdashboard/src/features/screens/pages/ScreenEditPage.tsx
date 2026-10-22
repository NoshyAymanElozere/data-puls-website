import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, Globe2, Moon, Save, Smartphone, Sun } from 'lucide-react'
import { FormProvider, type FieldErrors } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { Card, CardContent } from '@/shared/components/card'
import { useZodForm } from '@/shared/components/form-fields'
import { StickyFormActions } from '@/shared/components/StickyFormActions'
import { TableSkeleton } from '@/shared/components/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/tabs'
import { useProfile } from '@/features/auth/api/useAuth'
import { hasPermission } from '@/shared/utils/permissions'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { cn } from '@/shared/utils/utils'
import { useScreen, useUpdateScreen } from '../api/useScreens'
import { ImageFileField } from '../components/ImageFileField'
import { PhonePreview } from '../components/PhonePreview'
import { ThemeFieldsPanel } from '../components/ThemeFieldsPanel'
import { SCREENS_PERMISSIONS, THEME_MODES, type ThemeMode } from '../constants'
import { ScreensNoPermission } from './ScreensPage'
import { getInitialValues, normalizeThemeMode, screenSchema, type ScreenFormValues } from './validationSchema'

function ReadOnlyField({ label, value, dir }: { label: string; value: string; dir: 'rtl' | 'ltr' }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-line" dir={dir}>
        {value || '—'}
      </p>
    </div>
  )
}

function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-bold text-foreground">{children}</h3>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  )
}

export default function ScreenEditPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const screenId = Number(id)
  const validId = Number.isFinite(screenId) && screenId > 0
  const label = t('appScreens')
  const { data: admin, isLoading: profileLoading } = useProfile()

  const canView = hasPermission(admin, SCREENS_PERMISSIONS.view)
  const canUpdate = hasPermission(admin, SCREENS_PERMISSIONS.update)
  const readOnly = !canUpdate

  const { data: screen, isLoading } = useScreen(validId ? screenId : null)

  const methods = useZodForm(screenSchema, getInitialValues())
  const updateMutation = useUpdateScreen(methods.setError)

  const [mode, setMode] = useState<ThemeMode>('light')
  const [previewTab, setPreviewTab] = useState<'screenshot' | 'live'>('screenshot')

  useEffect(() => {
    if (screen) methods.reset(getInitialValues(screen))
  }, [screen, methods.reset])

  const isRtl = i18n.language === 'ar'

  if (!profileLoading && !canView) return <ScreensNoPermission />

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <TableSkeleton rows={6} cols={1} />
      </Card>
    )
  }

  if (!screen) {
    return (
      <Card className="border-border/60 shadow-sm rounded-2xl p-6 bg-card">
        <p className="text-muted-foreground text-center py-8">{t('screenNotFound')}</p>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/screens">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {label}
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  const isGlobal = screen.type === 'global'
  const screenTitle = getLocalizedValue(screen.name, i18n.language) || screen.key
  const themeModes = {
    light: normalizeThemeMode(screen.theme?.light),
    dark: normalizeThemeMode(screen.theme?.dark),
  }
  const globalModes = isGlobal
    ? null
    : {
        light: normalizeThemeMode(screen.global_theme?.light),
        dark: normalizeThemeMode(screen.global_theme?.dark),
      }

  const errors = methods.formState.errors
  const modeHasErrors = (m: ThemeMode) => !!errors.theme?.[m]

  const onSubmit = (values: ScreenFormValues) => {
    updateMutation.mutate({ id: screen.id, payload: values })
  }

  const onInvalid = (formErrors: FieldErrors<ScreenFormValues>) => {
    if (formErrors.theme && !formErrors.theme[mode]) {
      setMode(formErrors.theme.light ? 'light' : 'dark')
    }
    toast.error(t('screensFixErrors'))
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" className="h-9 px-3">
        <Link to="/screens">
          <ArrowLeft className={cn('h-4 w-4', isRtl ? 'ml-2 rotate-180' : 'mr-2')} />
          {label}
        </Link>
      </Button>

      <FormProvider {...methods}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
          <Card className="border-border/60 shadow-sm rounded-2xl bg-card min-w-0">
            <StickyFormActions
              title={
                <span className="flex items-center gap-2 min-w-0">
                  {isGlobal ? <Globe2 className="h-5 w-5 text-main shrink-0" /> : <Smartphone className="h-5 w-5 text-main shrink-0" />}
                  <span className="truncate">
                    {canUpdate ? `${t('edit')} ${screenTitle}` : screenTitle}
                  </span>
                </span>
              }
            >
              {canUpdate && (
                <Button
                  onClick={methods.handleSubmit(onSubmit, onInvalid)}
                  loading={updateMutation.isPending}
                  className="h-9 px-4 rounded-xl"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
                </Button>
              )}
            </StickyFormActions>

            <CardContent className="p-6 space-y-8">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                {isGlobal ? (
                  <Badge variant="warning" dot>
                    {t('screenGlobalTheme')}
                  </Badge>
                ) : (
                  <Badge variant="info" dot>
                    {screen.type_label || t(`screenType_${screen.type}`)}
                  </Badge>
                )}
                {screen.group && (
                  <Badge variant="outline">{screen.group_label || t(`screenGroup_${screen.group}`)}</Badge>
                )}
                <span className="font-mono text-muted-foreground" dir="ltr">
                  {screen.key}
                </span>
                {screen.flutter_file && (
                  <span className="font-mono text-[11px] text-muted-foreground truncate" dir="ltr" title={screen.flutter_file}>
                    {screen.flutter_file}
                  </span>
                )}
                {screen.updated_at && (
                  <span className="ms-auto text-muted-foreground">
                    {t('screenUpdatedAt')}: {screen.updated_at}
                  </span>
                )}
              </div>

              {isGlobal && (
                <div className="rounded-xl border border-main/30 bg-main/5 p-3 text-xs text-foreground">
                  {t('screenGlobalThemeEditHint')}
                </div>
              )}

              {/* Basic info */}
              <section>
                <SectionTitle>{t('screenBasicInfo')}</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/60 p-4">
                  <ReadOnlyField label={t('arabicName')} value={getLocalizedValue(screen.name, 'ar')} dir="rtl" />
                  <ReadOnlyField label={t('englishName')} value={getLocalizedValue(screen.name, 'en')} dir="ltr" />
                  <ReadOnlyField label={t('arabicDescription')} value={getLocalizedValue(screen.description, 'ar')} dir="rtl" />
                  <ReadOnlyField label={t('englishDescription')} value={getLocalizedValue(screen.description, 'en')} dir="ltr" />
                </div>
              </section>

              {/* Theme */}
              <section>
                <SectionTitle hint={isGlobal ? t('screenThemeGlobalHint') : t('screenThemeOverrideHint')}>
                  {t('screenAppearance')}
                </SectionTitle>
                <Tabs value={mode} onValueChange={(v) => setMode(v as ThemeMode)} dir={isRtl ? 'rtl' : 'ltr'}>
                  <TabsList className="mb-3">
                    {THEME_MODES.map((m) => (
                      <TabsTrigger key={m} value={m} className="gap-1.5 px-4">
                        {m === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {m === 'light' ? t('screenLightMode') : t('screenDarkMode')}
                        {modeHasErrors(m) && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                {THEME_MODES.map((m) => (
                  <div key={m} className={mode === m ? 'block' : 'hidden'}>
                    <ThemeFieldsPanel
                      mode={m}
                      isGlobal={isGlobal}
                      globalValues={globalModes ? globalModes[m] : null}
                      disabled={readOnly}
                    />
                  </div>
                ))}
              </section>
            </CardContent>
          </Card>

          {/* Side preview */}
          <aside className="lg:sticky lg:top-4 space-y-3">
            <Card className="border-border/60 shadow-sm rounded-2xl bg-card p-4">
              <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                {(['screenshot', 'live'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPreviewTab(tab)}
                    className={cn(
                      'rounded-md px-2 py-1 text-xs font-semibold transition-all',
                      previewTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                    )}
                  >
                    {tab === 'screenshot' ? t('screenScreenshot') : t('screenLivePreview')}
                  </button>
                ))}
              </div>

              {previewTab === 'screenshot' ? (
                <ImageFileField
                  name="screenshot"
                  currentUrl={screen.screenshot_url}
                  disabled={readOnly}
                  previewClassName={screen.key === 'bottom_navigation' ? 'h-24 w-full' : 'h-[460px] w-full'}
                  imageClassName="object-contain"
                />
              ) : (
                <PhonePreview
                  mode={mode}
                  isGlobal={isGlobal}
                  globalValues={globalModes ? globalModes[mode] : null}
                  currentBackgroundUrl={themeModes[mode].background_image}
                  title={screenTitle}
                />
              )}

              {previewTab === 'live' && (
                <p className="mt-2 text-center text-[11px] font-semibold text-muted-foreground">
                  {mode === 'light' ? t('screenLightMode') : t('screenDarkMode')}
                </p>
              )}
            </Card>
          </aside>
        </div>
      </FormProvider>
    </div>
  )
}
