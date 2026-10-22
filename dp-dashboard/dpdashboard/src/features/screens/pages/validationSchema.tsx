import { z } from 'zod'
import type { ScreenDetail, ScreenThemeValues } from '../api/useScreens'
import { HEX_COLOR_REGEX, THEME_COLOR_FIELDS, THEME_MODES } from '../constants'

/** '' means "not overridden / inherit from global". */
const colorSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || HEX_COLOR_REGEX.test(v), 'invalidHexColor')

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
  // Not editable in the dashboard: the stored values are sent back unchanged.
  font_family: z.string(),
  font_scale: z.string(),
})

export type ThemeModeFormValues = z.infer<typeof themeModeSchema>

export const screenSchema = z
  .object({
    is_global: z.boolean(),
    theme: z.object({ light: themeModeSchema, dark: themeModeSchema }),
    screenshot: z.any().nullable().optional(),
  })
  .superRefine((values, ctx) => {
    // The global row must define every color.
    if (values.is_global) {
      for (const mode of THEME_MODES) {
        for (const field of THEME_COLOR_FIELDS) {
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
  })

export type ScreenFormValues = z.infer<typeof screenSchema>

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
    theme: {
      light: toModeFormValues(screen?.theme?.light),
      dark: toModeFormValues(screen?.theme?.dark),
    },
    screenshot: null,
  }
}
