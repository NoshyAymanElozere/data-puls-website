# Pages

| Property | Value |
|----------|-------|
| Base path | `/pages` |
| Auth | `auth:sanctum` |
| Policy / permission | `pages.view`, `pages.create`, `pages.update`, `pages.delete` |
| Frontend hook | `src/features/pages/api/usePages.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/pages` | List all pages (non-paginated) |
| GET | `/pages/{id}` | Show single (full translations) |
| POST | `/pages` | Create |
| PUT/PATCH | `/pages/{id}` | Update |
| DELETE | `/pages/{id}` | Delete |

---

## GET /pages

**Auth:** `pages.view`

### Responses

**200 — success**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "privacy_policy",
      "title": "Privacy Policy",
      "description": "…",
      "sort_order": 1,
      "sections": [],
      "created_at": "2026-08-31T10:00:00.000000Z"
    }
  ]
}
```

List/index returns current-locale strings for translatable fields. Show uses `{ en, ar }`.

---

## GET /pages/{id}

**Auth:** `pages.view`

**200 — show** — translatable fields as `{ "en": "…", "ar": "…" }`, includes nested `sections`.

---

## POST /pages

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| key | string | required, max:100, unique:pages,key, regex: `^[a-z0-9_]+$` |
| title.en / title.ar | string | required, max:200 |
| description.en / description.ar | string | required, max:5000 |
| sort_order | integer | optional, min:0 |

### Payload (form-data)

```
key=privacy_policy
title[en]=Privacy Policy
title[ar]=سياسة الخصوصية
description[en]=…
description[ar]=…
sort_order=1
```

**201 — created** | **422 — validation**

---

## PUT /pages/{id}

Same fields as POST but optional (`sometimes`). Use form-data + `_method=PUT`.

---

## DELETE /pages/{id}

**Auth:** `pages.delete`

**204 — deleted** (cascades to page sections)

---

## Seeded keys

- `privacy_policy`
- `terms_and_conditions`
