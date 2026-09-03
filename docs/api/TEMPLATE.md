# API Resource Documentation — Format Specification

Use this document when writing per-resource API docs for the Laravel backend. Copy this structure into one file per resource under `docs/api/` (e.g. `docs/api/users.md`, `docs/api/countries.md`).

**Purpose:** Give the frontend (and AI agents) exact route, validation, payload, and response contracts — without Postman bloat.

**Related docs:**
- Global envelopes & checklist: [../laravel-api-integration.md](../laravel-api-integration.md)
- Frontend hook that consumes these endpoints: `dp-dashboard/dpdashboard/src/features/<domain>/api/`

---

## Style rules (required)

| Do | Don't |
|----|-------|
| One file per resource, named after the route segment (`users.md` for `/admin/users`) | One giant collection file for all resources |
| State auth once in the resource header | Repeat `Authorization: Bearer` on every endpoint |
| Use tables + fenced JSON only | Long prose paragraphs or curl examples |
| Minimal realistic JSON (2–3 sample records max) | Exhaustive fake data or every optional field filled |
| Document every status code the frontend handles | Only document 200 responses |
| Laravel validation rule strings in a table | Vague "must be valid" descriptions |
| Match frontend field names exactly (snake_case in JSON) | Different naming than Zod schemas / form fields |

**Target size:** ~80–150 lines per standard CRUD resource (6 endpoints).

---

## Global conventions (state once per file or link to laravel-api-integration.md)

| Item | Value |
|------|-------|
| Base URL | `{VITE_API_URL}` e.g. `https://herz-dashboard.am.prompita.com/admin` |
| Auth | Sanctum Bearer token in `Authorization` header |
| Content-Type | `application/json` (unless noted, e.g. multipart for file uploads) |
| Accept-Language | `en` or `ar` (optional; for translated fields) |

### Response envelopes

**Single resource (show, create, update):**
```json
{ "message": "Optional human message", "data": { } }
```

**Paginated list:**
```json
{
  "data": [],
  "links": [{ "url": "...", "label": "1", "active": true }],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 42,
    "links": []
  }
}
```

**Validation error (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["First error message for this field"]
  }
}
```

**Other errors:**
```json
{ "message": "Human-readable error message" }
```

Frontend maps `errors` keys to form fields via `applyValidationErrors()`. Field names in `errors` **must match** request body keys.

---

## Blank template (copy for each new resource)

Replace `{Resource}`, `{resource}`, `{resources}` placeholders.

```markdown
# {Resource}

| Property | Value |
|----------|-------|
| Base path | `/admin/{resources}` |
| Auth | `auth:sanctum` |
| Policy / permission | e.g. `manage-users` or `—` |
| Frontend hook | `src/features/{resource}/api/use{Resource}.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/{resources}` | Paginated list |
| GET | `/admin/{resources}/{id}` | Show single |
| POST | `/admin/{resources}` | Create |
| PUT | `/admin/{resources}/{id}` | Update |
| DELETE | `/admin/{resources}/{id}` | Delete |
| PATCH | `/admin/{resources}/{id}/toggle-status` | Toggle active (if applicable) |

---

## GET /admin/{resources}

**Auth:** `auth:sanctum`

### Query parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | integer | no | 1 | Page number |
| search | string | no | — | Search filter |
| sort_by | string | no | created_at | Sort column |
| sort_order | string | no | desc | `asc` or `desc` |

### Responses

**200 — success (paginated)**
```json
{ "data": [], "links": [], "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 0 } }
```

**401 — unauthenticated**
```json
{ "message": "Unauthenticated." }
```

---

## GET /admin/{resources}/{id}

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | Resource ID |

### Responses

**200 — success**
```json
{ "data": { "id": 1 } }
```

**404 — not found**
```json
{ "message": "No query results for model [{Resource} {id}]." }
```

---

## POST /admin/{resources}

### Validation rules

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| name | string | required, max:255 | |
| email | string | required, email, unique:{resources},email | |

### Payload examples

**Minimum valid**
```json
{ "name": "Example", "email": "user@example.com" }
```

