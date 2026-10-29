# Herz Partners & Partner Sectors

Two admin modules: **Herz Partners** (`شركاء حرز`), the partner businesses shown in the mobile app, and **Partner Sectors** (`قطاعات الشركاء`), which group them.

## Route map

| Path | Component | Sidebar label | Shown when |
|------|-----------|---------------|------------|
| `/partners` | `features/partners/pages/PartnersPage.tsx` | Herz Partners / شركاء حرز | `partners.view` |
| `/partner-sectors` | `features/partner-sectors/pages/PartnerSectorsPage.tsx` | Partner Sectors / قطاعات الشركاء | `partner_sectors.view` |

Both items sit in the main sidebar right after **Categories** (`Sidebar.tsx` `navItems`, filtered by `permission`). Page titles are in `Header.tsx` `routeTitles`. Opening a route without its `.view` permission renders `NoPermissionCard`.

## Files

```
src/features/partner-sectors/
├── api/usePartnerSectors.ts      list / options / show / create / update / status / delete hooks
└── pages/
    ├── PartnerSectorsPage.tsx
    ├── PartnerSectorsFormModal.tsx   create / edit / view
    ├── ColumnDefs.tsx
    └── validationSchema.tsx
src/features/partners/
├── api/usePartners.ts
├── components/PartnerFormSelectField.tsx   native select (sector, city) that keeps an inactive saved value
└── pages/
    ├── PartnersPage.tsx
    ├── PartnersFormModal.tsx         create / edit / view
    ├── ColumnDefs.tsx
    └── validationSchema.tsx
```

## Permissions

| Permission | Effect in the dashboard |
|------------|-------------------------|
| `partner_sectors.view` | Sidebar item + Partner Sectors page; sector filter/select options on the partners page |
| `partner_sectors.create` | "Add" button on Partner Sectors |
| `partner_sectors.update` | Edit button + status toggle on sector rows |
| `partner_sectors.delete` | Delete button on sector rows |
| `partners.view` | Sidebar item + Herz Partners page, view (eye) action |
| `partners.create` | "Add" button on Herz Partners |
| `partners.update` | Edit button + status toggle on partner rows |
| `partners.delete` | Delete button on partner rows |

The backend enforces the same keys. The dashboard has no frontend permission-label map; labels come from the backend (`GET /admin/permissions`).

## API

Admin base path `/admin`. List, store and update return translatable fields as current-locale strings (`Accept-Language`). `show` returns `{ en, ar }`.

### Partner sectors

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/partner-sectors?search=&is_active=&page=&per_page=` | list (`usePartnerSectorsList`), options (`usePartnerSectorOptions`, `per_page=100`) |
| `GET` | `/partner-sectors/{id}` | edit / view modal (`usePartnerSector`) |
| `POST` | `/partner-sectors` | JSON `{ name: { en, ar }, is_active, sort_order }` |
| `PUT` | `/partner-sectors/{id}` | same JSON body |
| `PATCH` | `/partner-sectors/{id}/status` | row toggle (no body, so the backend flips it) |
| `DELETE` | `/partner-sectors/{id}` | 204, or 422 `errors.partner_sector` while the sector still has partners |

### Partners

| Method | Path | Used by |
|--------|------|---------|
| `GET` | `/partners?search=&partner_sector_id=&city_id=&is_active=&page=&per_page=` | list (`usePartnersList`) |
| `GET` | `/partners/{id}` | edit / view modal (`usePartner`) |
| `POST` | `/partners` | multipart create |
| `POST` | `/partners/{id}` with `_method=PUT` first | multipart update |
| `PATCH` | `/partners/{id}/status` | row toggle |
| `DELETE` | `/partners/{id}` | 204 |

Multipart fields: `partner_sector_id`, `city_id`, `name[en|ar]`, `description[en|ar]`, `address[en|ar]`, `map_url`, `logo` (file, optional), `is_active` (`1|0`), `sort_order`, and on update `remove_logo=1` when the admin ticks "Remove current logo" without uploading a new file.

## List behaviour

**Partner Sectors:** the columns are name, partners count, sort order, status toggle and actions (view, edit, delete). Filters are search and status (`all | active | inactive`).

**Herz Partners:** the columns are logo thumbnail, name, sector, city, sort order, status toggle and actions (view, edit, delete). Filters are search, sector (every sector), city (active cities from `/cities?is_active=true&per_page=100`) and status. Changing a filter resets the page to 1.

Status toggles call `PATCH …/status` and refresh the list and the cached detail.

## Create / edit / view

- **Create:** the modal opens with empty values (status active, sort order 0).
- **Edit / view:** the modal loads the record from the **show endpoint** and resets the form only after it arrives, so both `en` and `ar` are filled. List rows carry only the current locale.
- **View:** uses the same modal with every field disabled and no Save button. For partners it also shows an "Open in maps" link and the created/updated timestamps. For sectors it shows the partners count and the created date.
- **Partner form:** sector and city are native selects, which avoids dropdowns being clipped inside the modal. Only active sectors and cities are listed. When the saved sector or city is inactive, it is still added as an option.
- **Logo:** optional, at most 2 MB (checked client-side before upload). The preview comes from `ImageUpload`. Ticking "Remove current logo" sends `remove_logo=1`. A newly uploaded logo replaces the old one without the flag.
- **Validation:** client-side Zod mirrors the backend limits: sector name 150 characters; partner name 200, description 1000, address 500; map URL must be a valid URL. Backend 422 keys such as `name.en` are mapped to form fields (`nameEn`) through `applyValidationErrors(error, setError, fieldMap)`.

## Edge cases

- **Deleting a sector that still has partners:** the backend returns 422 with `errors.partner_sector`. The global axios interceptor shows the backend message as a toast. The hook skips its own error toast to avoid a duplicate, and the confirm dialog closes. The sector stays in the list. The delete confirmation text warns about this rule up front.
- Creating, updating or deleting a partner also invalidates `partner-sectors-list`, so `partners_count` stays current.
- Updating a sector also invalidates `partners-list`, because rows show the sector name.
- Empty optional translatable fields (`description`, `address`) and an empty `map_url` are sent as empty strings, which Laravel turns into `null`. Clearing them in the edit form removes the stored value.
