import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { AUTH_TOKEN_KEY, getCookie } from '@/shared/utils/cookies'
import { getAdminApiBaseUrl } from '@/shared/utils/public-api-url'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo?: Echo<'reverb'>
  }
}

let echoInstance: Echo<'reverb'> | null = null

export function getEcho(): Echo<'reverb'> | null {
  const key = import.meta.env.VITE_REVERB_APP_KEY
  if (!key) return null

  if (!echoInstance) {
    window.Pusher = Pusher

    const apiUrl = getAdminApiBaseUrl().replace(/\/$/, '')
    // Broadcasting auth is at host root, not under /admin
    const authEndpoint = `${apiUrl.replace(/\/admin$/, '')}/broadcasting/auth`

    const pageIsSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? 'https'

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key,
      wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
      wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
      forceTLS: pageIsSecure || reverbScheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer ${getCookie(AUTH_TOKEN_KEY) ?? ''}`,
          Accept: 'application/json',
        },
      },
    })
  }

  return echoInstance
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
