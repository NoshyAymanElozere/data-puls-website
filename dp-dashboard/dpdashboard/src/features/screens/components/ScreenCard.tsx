import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Globe2, ImageOff, Palette, Sparkles, Type } from 'lucide-react'
import { Badge } from '@/shared/components/badge'
import { cn } from '@/shared/utils/utils'
import type { ScreenListItem } from '../api/useScreens'

function Thumbnail({ url, screenKey }: { url: string | null; screenKey: string }) {
  const { t } = useTranslation()
  const isWide = screenKey === 'bottom_navigation'
  if (!url) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
        <ImageOff className="h-6 w-6 mb-1 opacity-50" />
        <span className="text-[11px] font-semibold">{t('noImage')}</span>
      </div>
    )
  }
  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      className={cn(
        'h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]',
        isWide ? 'px-3' : 'py-2'
      )}
    />
  )
}

export function ScreenCard({ item }: { item: ScreenListItem }) {
  const { t } = useTranslation()
  return (
    <Link
      to={`/screens/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:border-main/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
    >
      <div className="relative h-60 bg-muted/50 border-b border-border/40">
        <Thumbnail url={item.screenshot_url} screenKey={item.key} />
        {item.has_custom_theme && (
          <span className="absolute top-2 end-2 inline-flex items-center gap-1 rounded-full bg-main px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            <Sparkles className="h-3 w-3" />
            {t('screenCustomized')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground" title={item.name}>
            {item.name}
          </p>
          <p className="truncate font-mono text-[11px] text-muted-foreground" dir="ltr">
            {item.key}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="info" className="text-[10px] px-2 py-0">
            {item.type_label || t(`screenType_${item.type}`)}
          </Badge>
          {item.group && (
            <Badge variant="outline" className="text-[10px] px-2 py-0">
              {item.group_label || t(`screenGroup_${item.group}`)}
            </Badge>
          )}
        </div>
        <div className="mt-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1" title={t('screenCustomFields')}>
            <Palette className="h-3.5 w-3.5" /> {item.custom_fields_count}
          </span>
          <span className="inline-flex items-center gap-1" title={t('screenTexts')}>
            <Type className="h-3.5 w-3.5" /> {item.texts_count}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function GlobalThemeCard({ item }: { item: ScreenListItem }) {
  const { t, i18n } = useTranslation()
  const Chevron = i18n.language === 'ar' ? ChevronLeft : ChevronRight
  return (
    <Link
      to={`/screens/${item.id}`}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-main/40 bg-gradient-to-br from-main/15 via-main/5 to-transparent p-5 shadow-sm transition-all hover:border-main hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-main text-white shadow-md">
        <Globe2 className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base font-bold text-foreground">{item.name || t('screenGlobalTheme')}</p>
          <Badge variant="warning" className="text-[10px] px-2 py-0">
            {t('screenGlobalTheme')}
          </Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-mono" dir="ltr">
            {item.key}
          </span>
          <span className="inline-flex items-center gap-1">
            <Palette className="h-3.5 w-3.5" /> {item.custom_fields_count} {t('screenFieldsSet')}
          </span>
          {item.updated_at && (
            <span>
              {t('screenUpdatedAt')}: {item.updated_at}
            </span>
          )}
        </div>
      </div>
      <Chevron className="h-5 w-5 shrink-0 text-main transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
