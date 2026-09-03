import { useEffect } from 'react'
import { useAppBranding } from '@/shared/hooks/useAppBranding'

/** Syncs document title and favicon from backend app settings. */
export function AppBrandingHead() {
  const { appName, logoUrl } = useAppBranding('auto')

  useEffect(() => {
    if (appName) {
      document.title = appName
    }
  }, [appName])

  useEffect(() => {
    if (!logoUrl) return

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }

    link.href = logoUrl
  }, [logoUrl])

  return null
}
