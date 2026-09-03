import { useAppSettingsGroup, usePublicAppBranding } from '@/features/settings/api/useAppSettings'
import { AUTH_TOKEN_KEY, getCookie } from '@/shared/utils/cookies'
import { getLocalizedValue } from '@/shared/utils/localized-value'
import { resolveMediaUrl } from '@/shared/utils/media-url'
import { useTranslation } from 'react-i18next'

export type AppBrandingSource = 'auto' | 'public' | 'private'

export function useAppBranding(source: AppBrandingSource = 'auto') {
  const { i18n } = useTranslation()
  const token = getCookie(AUTH_TOKEN_KEY)
  const usePrivate = source === 'private' || (source === 'auto' && !!token)
  const usePublic = source === 'public' || (source === 'auto' && !token)

  const { data: settings, isLoading: privateLoading } = useAppSettingsGroup('general', {
    enabled: usePrivate,
  })
  const { data: publicBranding, isLoading: publicLoading } = usePublicAppBranding({
    enabled: usePublic,
  })

  const appName = usePrivate
    ? getLocalizedValue(settings?.name, i18n.language) || 'Admin Dashboard'
    : publicBranding?.app_name || 'Admin Dashboard'

  const logoUrl = usePrivate
    ? resolveMediaUrl(settings?.logo_url)
    : resolveMediaUrl(publicBranding?.app_logo)

  return {
    appName,
    logoUrl,
    isLoading: usePrivate ? privateLoading : publicLoading,
  }
}
