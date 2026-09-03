# Countries

| Property | Value |
|----------|-------|
| Admin base URL | `{VITE_ADMIN_URL}` e.g. `https://localhost:8000/admin` |
| Base path | `/countries` |
| Auth | `auth:sanctum` |
| Policy / permission | `countries.view`, `countries.create`, `countries.update`, `countries.delete` |
| Frontend hook | `src/features/countries/api/useCountries.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/countries` | Paginated list with search & filters |
| GET | `/countries/{id}` | Show single (full translations + cities) |
| POST | `/countries` | Create |
| PUT/PATCH | `/countries/{id}` | Update |
| PATCH | `/countries/{id}/status` | Toggle `is_active` |
| DELETE | `/countries/{id}` | Delete |

## Resource shape (`Country`)

| Field | Type | Notes |
|-------|------|-------|
| id | integer | Primary key |
| name | string or `{en,ar}` | Locale string on list/update; `{en,ar}` on show |
| iso_code | string | Unique, max 3 chars |
| currency_code | string | e.g. `SAR` |
| phone_code | string | e.g. `+966` |
| is_active | boolean | |
| cities | array | Nested on show only |
| created_at | string (ISO 8601) | |
| updated_at | string (ISO 8601) | |

---

## GET /countries

**Auth:** `countries.view`

### Query parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | integer | no | 1 | Page number |
| per_page | integer | no | 15 | Max 100 |
| search | string | no | — | Matches iso_code, currency_code, phone_code, name en/ar |
| is_active | boolean | no | — | `true` \| `false` |

### Responses

**200 — success (paginated)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Saudi Arabia",
      "iso_code": "SA",
      "currency_code": "SAR",
      "phone_code": "+966",
      "is_active": true,
      "created_at": "2026-08-31T10:00:00.000000Z",
      "updated_at": "2026-08-31T10:00:00.000000Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 7 }
}
```

**401 — unauthenticated** | **403 — forbidden**

---

## GET /countries/{id}

**Auth:** `countries.view`

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | Country ID |

### Responses

**200 — success**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": { "en": "Saudi Arabia", "ar": "المملكة العربية السعودية" },
    "iso_code": "SA",
    "currency_code": "SAR",
    "phone_code": "+966",
    "is_active": true,
    "cities": [
      { "id": 1, "name": { "en": "Riyadh", "ar": "الرياض" }, "country_id": 1, "is_active": true }
    ],
    "created_at": "2026-08-31T10:00:00.000000Z",
    "updated_at": "2026-08-31T10:00:00.000000Z"
  }
}
```

**404 — not found**

---

## POST /countries

**Auth:** `countries.create`

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| name.en | string | required, max:150 |
| name.ar | string | required, max:150 |
| iso_code | string | required, max:3, unique:countries,iso_code |
| currency_code | string | required, max:3 |
| phone_code | string | required, max:10 |
| is_active | boolean | optional |

### Payload (form-data)

```
name[en]=Saudi Arabia
name[ar]=المملكة العربية السعودية
iso_code=SA
currency_code=SAR
phone_code=+966
is_active=true
```

**201 — created** | **422 — validation**

---

## PUT /countries/{id}

**Auth:** `countries.update`

Same fields as POST but optional (`sometimes`). Use form-data + `_method=PUT`.

**200 — updated** | **404 — not found** | **422 — validation**

---

## PATCH /countries/{id}/status

**Auth:** `countries.update`

No request body. Toggles `is_active`.

**200 — toggled** | **403 — forbidden**

---

## DELETE /countries/{id}

**Auth:** `countries.delete`

**204 — deleted**

**422 — has cities**
```json
{
  "message": "The given data was invalid.",
  "errors": { "country": ["Cannot delete country that has cities."] }
}
```

---

## Seeded countries

| iso_code | name (EN) |
|----------|-------------|
| SA | Saudi Arabia |
| AE | United Arab Emirates |
| KW | Kuwait |
| QA | Qatar |
| BH | Bahrain |
| OM | Oman |
| EG | Egypt |

---

## Flutter public API

**Base URL:** `{VITE_API_URL}` e.g. `https://localhost:8000/api`

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/countries` | Public (`optional.sanctum`) |

Returns **active countries only**. Set `Accept-Language: en|ar` for localized `name`.

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Saudi Arabia", "iso_code": "SA", "phone_code": "+966" }
  ]
}
```

Note: Flutter response does **not** include `currency_code` or `is_active`.
