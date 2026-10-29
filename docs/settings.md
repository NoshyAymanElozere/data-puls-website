# Settings Module

Generic admin settings — no travel-domain pages.

## Structure

```
src/features/settings/
├── api/           useAppSettings, useSettings (legacy footer), lookups
└── pages/
    ├── Settings.tsx
    ├── globalsettings/       → /app-settings/general + /contact + /company
    ├── countries|cities/
    ├── contact-subjects/     → features/contact (route under /settings)
    ├── support/              → /contact-messages inbox
    ├── privacypolicy|termsconditions|aboutus/  → /pages + /page-sections
    └── footer/               → legacy GET/PUT /settings
```

## Global settings

API: `GET/PUT /app-settings/general` (name en/ar, logo, default_locale) and `GET/PUT /app-settings/contact` (phone, email, social links).

Hooks: `useAppSettings.ts`

### Company information (`company` group)

Card **Company Information / بيانات المؤسسة** at the bottom of `/settings/globalsettings` (`globalsettings/CompanySettingsCard.tsx`). These legal details are shown at the bottom of "My Account" in the mobile app.

| Field | Label (EN / AR) | Rules |
|-------|-----------------|-------|
| `name.en`, `name.ar` | Establishment Name / اسم المؤسسة | optional, nullable, max 255 each |
| `commercial_registration_number` | Commercial Registration Number / رقم السجل التجاري | optional, nullable, max 255 |
| `vat_number` | VAT Number / الرقم الضريبي | optional, nullable, max 255 |

- API: `GET /app-settings/company` (`app_settings.view`) and `PUT /app-settings/company` (`app_settings.update`). The card sends JSON `{ name: { en, ar }, commercial_registration_number, vat_number }`, the same generic group mechanism as `contact`.
- Hooks: `useAppSettingsCompany()`, `useUpdateAppSettingsCompany(setError)`, `mapCompanySettingsToForm()`.
- Without `app_settings.update`, the inputs are read-only and the Save button is hidden. Empty inputs are saved as `null`. 422 keys `name.en` / `name.ar` map to the `nameEn` / `nameAr` inputs.

## CMS pages

Hooks: `features/pages/api/usePages.ts`, `usePageSections.ts`

Shared UI: `CmsPageEditor` + `PageSectionsPanel`

Keys: `privacy_policy`, `terms_and_conditions`, `about_us` (seed on backend)

### Page section full content

The page-section create/edit modal (`PageSectionFormModal.tsx`) has a **Full Content / المحتوى الكامل** block with one `RichTextEditor` per language, below the description editors.

- Optional. The mobile app opens it when the user taps the section (for example, the full list of terms). `description` remains the short summary shown in the list.
- Payload: `content[en]`, `content[ar]` (HTML, max 200000 characters each, nullable) on `POST /page-sections` and `PUT /page-sections/{id}` (multipart with `_method=PUT`). Empty editors send `""`, which the backend stores as `null`.
- `GET /page-sections/{id}` returns `content: { en, ar } | null`, and the edit modal prefills from it (`sectionToFormValues`). The list returns the current-locale string.
- 422 keys `title.*`, `description.*` and `content.*` map to the matching form fields (`SECTION_FIELD_MAP` in `usePageSections.ts`).

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
