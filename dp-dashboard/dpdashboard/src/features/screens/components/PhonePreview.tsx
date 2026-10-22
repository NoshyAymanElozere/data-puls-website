import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Bell, FileText, Home, ScanLine, User } from 'lucide-react'
import type { ScreenThemeValues } from '../api/useScreens'
import { HEX_COLOR_REGEX, THEME_COLOR_FIELDS, type ThemeColorField, type ThemeMode } from '../constants'
import type { ScreenFormValues } from '../pages/validationSchema'

interface PhonePreviewProps {
  mode: ThemeMode
  isGlobal: boolean
  globalValues: ScreenThemeValues | null
  currentBackgroundUrl?: string | null
  title: string
}

const FALLBACK_COLORS: Record<ThemeMode, Record<ThemeColorField, string>> = {
  light: {
    primary_color: '#F07522',
    secondary_color: '#291B4E',
    background_color: '#FCF8ED',
    card_color: '#FFFFFF',
    border_color: '#E0D5C6',
    text_primary_color: '#291B4E',
    text_secondary_color: '#736A86',
    icon_color: '#736A86',
    button_color: '#F07522',
    button_text_color: '#FFFFFF',
  },
  dark: {
    primary_color: '#F07522',
    secondary_color: '#C9BEF0',
    background_color: '#15101F',
    card_color: '#221A33',
    border_color: '#3A3050',
    text_primary_color: '#FFFFFF',
    text_secondary_color: '#B5ADC6',
    icon_color: '#B5ADC6',
    button_color: '#F07522',
    button_text_color: '#FFFFFF',
  },
}

/** Live mini mock-up of the app screen using resolved values (override ?? global). */
export function PhonePreview({ mode, isGlobal, globalValues, currentBackgroundUrl, title }: PhonePreviewProps) {
  const { t, i18n } = useTranslation()
  const { control } = useFormContext<ScreenFormValues>()
  const values = useWatch({ control, name: `theme.${mode}` })

  const g = isGlobal ? {} : (globalValues ?? {})

  const color = (field: ThemeColorField): string => {
    const own = values?.[field]
    if (own && HEX_COLOR_REGEX.test(own)) return own
    const inherited = g[field]
    if (inherited && HEX_COLOR_REGEX.test(inherited)) return inherited
    return FALLBACK_COLORS[mode][field]
  }

  const c = Object.fromEntries(THEME_COLOR_FIELDS.map((f) => [f, color(f)])) as Record<ThemeColorField, string>

  const fontFamily = values?.font_family?.trim() || g.font_family || undefined
  const rawScale = values?.font_scale !== '' && values?.font_scale !== undefined ? Number(values.font_scale) : Number(g.font_scale ?? 1)
  const scale = Number.isFinite(rawScale) && rawScale > 0 ? rawScale : 1
  const px = (size: number) => `${(size * scale).toFixed(1)}px`

  const ownBg = currentBackgroundUrl || null
  const backgroundImage = ownBg ?? (isGlobal ? null : g.background_image || null)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-[220px] h-[440px] rounded-[2rem] border-[6px] border-zinc-900 shadow-xl overflow-hidden"
        style={{
          backgroundColor: c.background_color,
          backgroundImage: backgroundImage ? `url("${backgroundImage}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: fontFamily ? `${fontFamily}, system-ui, sans-serif` : undefined,
        }}
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* status bar notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-3.5 w-16 rounded-full bg-zinc-900" />

        <div className="flex h-full flex-col px-3 pt-8 pb-2">
          {/* app bar */}
          <div className="flex items-center justify-between">
            <span className="font-bold truncate" style={{ color: c.text_primary_color, fontSize: px(13) }}>
              {title}
            </span>
            <Bell className="h-4 w-4 shrink-0" style={{ color: c.icon_color }} />
          </div>

          {/* hero card in primary/secondary */}
          <div
            className="mt-3 rounded-xl p-2.5"
            style={{ background: `linear-gradient(135deg, ${c.secondary_color}, ${c.primary_color})` }}
          >
            <p className="font-bold text-white" style={{ fontSize: px(11) }}>
              {t('screenPreviewHeadline')}
            </p>
            <p className="text-white/80" style={{ fontSize: px(9) }}>
              {t('screenPreviewSubline')}
            </p>
          </div>

          {/* list cards */}
          <div className="mt-3 space-y-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border p-2"
                style={{ backgroundColor: c.card_color, borderColor: c.border_color }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${c.primary_color}22` }}
                >
                  <FileText className="h-3.5 w-3.5" style={{ color: c.icon_color }} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: c.text_primary_color, fontSize: px(10) }}>
                    {t('screenPreviewCardTitle')}
                  </p>
                  <p className="truncate" style={{ color: c.text_secondary_color, fontSize: px(8.5) }}>
                    {t('screenPreviewCardSubtitle')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* primary button */}
          <button
            type="button"
            tabIndex={-1}
            className="w-full rounded-xl py-2 font-bold"
            style={{ backgroundColor: c.button_color, color: c.button_text_color, fontSize: px(11) }}
          >
            {t('screenPreviewButton')}
          </button>

          {/* bottom nav */}
          <div
            className="mt-2 flex items-center justify-around rounded-xl border py-1.5"
            style={{ backgroundColor: c.card_color, borderColor: c.border_color }}
          >
            <Home className="h-4 w-4" style={{ color: c.primary_color }} />
            <ScanLine className="h-4 w-4" style={{ color: c.icon_color }} />
            <User className="h-4 w-4" style={{ color: c.icon_color }} />
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground text-center max-w-[220px]">{t('screenPreviewNote')}</p>
    </div>
  )
}
