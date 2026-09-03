# Internationalization

## Setup

- Config: `src/shared/i18n/i18n.ts`
- Locales: `locales/en.ts`, `locales/ar.ts`
- Loaded in `main.tsx`

## Usage

```tsx
const { t, i18n } = useTranslation()
const isRtl = i18n.language === 'ar'

<h1>{t('dashboard')}</h1>
<div dir={isRtl ? 'rtl' : 'ltr'}>...</div>
```

## Language switcher

Header Globe dropdown sets `i18n.changeLanguage('en'|'ar')` and `localStorage.lang`.

Axios sends `Accept-Language` header on every request.

## Adding keys

Always add to **both** `en.ts` and `ar.ts` with the same key.

Use camelCase keys: `globalSettings`, `contactEmail`, `markAllRead`.

## AG Grid

`GenericDataGrid` sets `enableRtl={isRtl}` automatically.

Column visibility label is bilingual in the grid toolbar.
