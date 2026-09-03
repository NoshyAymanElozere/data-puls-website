/** Must match `base` in vite.config.ts — React Router strips this prefix from routes. */
export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')