**Full (with optionals)**
```json
{ "name": "Example", "email": "user@example.com", "role": "staff", "is_active": true }
```

**Invalid (triggers 422)**
```json
{ "name": "", "email": "not-an-email" }
```

### Responses

**201 — created**
```json
{ "message": "{Resource} created successfully.", "data": { "id": 1, "name": "Example" } }
```

**422 — validation error**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

---

## PUT /admin/{resources}/{id}

(Same validation table as POST, but use `unique` ignore rule for current id; optional fields may be omitted.)

---

## DELETE /admin/{resources}/{id}

### Responses

**200 — deleted**
```json
{ "message": "{Resource} deleted successfully." }
```

**404 — not found**
```json
{ "message": "No query results for model [{Resource} {id}]." }
```

---

## Side effects

| Endpoint | Side effect |
|----------|-------------|
| POST /{resources} | — |
| DELETE /{resources}/{id} | — |
```

---

# Worked example: Users

Below is a **complete** resource doc following the format above. Use it as the reference when implementing the Laravel backend and when writing docs for other resources.

---

# Users

| Property | Value |
|----------|-------|
| Base path | `/admin/users` |
| Auth | `auth:sanctum` |
| Policy / permission | `manage-users` (or admin-only) |
| Frontend hook | `src/features/users/api/useUsers.ts` |
| Frontend form schema | `src/features/users/pages/validationSchema.tsx` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | Paginated list with search & sort |
| GET | `/admin/users/{id}` | Show single user |
| POST | `/admin/users` | Create user |
| PUT | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Delete user |
| PATCH | `/admin/users/{id}/toggle-status` | Toggle `is_active` |

## Resource shape (`User`)

| Field | Type | Notes |
|-------|------|-------|
| id | integer | Primary key |
| name | string | |
| email | string | Unique |
| role | string | e.g. `admin`, `manager`, `staff` |
| is_active | boolean | |
| created_at | string (ISO 8601) | |

---

## GET /admin/users

**Auth:** `auth:sanctum` + `manage-users`

### Query parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| page | integer | no | 1 | Page number |
| search | string | no | — | Matches `name` or `email` |
| sort_by | string | no | `created_at` | Allowed: `name`, `email`, `role`, `created_at` |
| sort_order | string | no | `desc` | `asc` or `desc` |

### Responses

**200 — success**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2026-01-15T10:00:00.000000Z"
    }
  ],
  "links": [
    { "url": null, "label": "&laquo; Previous", "active": false },
    { "url": "https://herz-dashboard.am.prompita.com/admin/users?page=1", "label": "1", "active": true },
    { "url": null, "label": "Next &raquo;", "active": false }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "links": [],
    "path": "https://herz-dashboard.am.prompita.com/admin/users",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
```

**401 — unauthenticated**
```json
{ "message": "Unauthenticated." }
```

**403 — forbidden**
```json
{ "message": "This action is unauthorized." }
```

---

## GET /admin/users/{id}

**Auth:** `auth:sanctum` + `manage-users`

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | User ID |

### Responses

**200 — success**
```json
{
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-01-15T10:00:00.000000Z"
  }
}
```

**404 — not found**
```json
{ "message": "No query results for model [App\\Models\\User 999]." }
```

---

## POST /admin/users

**Auth:** `auth:sanctum` + `manage-users`

### Validation rules

| Field | Type | Rules | Frontend Zod equivalent |
|-------|------|-------|-------------------------|
| name | string | required, string, max:255 | `z.string().min(1)` |
| email | string | required, email, max:255, unique:users,email | `z.string().email()` |
| password | string | required, string, min:8 | required on create only |
| role | string | required, string, in:admin,manager,staff | `z.string().min(1)` |
| is_active | boolean | required, boolean | `z.boolean()` |

### Payload examples

**Minimum valid**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "staff",
  "is_active": true
}
```

**Invalid — empty name**
```json
{
  "name": "",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "staff",
  "is_active": true
}
```

**Invalid — bad email**
```json
{
  "name": "Jane Doe",
  "email": "not-an-email",
  "password": "secret123",
  "role": "staff",
  "is_active": true
}
```

**Invalid — password too short**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "short",
  "role": "staff",
  "is_active": true
}
```

