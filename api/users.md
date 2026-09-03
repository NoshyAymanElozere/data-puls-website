# Admin API — Users

Frontend integration guide for the admin users CRUD module.

**Base path:** `/admin/users`

**Auth:** `Authorization: Bearer {admin_token}` · `Accept: application/json`

---

## Permissions

| Action | Permission | Endpoint(s) |
|--------|------------|-------------|
| List / show | `users.view` | `GET /admin/users`, `GET /admin/users/{id}` |
| Create | `users.create` | `POST /admin/users` |
| Update | `users.update` | `PUT /admin/users/{id}`, `PATCH /admin/users/{id}/status` |
| Delete | `users.delete` | `DELETE /admin/users/{id}` |

Missing permission → `403 Forbidden`.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/users` | Paginated list with filters |
| `POST` | `/admin/users` | Create user |
| `GET` | `/admin/users/{id}` | User detail |
| `PUT` | `/admin/users/{id}` | Update user |
| `PATCH` | `/admin/users/{id}/status` | Update status only |
| `DELETE` | `/admin/users/{id}` | Soft-delete user |

---

## List — `GET /admin/users`

### Query parameters

| Param | Type | Required | Allowed values / notes |
|-------|------|----------|------------------------|
| `search` | string | No | Matches `email` or `phone` (partial) |
| `status` | string | No | `active` · `suspended` |
| `gender` | string | No | `male` · `female` |
| `registered_from` | date | No | `YYYY-MM-DD` — filters `created_at >= date` |
| `registered_to` | date | No | `YYYY-MM-DD` — filters `created_at <= date` |
| `per_page` | integer | No | Default `15`, max `100` |
| `page` | integer | No | Pagination page |

### Response — `200 OK`

Uses standard paginated envelope (`data`, `meta`, `links`).

Each item uses the **index** shape (compact):

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | |
| `email` | string | |
| `phone` | string | |
| `gender` | string \| null | `male` · `female` |
| `age` | integer \| null | Computed from `birth_date` |
| `status` | string | `active` · `suspended` |
| `created_at` | string | Formatted datetime |

**Note:** Index items do **not** include `gender_label`, `status_label`, or `avatar_url`. Use raw enum values for badges/filters.

### Example

```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": [
    {
      "id": 1,
      "email": "demo.one@example.test",
      "phone": "0551234567",
      "gender": "female",
      "age": 28,
      "status": "active",
      "created_at": "2026-09-01 10:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 1,
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

### Frontend

- Table columns: email, phone, gender, age, status, registered date (`created_at`).
- Wire filters to query params; combine `registered_from` / `registered_to` for date-range picker.
- Map `status` to badge colors: `active`, `suspended`.

---

## Show — `GET /admin/users/{id}`

### Response — `200 OK`

Full user profile via `UserResource`:

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | |
| `avatar_url` | string | Never `null` — placeholder when no avatar uploaded |
| `email` | string | |
| `phone` | string | |
| `birth_date` | string \| null | `YYYY-MM-DD` |
| `age` | integer \| null | Computed from `birth_date` |
| `gender` | string \| null | `male` · `female` |
| `gender_label` | string \| null | Localized label |
| `preferred_language` | string \| null | `ar` · `en` |
| `status` | string | `active` · `suspended` |
| `status_label` | string | Localized label |
| `registration_completed_at` | string \| null | Formatted datetime |
| `phone_verified_at` | string \| null | Formatted datetime |
| `last_login_at` | string \| null | Formatted datetime |
| `created_at` | string | Formatted datetime |
| `updated_at` | string | Formatted datetime |

### Example

```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": {
    "id": 1,
    "avatar_url": "https://example.test/images/user-placeholder.png",
    "email": "demo.one@example.test",
    "phone": "0551234567",
    "birth_date": "1998-01-15",
    "age": 28,
    "gender": "female",
    "gender_label": "Female",
    "preferred_language": "en",
    "status": "active",
    "status_label": "Active",
    "registration_completed_at": "2026-09-01 10:00:00",
    "phone_verified_at": "2026-09-01 10:00:00",
    "last_login_at": null,
    "created_at": "2026-09-01 10:00:00",
    "updated_at": "2026-09-01 10:00:00"
  }
}
```

### Frontend

- Detail page: show all fields above; use `status_label` / `gender_label` for display text.
- Avatar from `avatar_url` (always present).

---

## Create — `POST /admin/users`

**Permission:** `users.create`

**Content-Type:** `application/json`

### Request body

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | Valid email, max 150, unique |
| `phone` | string | Yes | Max 20, unique |
| `password` | string | Yes | Min 8 characters |
| `password_confirmation` | string | Yes | Must match `password` |
| `birth_date` | date | No | Must be before today |
| `gender` | string | No | `male` · `female` |
| `preferred_language` | string | No | `ar` · `en` |
| `status` | string | No | `active` · `suspended` (defaults to `active` if omitted) |

### Response — `201 Created`

Returns full `UserResource` shape (same as show, with labels).

On create, the backend automatically sets:

- `registration_completed_at` → now
- `phone_verified_at` → now

### Example request

```json
{
  "email": "new.user@example.com",
  "phone": "0599887766",
  "password": "password123",
  "password_confirmation": "password123",
  "gender": "male",
  "preferred_language": "en",
  "status": "active"
}
```

### Validation errors — `422`

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

### Frontend

- Create form: email, phone, password + confirmation, optional birth date, gender, language, status.
- No avatar upload on create (not supported by this endpoint).
- Redirect to detail/list on `201`.

---

## Update — `PUT /admin/users/{id}`

**Permission:** `users.update`

**Content-Type:** `application/json`

### Request body

All fields optional (`sometimes`). Same rules as create, except:

| Field | Notes |
|-------|-------|
| `email` | Unique except current user |
| `phone` | Unique except current user |
| `password` | Optional; min 8 + `password_confirmation` when provided |

### Response — `200 OK`

Returns full `UserResource` shape.

### Example request

```json
{
  "email": "updated.user@example.com",
  "preferred_language": "ar"
}
```

### Frontend

- Edit form pre-filled from show endpoint.
- Send only changed fields or full payload (both valid).

---

## Status toggle — `PATCH /admin/users/{id}/status`

**Permission:** `users.update`

Dedicated status endpoint (does not flip automatically — send explicit value).

### Request body

| Field | Type | Required | Allowed values |
|-------|------|----------|----------------|
| `status` | string | Yes | `active` · `suspended` |

### Example request

```json
{
  "status": "suspended"
}
```

### Response — `200 OK`

Returns full `UserResource` with updated `status` and `status_label`.

### Frontend

- Suspend / activate actions call this endpoint with the target status.
- Update list row badge after success.

---

## Delete — `DELETE /admin/users/{id}`

**Permission:** `users.delete`

### Response — `204 No Content`

Empty body. User is **soft-deleted** (recoverable in DB, hidden from normal queries).

### Frontend

- Confirm before delete.
- Remove row from list or redirect after `204`.

---

## Error responses

| Status | When |
|--------|------|
| `401` | Missing or invalid admin token |
| `403` | Admin lacks required permission |
| `404` | User not found |
| `422` | Validation failed (create / update / status) |

Standard error shape:

```json
{
  "success": false,
  "message": "Forbidden."
}
```

Validation errors include an `errors` object keyed by field name.

---

## Enum reference

### `status`

| Value | Label (EN example) |
|-------|---------------------|
| `active` | Active |
| `suspended` | Suspended |

### `gender`

| Value | Label (EN example) |
|-------|---------------------|
| `male` | Male |
| `female` | Female |

Labels are localized via `Accept-Language` on labeled fields (`status_label`, `gender_label`).

---

## Demo data

After `php artisan db:seed`, demo users from `UserSeeder`:

| Email | Phone | Status |
|-------|-------|--------|
| `demo.one@example.test` | `0551234567` | active |
| `demo.two@example.test` | `0557654321` | active |

Password for seeded users: `password`

Additional subscriber demo users are seeded by `UserSubscriptionSeeder` (see subscription-packages subscriber update doc).
