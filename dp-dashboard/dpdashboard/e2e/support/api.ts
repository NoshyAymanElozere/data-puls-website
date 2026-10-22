import { expect, request, type APIRequestContext, type Page } from '@playwright/test'

export const API_URL = process.env.E2E_API_URL ?? `http://127.0.0.1:${process.env.E2E_API_PORT ?? '8010'}/admin`
export const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@herz.com'
export const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? '12345678'

export interface Translations {
  en: string
  ar: string
}

/** Short unique tag so records created by one run never collide with seeded or earlier data. */
export function uid(): string {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`
}

/** Authenticated client for the real admin API, used to arrange and verify data. */
export async function adminApi(): Promise<APIRequestContext> {
  const anon = await request.newContext({ extraHTTPHeaders: { Accept: 'application/json' } })
  const login = await anon.post(`${API_URL}/login`, { data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })
  expect(login.ok(), await login.text()).toBeTruthy()
  const token = (await login.json()).data.token as string
  await anon.dispose()

  return request.newContext({
    baseURL: `${API_URL}/`,
    extraHTTPHeaders: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
}

export async function createRecord(
  api: APIRequestContext,
  path: string,
  data: Record<string, unknown>
): Promise<{ id: number } & Record<string, unknown>> {
  const response = await api.post(path, { data })
  expect(response.status(), `${path}: ${await response.text()}`).toBe(201)
  return (await response.json()).data
}

export async function showRecord(api: APIRequestContext, path: string, id: number) {
  const response = await api.get(`${path}/${id}`)
  expect(response.ok(), await response.text()).toBeTruthy()
  return (await response.json()).data as Record<string, unknown>
}

/** Pins the dashboard UI language before any app script runs. */
export async function useUiLanguage(page: Page, lang: 'en' | 'ar') {
  await page.addInitScript((value) => window.localStorage.setItem('lang', value), lang)
}

/** Resolves once the dashboard fetches the single-record `show` endpoint for this record. */
export function waitForShowRequest(page: Page, resourcePath: string, id: number) {
  const pattern = new RegExp(`/admin/${resourcePath}/${id}(\\?|$)`)
  return page.waitForResponse((r) => r.request().method() === 'GET' && pattern.test(r.url()) && r.ok())
}
