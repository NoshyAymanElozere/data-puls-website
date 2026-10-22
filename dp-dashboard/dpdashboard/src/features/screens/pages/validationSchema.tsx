import { z } from 'zod'
import type { Translatable } from '@/shared/types/laravel'
import type { ScreenDetail, ScreenThemeValues } from '../api/useScreens'
import {
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  HEX_COLOR_REGEX,
  TEXT_KEY_REGEX,
  THEME_COLOR_FIELDS,
  THEME_EDITABLE_FIELDS,
  THEME_MODES,
} from '../constants'

/** '' means "not overridden / inherit from global". */
const colorSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || HEX_COLOR_REGEX.test(v), 'invalidHexColor')

const fontScaleSchema = z
  .string()
  .trim()
  .refine((v) => {
    if (v === '') return true
    const n = Number(v)
    return Number.isFinite(n) && n >= FONT_SCALE_MIN && n <= FONT_SCALE_MAX
  }, 'screenFontScaleRange')

const themeModeSchema = z.object({
  primary_color: colorSchema,
  secondary_color: colorSchema,
  background_color: colorSchema,
  card_color: colorSchema,
  border_color: colorSchema,
  text_primary_color: colorSchema,
  text_secondary_color: colorSchema,
  icon_color: colorSchema,
  button_color: colorSchema,
  button_text_color: colorSchema,
  font_family: z.string().trim().max(100, 'maxLength'),
  font_scale: fontScaleSchema,
})

export type ThemeModeFormValues = z.infer<typeof themeModeSchema>

const textRowSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, 'requiredField')
    .max(100, 'maxLength')
    .regex(TEXT_KEY_REGEX, 'screenTextKeyFormat'),
  en: z.string().max(1000, 'maxLength'),
  ar: z.string().max(1000, 'maxLength'),
})

export const screenSchema = z
  .object({
    is_global: z.boolean(),
    nameEn: z.string().trim().min(1, 'requiredField').max(150, 'maxLength'),
    nameAr: z.string().trim().min(1, 'requiredField').max(150, 'maxLength'),
    descriptionEn: z.string().max(1000, 'maxLength'),
    descriptionAr: z.string().max(1000, 'maxLength'),
    theme: z.object({ light: themeModeSchema, dark: themeModeSchema }),
    texts: z.array(textRowSchema),
    background_image_light: z.any().nullable().optional(),
    background_image_dark: z.any().nullable().optional(),
    screenshot: z.any().nullable().optional(),
    remove_background_image_light: z.boolean(),
    remove_background_image_dark: z.boolean(),
  })
  .superRefine((values, ctx) => {
    // The global row must define every color + font_family + font_scale.
    if (values.is_global) {
      for (const mode of THEME_MODES) {
        for (const field of THEME_EDITABLE_FIELDS) {
          if (!values.theme[mode][field]?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['theme', mode, field],
              message: 'requiredField',
            })
          }
        }
      }
    }

    // Text keys must be distinct.
    const seen = new Map<string, number>()
    values.texts.forEach((row, index) => {
      const key = row.key.trim()
      if (!key) return
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['texts', index, 'key'],
          message: 'screenTextKeyDuplicate',
        })
      } else {
        seen.set(key, index)
      }
    })
  })

export type ScreenFormValues = z.infer<typeof screenSchema>

function resolveLocale(value: string | Translatable | null | undefined, lang: 'en' | 'ar'): string {
  if (!value) return ''
  if (typeof value === 'string') return lang === 'en' ? value : ''
  return value[lang] || ''
}

function toModeFormValues(values: ScreenThemeValues | [] | null | undefined): ThemeModeFormValues {
  const source = normalizeThemeMode(values)
  const result = {} as ThemeModeFormValues
  for (const field of THEME_COLOR_FIELDS) {
    result[field] = (source[field] ?? '').toString().toUpperCase()
  }
  result.font_family = (source.font_family ?? '').toString()
  result.font_scale =
    source.font_scale === null || source.font_scale === undefined || source.font_scale === ''
      ? ''
      : String(source.font_scale)
  return result
}

/** PHP may serialise an empty mode as `[]`; normalise to an object. */
export function normalizeThemeMode(value: ScreenThemeValues | [] | null | undefined): ScreenThemeValues {
  if (!value || Array.isArray(value)) return {}
  return value
}

export function getInitialValues(screen?: ScreenDetail | null): ScreenFormValues {
  return {
    is_global: screen?.type === 'global',
    nameEn: resolveLocale(screen?.name, 'en'),
    nameAr: resolveLocale(screen?.name, 'ar'),
    descriptionEn: resolveLocale(screen?.description, 'en'),
    descriptionAr: resolveLocale(screen?.description, 'ar'),
    theme: {
      light: toModeFormValues(screen?.theme?.light),
      dark: toModeFormValues(screen?.theme?.dark),
    },
    texts: (screen?.texts ?? []).map((row) => ({
      key: row.key ?? '',
      en: row.en ?? '',
      ar: row.ar ?? '',
    })),
    background_image_light: null,
    background_image_dark: null,
    screenshot: null,
    remove_background_image_light: false,
    remove_background_image_dark: false,
  }
}
