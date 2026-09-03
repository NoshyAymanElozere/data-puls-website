# Settings Module

Generic admin settings — no travel-domain pages.

## Structure

```
src/features/settings/
├── api/           useAppSettings, useSettings (legacy footer), lookups
└── pages/
    ├── Settings.tsx
    ├── globalsettings/       → /app-settings/general + /contact
    ├── countries|cities/
    ├── contact-subjects/     → features/contact (route under /settings)
    ├── support/              → /contact-messages inbox
    ├── privacypolicy|termsconditions|aboutus/  → /pages + /page-sections
    └── footer/               → legacy GET/PUT /settings
```

## Global settings

API: `GET/PUT /app-settings/general` (name en/ar, logo, default_locale) and `GET/PUT /app-settings/contact` (phone, email, social links).

Hooks: `useAppSettings.ts`

## CMS pages

Hooks: `features/pages/api/usePages.ts`, `usePageSections.ts`

Shared UI: `CmsPageEditor` + `PageSectionsPanel`

Keys: `privacy_policy`, `terms_and_conditions`, `about_us` (seed on backend)

## Contact

- Subjects CRUD: `/settings/contact-subjects`
- Inbox: `/settings/support` → `/contact-messages`

## Lookups (countries, cities)

### Countries & cities

Documented in [`api/countries.md`](../api/countries.md) and [`api/cities.md`](../api/cities.md).

Hooks: `useCountries.ts`, `useCities.ts`

- Form payloads use FormData with `name[en]`, `name[ar]` (countries also: `iso_code`, `currency_code`, `phone_code`)
- Status toggle: `PATCH /{id}/status` (not `toggle-status`)
- List filters: `search`, `is_active`; cities also `country_id`
- Edit modals fetch `GET /countries/{id}` or `GET /cities/{id}` for bilingual name prefill

## Navigation

Settings sub-routes in `SidebarLinks.ts`. Main sidebar → `/settings/globalsettings`.
