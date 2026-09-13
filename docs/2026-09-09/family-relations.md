# Family Relations — Admin Guide

API contract: [`docs/api/family-relations.md`](../../api/family-relations.md)

Read-only catalog of relation labels (wife, son, daughter, …) used when displaying family members.

**Base path:** `/admin/family-relations`

**Auth:** `Authorization: Bearer {admin_token}` · `Accept: application/json` · `Accept-Language: ar|en`

---

## Permissions

| Action | Permission | Endpoint(s) |
|--------|------------|-------------|
| List | `users.view` | `GET /admin/family-relations` |
| Show | `users.view` | `GET /admin/family-relations/{id}` |

No create / update / delete / status routes in this release.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/family-relations` | Paginated catalog |
| GET | `/admin/family-relations/{id}` | Single relation with full `{ en, ar }` name |

---

## List — `GET /admin/family-relations`

### Query parameters

| Param | Type | Required | Default | Rules / notes |
|-------|------|----------|---------|---------------|
| `search` | string | No | — | Matches `name.en` or `name.ar` (partial) |
| `is_active` | boolean | No | — | `true` / `false` / `1` / `0` |
| `page` | integer | No | `1` | min 1 |
| `per_page` | integer | No | `15` | min 1, max 100 |

### Request example

```http
GET /admin/family-relations?search=son&is_active=true&page=1&per_page=15
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: ar
```

### Response — `200 OK` (paginated)

On **list**, `name` is a **localized string** based on `Accept-Language` (not `{ en, ar }`).

```json
{
  "success": true,
  "message": "Family relations retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "الزوجة",
      "is_active": true,
      "sort_order": 1,
      "created_at": "2026-09-09 10:00:00",
      "updated_at": "2026-09-09 10:00:00"
    },
    {
      "id": 2,
      "name": "الابن",
      "is_active": true,
      "sort_order": 2,
      "created_at": "2026-09-09 10:00:00",
      "updated_at": "2026-09-09 10:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 8,
    "last_page": 1
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": null
  }
}
```

With `Accept-Language: en`, the same rows return `"name": "Wife"`, `"name": "Son"`, etc.

### List field reference

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Use as value in dropdowns |
| `name` | string | Current locale only on list |
| `is_active` | boolean | Badge / filter |
| `sort_order` | integer | Default table sort matches API (`sort_order`, then `id`) |
| `created_at` | string | |
| `updated_at` | string | |

### Suggested table / lookup UI

| Column | Field |
|--------|-------|
| ID | `id` |
| Name | `name` |
| Active | `is_active` |
| Sort | `sort_order` |

**Usage on user detail:** optional preload for relation dropdowns; family-members list already embeds `family_relation.name` as `{ en, ar }`, so this catalog is mainly for a dedicated Relations screen or filters.

### Seeded relations (reference)

| sort_order | EN | AR |
|------------|----|----|
| 1 | Wife | الزوجة |
| 2 | Son | الابن |
| 3 | Daughter | الابنة |
| 4 | Father | الأب |
| 5 | Mother | الأم |
| 6 | Brother | الأخ |
| 7 | Sister | الأخت |
| 8 | Other | أخرى |

---

## Show — `GET /admin/family-relations/{id}`

Use for detail drawer or any form that needs both languages.

### Request example

```http
GET /admin/family-relations/2
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: en
```

### Response — `200 OK`

On **show**, `name` is always `{ en, ar }` (full translations), regardless of `Accept-Language`.

```json
{
  "success": true,
  "message": "Family relations retrieved successfully.",
  "data": {
    "id": 2,
    "name": {
      "en": "Son",
      "ar": "الابن"
    },
    "is_active": true,
    "sort_order": 2,
    "created_at": "2026-09-09 10:00:00",
    "updated_at": "2026-09-09 10:00:00"
  }
}
```

### Show field reference

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | |
| `name` | object | `{ "en": string, "ar": string }` |
| `is_active` | boolean | |
| `sort_order` | integer | |
| `created_at` | string | |
| `updated_at` | string | |

---

## Error responses

### `401 — unauthenticated`

```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### `403 — forbidden`

```json
{
  "success": false,
  "message": "This action is unauthorized."
}
```

### `404 — relation not found`

```json
{
  "success": false,
  "message": "Resource not found."
}
```

### `422 — invalid query`

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "is_active": ["The is active field must be true or false."],
    "per_page": ["The per page field must not be greater than 100."]
  }
}
```

---

## Validation / error mapping

| Error key / status | UI area |
|--------------------|---------|
| `403` | Hide module |
| `404` | Toast + back to list |
| `errors.search` | Search input |
| `errors.is_active` | Active filter toggle |
| `errors.per_page` | Page size |
| `errors.page` | Pagination |

---

## Notes

- List vs show name shape differs: **list = string**, **show = `{ en, ar }`**. Do not bind a bilingual form from the list response.
- Ordering is `sort_order` ascending — keep admin tables consistent with that.
- Catalog is seeded; admin CRUD for relations is out of scope for this release.
