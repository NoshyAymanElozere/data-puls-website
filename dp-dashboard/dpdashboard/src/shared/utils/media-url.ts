import { getApiOrigin } from '@/shared/utils/public-api-url'

export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined

  if (/^http:\/\//i.test(url)) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return url.replace(/^http:\/\//i, 'https://')
    }
    return url
  }

  if (/^(https:|data:|blob:)/i.test(url)) return url

  const origin = getApiOrigin()
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`
}