**Invalid — duplicate email**
```json
{
  "name": "Jane Doe",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "staff",
  "is_active": true
}
```

### Responses

**201 — created**
```json
{
  "message": "User created successfully.",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "staff",
    "is_active": true,
    "created_at": "2026-08-31T09:00:00.000000Z"
  }
}
```

**422 — validation error (multiple fields)**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email field must be a valid email address."],
    "password": ["The password field must be at least 8 characters."]
  }
}
```

**422 — duplicate email**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## PUT /admin/users/{id}

**Auth:** `auth:sanctum` + `manage-users`

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | User ID |

### Validation rules

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| name | string | sometimes, required, string, max:255 | |
| email | string | sometimes, required, email, max:255, unique:users,email,{id} | |
| password | string | nullable, string, min:8 | Omit or empty = keep current password |
| role | string | sometimes, required, in:admin,manager,staff | |
| is_active | boolean | sometimes, required, boolean | |

### Payload examples

**Update name and role only**
```json
{
  "name": "Jane Smith",
  "role": "manager"
}
```

**Update with new password**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "newpassword123",
  "role": "manager",
  "is_active": true
}
```

**Invalid — email taken by another user**
```json
{
  "email": "admin@example.com"
}
```

### Responses

**200 — updated**
```json
{
  "message": "User updated successfully.",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "manager",
    "is_active": true,
    "created_at": "2026-08-31T09:00:00.000000Z"
  }
}
```

**404 — not found**
```json
{ "message": "No query results for model [App\\Models\\User 999]." }
```

**422 — validation error**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## DELETE /admin/users/{id}

**Auth:** `auth:sanctum` + `manage-users`

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | User ID |

### Responses

**200 — deleted**
```json
{ "message": "User deleted successfully." }
```

**403 — cannot delete self**
```json
{ "message": "You cannot delete your own account." }
```

**404 — not found**
```json
{ "message": "No query results for model [App\\Models\\User 999]." }
```

---

## PATCH /admin/users/{id}/toggle-status

**Auth:** `auth:sanctum` + `manage-users`

Toggles `is_active` boolean. No request body.

### Path parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | yes | User ID |

### Responses

**200 — toggled**
```json
{
  "message": "User status updated.",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "staff",
    "is_active": false,
    "created_at": "2026-08-31T09:00:00.000000Z"
  }
}
```

**403 — cannot deactivate self**
```json
{ "message": "You cannot deactivate your own account." }
```

**404 — not found**
```json
{ "message": "No query results for model [App\\Models\\User 999]." }
```

---

## Side effects

| Endpoint | Side effect |
|----------|-------------|
| POST /users | Hashes password before storage; optional welcome notification |
| PUT /users/{id} | Re-hashes password only when `password` is present in body |
| DELETE /users/{id} | Revokes user's Sanctum tokens |
| PATCH /users/{id}/toggle-status | None |

---

## Laravel implementation checklist (per resource)

- [ ] Form Request class with rules matching validation table above
- [ ] API Resource (`UserResource`) returning exact field names/types
- [ ] Controller returns `UserResource::collection()` for index (paginated)
- [ ] 422 responses use Laravel default `{ message, errors }` shape
- [ ] Route registered in `routes/api.php` under `auth:sanctum` middleware
- [ ] Policy registered if using permissions

---

## File naming for other resources

| Resource | Doc file | Laravel route prefix |
|----------|----------|----------------------|
| Users | `docs/api/users.md` | `/admin/users` |
| Countries | `docs/api/countries.md` | `/admin/countries` |
| Cities | `docs/api/cities.md` | `/admin/cities` |
| Settings | `docs/api/settings.md` | `/admin/settings` |
| Notifications | `docs/api/notifications.md` | `/admin/notifications` |
| Auth | `docs/api/auth.md` | `/admin/login`, `/admin/user`, `/admin/logout` |

Copy the blank template section for each new resource, then fill in validation tables and all response scenarios the frontend handles.
