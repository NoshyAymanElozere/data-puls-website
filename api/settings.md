# Settings (App Settings)

| Property | Value |
|----------|-------|
| Base path | `/app-settings/{group}` |
| Auth | `auth:sanctum` |
| Policy / permission | `app_settings.view`, `app_settings.update` |
| Frontend hook | `src/features/settings/api/useSettings.ts` |

## Groups

| Group | Admin path | Fields |
|-------|------------|--------|
| general | `/app-settings/general` | `name` (en/ar), `logo` (file), `default_locale` |
| contact | `/app-settings/contact` | phone, whatsapp, email, facebook, x, instagram, telegram, youtube |

---

## GET /app-settings/{group}

**Auth:** `app_settings.view`

**200 — general**
```json
{
  "success": true,
  "data": {
    "group": "general",
    "name": { "en": "Herz", "ar": "حرز" },
    "logo_url": "https://…/logo.png",
    "default_locale": "en"
  }
}
```

**200 — contact**
```json
{
  "data": {
    "group": "contact",
    "phone": "+966…",
    "email": "support@herz.com"
  }
}
```

**404 — unknown group**

---

## PUT /app-settings/general

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| name.en / name.ar | string | optional, required when sent, max:255 |
| default_locale | string | optional, max:255 |
| logo | file | optional, image, max:2048 |

Use form-data + `_method=PUT`. Logo field key is `logo` (not logo_url).

---

## PUT /app-settings/contact

| Field | Type | Rules |
|-------|------|-------|
| phone, whatsapp, facebook, x, instagram, telegram, youtube | string | optional, nullable, max:255 |
| email | string | optional, nullable, email, max:255 |

---

## Flutter public API (separate)

`GET /api/settings` returns flattened payload — see Postman **Settings (API)** folder:

```json
{
  "app_name": "Herz",
  "app_logo": "https://…",
  "contact_info": { "phone": "…", "email": "…" }
}
```

`app_name` respects `Accept-Language: en|ar`.
