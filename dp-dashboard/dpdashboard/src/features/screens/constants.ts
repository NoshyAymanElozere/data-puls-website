export const SCREEN_TYPES = ['global', 'screen', 'sheet', 'component'] as const
export type ScreenType = (typeof SCREEN_TYPES)[number]

export const SCREEN_GROUPS = [
  'startup',
  'auth',
  'main',
  'invoices',
  'scanner',
  'family',
  'account',
  'subscription',
  'support',
] as const
export type ScreenGroup = (typeof SCREEN_GROUPS)[number]

export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const THEME_COLOR_FIELDS = [
  'primary_color',
  'secondary_color',
  'background_color',
  'card_color',
  'border_color',
  'text_primary_color',
  'text_secondary_color',
  'icon_color',
  'button_color',
  'button_text_color',
] as const

/** Colors only the bottom bar screen has. Empty = global button / primary / card color. Home button is a start→end gradient. */
export const BOTTOM_NAV_SCREEN_KEY = 'bottom_navigation'
export const BOTTOM_NAV_COLOR_FIELDS = ['home_icon_background_color', 'home_icon_background_end_color', 'nav_background_color'] as const
export type BottomNavColorField = (typeof BOTTOM_NAV_COLOR_FIELDS)[number]

export type ThemeColorField = (typeof THEME_COLOR_FIELDS)[number] | BottomNavColorField

/** Color fields of a screen, its own ones first. */
export function colorFieldsFor(screenKey?: string | null): readonly ThemeColorField[] {
  return screenKey === BOTTOM_NAV_SCREEN_KEY ? [...BOTTOM_NAV_COLOR_FIELDS, ...THEME_COLOR_FIELDS] : THEME_COLOR_FIELDS
}

/**
 * The non-image theme fields sent as `theme[mode][field]`. Only the colors are editable in the
 * dashboard; the font fields are sent back unchanged so the backend keeps their stored values.
 * The bottom bar fields are ignored by the backend on other screens.
 */
export const THEME_EDITABLE_FIELDS = [
  ...THEME_COLOR_FIELDS,
  ...BOTTOM_NAV_COLOR_FIELDS,
  'font_family',
  'font_scale',
] as const
export type ThemeEditableField = (typeof THEME_EDITABLE_FIELDS)[number]

/** i18n label key per theme field */
export const THEME_FIELD_LABEL_KEYS: Record<ThemeColorField, string> = {
  primary_color: 'screenFieldPrimaryColor',
  secondary_color: 'screenFieldSecondaryColor',
  background_color: 'screenFieldBackgroundColor',
  card_color: 'screenFieldCardColor',
  border_color: 'screenFieldBorderColor',
  text_primary_color: 'screenFieldTextPrimaryColor',
  text_secondary_color: 'screenFieldTextSecondaryColor',
  icon_color: 'screenFieldIconColor',
  button_color: 'screenFieldButtonColor',
  button_text_color: 'screenFieldButtonTextColor',
  home_icon_background_color: 'screenFieldHomeIconBackgroundColor',
  home_icon_background_end_color: 'screenFieldHomeIconBackgroundEndColor',
  nav_background_color: 'screenFieldNavBackgroundColor',
}

export const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/

export const SCREENS_PERMISSIONS = {
  view: 'screens.view',
  update: 'screens.update',
} as const
