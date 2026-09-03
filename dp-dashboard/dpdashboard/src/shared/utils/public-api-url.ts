const DEFAULT_ADMIN_API_URL = 'https://herz-dashboard.am.prompita.com/admin'

/** Upgrade http→https when the app is served over HTTPS (avoids mixed-content blocks). */
function ensureSecureOrigin(url: string): string {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return url.replace(/^http:\/\//i, 'https://')
  }
  return url
}

export function getAdminApiBaseUrl(): string {
  return ensureSecureOrigin(import.meta.env.VITE_API_URL ?? DEFAULT_ADMIN_API_URL)
}

/** Derive the public API base URL from the admin API URL (…/admin → …/api). */
export function getPublicApiBaseUrl(): string {
  const adminUrl = getAdminApiBaseUrl()
  if (/\/admin\/?$/.test(adminUrl)) {
    return adminUrl.replace(/\/admin\/?$/, '/api')
  }
  return adminUrl.replace(/\/?$/, '/api')
}

export function getApiOrigin(): string {
  return getAdminApiBaseUrl().replace(/\/admin\/?$/, '')
}
