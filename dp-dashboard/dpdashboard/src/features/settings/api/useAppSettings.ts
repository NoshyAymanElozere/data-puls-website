import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '@/shared/services/axios'
import type { SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendOptionalFile, appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { applyValidationErrors } from '@/shared/utils/form-errors'
import { getPublicApiBaseUrl } from '@/shared/utils/public-api-url'
import type { UseFormSetError } from 'react-hook-form'

export type AppSettingsGroup = 'general' | 'contact'

export interface GeneralAppSettings {
  group: 'general'
  name: Translatable
  logo_url?: string | null
  default_locale: string
}

export interface ContactAppSettings {
  group: 'contact'
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  facebook?: string | null
  x?: string | null
  instagram?: string | null
  telegram?: string | null
  youtube?: string | null
}

export interface GeneralSettingsFormData {
  nameEn: string
  nameAr: string
  default_locale: string
  logo?: File | null
}

export interface ContactSettingsFormData {
  phone: string
  whatsapp: string
  email: string
  facebook: string
  x: string
  instagram: string
  telegram: string
  youtube: string
}

export interface PublicAppBranding {
  app_name: string
  app_logo: string | null
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function normalizeTranslatable(value: unknown, record?: Record<string, unknown>, prefix?: string): Translatable {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    return {
      en: normalizeString(obj.en ?? obj.en_US),
      ar: normalizeString(obj.ar ?? obj.ar_SA),
    }
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>
      if (parsed && typeof parsed === 'object') {
        return {
          en: normalizeString(parsed.en),
          ar: normalizeString(parsed.ar),
        }
      }
    } catch {
      return { en: value, ar: value }
    }
  }

  if (record && prefix) {
    return {
      en: normalizeString(record[`${prefix}.en`] ?? record[`${prefix}_en`]),
      ar: normalizeString(record[`${prefix}.ar`] ?? record[`${prefix}_ar`]),
    }
  }

  return { en: '', ar: '' }
}

/** Unwrap Laravel envelopes: { data }, { data: { attributes } }, or flat { group, ... }. */
export function unwrapSettingsPayload(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object') return {}

  const root = body as Record<string, unknown>

  if (root.data && typeof root.data === 'object') {
    const data = root.data as Record<string, unknown>
    if (data.attributes && typeof data.attributes === 'object') {
      return data.attributes as Record<string, unknown>
    }
    if (data.settings && typeof data.settings === 'object') {
      return data.settings as Record<string, unknown>
    }
    return data
  }

  return root
}

export function normalizeGeneralSettings(raw: Record<string, unknown>): GeneralAppSettings {
  const name = normalizeTranslatable(raw.name, raw, 'name')

  return {
    group: 'general',
    name,
    logo_url: normalizeString(raw.logo_url ?? raw.logo ?? raw.app_logo) || null,
    default_locale: normalizeString(raw.default_locale) || 'en',
  }
}

export function normalizeContactSettings(raw: Record<string, unknown>): ContactAppSettings {
  return {
    group: 'contact',
    phone: normalizeString(raw.phone) || null,
    whatsapp: normalizeString(raw.whatsapp) || null,
    email: normalizeString(raw.email) || null,
    facebook: normalizeString(raw.facebook) || null,
    x: normalizeString(raw.x ?? raw.twitter) || null,
    instagram: normalizeString(raw.instagram) || null,
    telegram: normalizeString(raw.telegram) || null,
    youtube: normalizeString(raw.youtube) || null,
  }
}

export function mapGeneralSettingsToForm(settings?: GeneralAppSettings | null): GeneralSettingsFormData {
  return {
    nameEn: settings?.name?.en ?? '',
    nameAr: settings?.name?.ar ?? '',
    default_locale: settings?.default_locale ?? 'en',
    logo: null,
  }
}

export function mapContactSettingsToForm(settings?: ContactAppSettings | null): ContactSettingsFormData {
  return {
    phone: settings?.phone ?? '',
    whatsapp: settings?.whatsapp ?? '',
    email: settings?.email ?? '',
    facebook: settings?.facebook ?? '',
    x: settings?.x ?? '',
    instagram: settings?.instagram ?? '',
    telegram: settings?.telegram ?? '',
    youtube: settings?.youtube ?? '',
  }
}

async function fetchGeneralSettings(): Promise<GeneralAppSettings> {
  const response = await api.get<SuccessResponse<GeneralAppSettings>>('/app-settings/general')
  return normalizeGeneralSettings(unwrapSettingsPayload(response.data))
}

async function fetchContactSettings(): Promise<ContactAppSettings> {
  const response = await api.get<SuccessResponse<ContactAppSettings>>('/app-settings/contact')
  return normalizeContactSettings(unwrapSettingsPayload(response.data))
}

export async function fetchPublicAppBranding(): Promise<PublicAppBranding> {
  const response = await axios.get(`${getPublicApiBaseUrl()}/settings`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': localStorage.getItem('lang') || 'en',
    },
    timeout: 15_000,
  })

  const raw = unwrapSettingsPayload(response.data)

  return {
    app_name: normalizeString(raw.app_name ?? raw.name) || '',
    app_logo: normalizeString(raw.app_logo ?? raw.logo_url ?? raw.logo) || null,
  }
}

export function useAppSettingsGroup(group: 'general', options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['app-settings', group],
    queryFn: fetchGeneralSettings,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}

export function usePublicAppBranding(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['app-branding-public'],
    queryFn: fetchPublicAppBranding,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}

export function useAppSettingsContact() {
  return useQuery({
    queryKey: ['app-settings', 'contact'],
    queryFn: fetchContactSettings,
  })
}

export function useUpdateAppSettingsGeneral(setError?: UseFormSetError<GeneralSettingsFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: GeneralSettingsFormData) => {
      const formData = createPutFormData({ default_locale: payload.default_locale })
      appendTranslatable(formData, 'name', { en: payload.nameEn, ar: payload.nameAr })
      appendOptionalFile(formData, 'logo', payload.logo)

      const response = await api.post<SuccessResponse<GeneralAppSettings>>('/app-settings/general', formData)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app-settings', 'general'] })
      qc.invalidateQueries({ queryKey: ['app-branding-public'] })
      toast.success(res.message || 'Settings updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update settings.'))
    },
  })
}

export function useUpdateAppSettingsContact(setError?: UseFormSetError<ContactSettingsFormData>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ContactSettingsFormData) => {
      const response = await api.put<SuccessResponse<ContactAppSettings>>('/app-settings/contact', payload)
      return response.data
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['app-settings', 'contact'] })
      toast.success(res.message || 'Contact settings updated successfully.')
    },
    onError: (error) => {
      if (setError && applyValidationErrors(error, setError)) return
      toast.error(getErrorMessage(error, 'Failed to update contact settings.'))
    },
  })
}
