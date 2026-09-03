import { useAppBranding, type AppBrandingSource } from '@/shared/hooks/useAppBranding'
import { cn } from '@/shared/utils/utils'

interface AppLogoProps {
  className?: string
  collapsed?: boolean
  /** Adds a soft branded backdrop so the logo stays visible on dark surfaces */
  framed?: boolean
  /** `public` uses unauthenticated `/api/settings` (login page). `auto` picks based on auth token. */
  source?: AppBrandingSource
}

export function AppLogo({ className, collapsed, framed = false, source = 'auto' }: AppLogoProps) {
  const { appName, logoUrl, isLoading } = useAppBranding(source)

  const sizeClass = collapsed ? 'h-9 w-9' : 'h-10 w-24'

  const placeholder = (
    <div
      className={cn('animate-pulse rounded-lg bg-muted/60', sizeClass, className)}
      aria-hidden
    />
  )

  const image = logoUrl ? (
    <img
      src={logoUrl}
      alt={appName}
      className={cn(
        collapsed ? 'h-9 w-9 shrink-0 object-contain' : 'h-10 object-contain',
        className
      )}
    />
  ) : isLoading ? (
    placeholder
  ) : null

  if (!image) return null

  if (!framed) return image

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl border shadow-sm',
        'bg-primary/10 border-primary/15',
        'dark:bg-[#EDE8F6] dark:border-primary/25 dark:shadow-primary/10',
        collapsed ? 'h-12 w-12' : 'h-12 min-w-[3rem] px-3'
      )}
    >
      {image}
    </div>
  )
}
