import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { UseFormSetError } from 'react-hook-form'
import api, { getErrorMessage, getValidationErrors } from '@/shared/services/axios'
import i18n from '@/shared/i18n/i18n'
import type { LaravelPaginatedResponse, SuccessResponse, Translatable } from '@/shared/types/laravel'
import { appendOptionalFile, appendTranslatable, createPutFormData } from '@/shared/utils/form-data'
import { buildQueryParams } from '@/shared/utils/query-params'
import type { ScreenFormValues } from '../pages/validationSchema'
import {
  THEME_EDITABLE_FIELDS,
  THEME_MODES,
  type ScreenGroup,
  type ScreenType,
} from '../constants'

export interface ScreenThemeValues {
  primary_color?: string | null
  secondary_color?: string | null
  background_color?: string | null
  card_color?: string | null
  border_color?: string | null
  text_primary_color?: string | null
  text_secondary_color?: string | null
  icon_color?: string | null
  button_color?: string | null
  button_text_color?: string | null
  font_family?: string | null
  font_scale?: number | string | null
  background_image?: string | null
}

export interface ScreenTheme {
  light: ScreenThemeValues
  dark: ScreenThemeValues
}

export interface ScreenText {
  key: string
  en: string
  ar: string
}

export interface ScreenListItem {
  id: number
  key: string
  type: ScreenType
  type_label: string
  group: ScreenGroup | null
  group_label: string | null
  name: string
  description: string | null
  screenshot_url: string | null
  has_custom_theme: boolean
  custom_fields_count: number
  texts_count: number
  updated_at?: string
}

export interface ScreenDetail {
  id: number
  key: string
  type: ScreenType
  type_label: string
  group: ScreenGroup | null
  group_label: string | null
  name: string | Translatable
  description: string | Translatable | null
  flutter_file: string | null
  screenshot_url: string | null
  /** PHP may serialise an empty mode as [] instead of {} */
  theme: { light: ScreenThemeValues | []; dark: ScreenThemeValues | [] } | null
  global_theme: { light: ScreenThemeValues | []; dark: ScreenThemeValues | [] } | null
  texts: ScreenText[]
  updated_at?: string
}

export interface ScreensListFilters {
  page: number
  search: string
  type: string
  group: string
  perPage?: number
}

function buildScreenFormData(payload: ScreenFormValues): FormData {
  const formData = createPutFormData({})

  appendTranslatable(formData, 'name', { en: payload.nameEn, ar: payload.nameAr })
  appendTranslatable(formData, 'description', {
    en: payload.descriptionEn ?? '',
    ar: payload.descriptionAr ?? '',
  })

  // Each mode is sent in full: the backend replaces the overrides, '' means "inherit from global".
  for (const mode of THEME_MODES) {
    for (const field of THEME_EDITABLE_FIELDS) {
      const raw = payload.theme[mode][field]
      formData.append(`theme[${mode}][${field}]`, raw == null ? '' : String(raw).trim())
    }
  }

  const texts = payload.texts ?? []
  if (texts.length === 0) {
    formData.append('texts', '')
  } else {
    texts.forEach((row, index) => {
      formData.append(`texts[${index}][key]`, row.key.trim())
      formData.append(`texts[${index}][en]`, row.en ?? '')
      formData.append(`texts[${index}][ar]`, row.ar ?? '')
    })
  }

  appendOptionalFile(formData, 'background_image_light', payload.background_image_light)
  appendOptionalFile(formData, 'background_image_dark', payload.background_image_dark)
  appendOptionalFile(formData, 'screenshot', payload.screenshot)

  if (payload.remove_background_image_light && !payload.background_image_light) {
    formData.append('remove_background_image_light', '1')
  }
  if (payload.remove_background_image_dark && !payload.background_image_dark) {
    formData.append('remove_background_image_dark', '1')
  }

  return formData
}

/** Map backend 422 keys (`name.en`, `theme.light.primary_color`, `texts.0.key`) to form field paths. */
const SERVER_FIELD_MAP: Record<string, string> = {
  'name.en': 'nameEn',
  'name.ar': 'nameAr',
  'description.en': 'descriptionEn',
  'description.ar': 'descriptionAr',
  name: 'nameEn',
  description: 'descriptionEn',
}

function applyScreenValidationErrors(
  error: unknown,
  setError: UseFormSetError<ScreenFormValues>
): boolean {
  const errors = getValidationErrors(error)
  if (!errors) return false

  Object.entries(errors).forEach(([field, messages]) => {
    const path = SERVER_FIELD_MAP[field] ?? field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError(path as any, { type: 'server', message: messages[0] })
  })

  return true
}

export function useScreensList({ page, search, type, group, perPage = 24 }: ScreensListFilters) {
  return useQuery({
    queryKey: ['screens-list', page, search, type, group, perPage],
    queryFn: async () => {
      const params = buildQueryParams({ page, search, type, group, per_page: perPage })
      const response = await api.get<LaravelPaginatedResponse<ScreenListItem>>(`/screens?${params}`)
      return response.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useScreen(id: number | null) {
  return useQuery({
    queryKey: ['screen', id],
    queryFn: async () => {
      const response = await api.get<SuccessResponse<ScreenDetail>>(`/screens/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useUpdateScreen(setError?: UseFormSetError<ScreenFormValues>) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ScreenFormValues }) => {
      const response = await api.post<SuccessResponse<ScreenDetail>>(
        `/screens/${id}`,
        buildScreenFormData(payload),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['screens-list'] })
      // The response uses current-locale strings, so refetch the full {en, ar} detail.
      // Prefix match also refreshes other screens, whose inherited values change when the global row is edited.
      qc.invalidateQueries({ queryKey: ['screen'] })
      toast.success(i18n.t('screenUpdated'))
    },
    onError: (error) => {
      if (setError && applyScreenValidationErrors(error, setError)) {
        toast.error(getErrorMessage(error, i18n.t('screensFixErrors')))
        return
      }
      toast.error(getErrorMessage(error, i18n.t('screenUpdateFailed')))
    },
  })
}
