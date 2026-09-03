# Cities

| Property | Value |
|----------|-------|
| Admin base URL | `{VITE_ADMIN_URL}` e.g. `https://localhost:8000/admin` |
| Base path | `/cities` |
| Auth | `auth:sanctum` |
| Policy / permission | `cities.view`, `cities.create`, `cities.update`, `cities.delete` |
| Frontend hook | `src/features/cities/api/useCities.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cities` | Paginated list with search & filters |
| GET | `/cities/{id}` | Show single (full translations) |
| POST | `/cities` | Create |
| PUT/PATCH | `/cities/{id}` | Update |
| PATCH | `/cities/{id}/status` | Toggle `is_active` |
| DELETE | `/cities/{id}` | Delete |

## Resource shape (`City`)

| Field | Type | Notes |
|-------|------|-------|
| id | integer | Primary key |
| name | string or `{en,ar}` | Locale string on list/update; `{en,ar}` on show |
| country_id | integer | FK to countries |
| country | object | Nested when loaded |
| is_active | boolean | |
| created_at | string (ISO 8601) | |
| updated_at | string (ISO 8601) | |

---

## GET /cities

**Auth:** `cities.view`

### Query parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | integer | no | 1 | Page number |
| per_page | integer | no | 15 | Max 100 |
| search | string | no | — | Matches name en/ar |
| country_id | integer | no | — | Filter by country |
| is_active | boolean | no | — | `true` \| `false` |

### Responses

**200 — success (paginated)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Riyadh",
      "country_id": 1,
      "country": {
        "id": 1,
        "name": "Saudi Arabia",
        "iso_code": "SA"
      },
      "is_active": true,
      "created_at": "2026-08-31T10:00:00.000000Z",
      "updated_at": "2026-08-31T10:00:00.000000Z"
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 3 }
}
```

**401 — unauthenticated** | **403 — forbidden**

---

## GET /cities/{id}

**Auth:** `cities.view`

### Responses

**200 — success**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": { "en": "Riyadh", "ar": "الرياض" },
    "country_id": 1,
    "country": {
      "id": 1,
      "name": { "en": "Saudi Arabia", "ar": "المملكة العربية السعودية" },
      "iso_code": "SA"
    },
    "is_active": true,
    "created_at": "2026-08-31T10:00:00.000000Z",
    "updated_at": "2026-08-31T10:00:00.000000Z"
  }
}
```

**404 — not found**

---

## POST /cities

**Auth:** `cities.create`

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| name.en | string | required, max:150 |
| name.ar | string | required, max:150 |
| country_id | integer | required, exists:countries,id |
| is_active | boolean | optional |

### Payload (form-data)

```
name[en]=Riyadh
name[ar]=الرياض
country_id=1
is_active=true
```

**201 — created** | **422 — validation**

---

## PUT /cities/{id}

**Auth:** `cities.update`

Same fields as POST but optional (`sometimes`). Use form-data + `_method=PUT`.

**200 — updated** | **404 — not found** | **422 — validation**

---

## PATCH /cities/{id}/status

**Auth:** `cities.update`

No request body. Toggles `is_active`.

**200 — toggled** | **403 — forbidden**

---

## DELETE /cities/{id}

**Auth:** `cities.delete`

**204 — deleted** | **404 — not found**

---

## Seeded cities

| Country (iso) | Cities (EN) |
|---------------|-------------|
| SA | Riyadh, Jeddah, Dammam |
| AE | Dubai, Abu Dhabi |
| EG | Cairo, Alexandria |

---

## Flutter public API

**Base URL:** `{VITE_API_URL}` e.g. `https://localhost:8000/api`

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/cities?country_id={id}` | Public (`optional.sanctum`) |

Returns **active cities** for the given country. Set `Accept-Language: en|ar` for localized `name`.

### Query parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| country_id | integer | yes | Must exist in `countries` table |

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Riyadh", "country_id": 1 }
  ]
}
```

**422 — missing or invalid country_id**
```json
{
  "message": "The given data was invalid.",
  "errors": { "country_id": ["The country id field is required."] }
}
```
