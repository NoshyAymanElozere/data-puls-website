# Auth (Admin)

| Property | Value |
|----------|-------|
| Base path | `/admin/login`, `/admin/me`, `/admin/logout`, `/admin/me/password` |
| Auth | Public for login; Bearer `auth:sanctum` for others |
| Policy / permission | — |
| Frontend hook | `src/features/auth/api/useAuth.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Issue Sanctum token |
| GET | `/me` | Current admin + permissions |
| POST | `/logout` | Revoke current token |
| PATCH | `/me/password` | Change password |

---

## POST /admin/login

**Auth:** none

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| email | string | required, email |
| password | string | required, string |

### Payload example

```json
{ "email": "admin@example.com", "password": "password" }
```

### Responses

**200 — success**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "admin": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@example.com",
      "permissions": [{ "name": "pages.view", "label": "View pages" }]
    },
    "token": "1|…",
    "token_type": "Bearer"
  }
}
```

**422 — invalid credentials / inactive**
```json
{
  "message": "The given data was invalid.",
  "errors": { "email": ["Invalid credentials."] }
}
```

---

## GET /admin/me

**Auth:** Bearer token

### Responses

**200 — success** — returns `AdminResource` with roles and permissions.

**401 — unauthenticated**
```json
{ "message": "Unauthenticated." }
```

---

## POST /admin/logout

**Auth:** Bearer token

### Responses

**200 — success**
```json
{ "success": true, "message": "Logged out successfully." }
```

---

## PATCH /admin/me/password

**Auth:** Bearer token

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| current_password | string | required, string |
| password | string | required, string, min:8, confirmed |
| password_confirmation | string | required with password |

### Responses

**200 — success** | **422 — wrong current password**

---

## Frontend integration

- Store `data.token` after login (e.g. `localStorage.admin_token`)
- Attach `Authorization: Bearer {token}` on all admin requests
- On app load: call `GET /admin/me` to hydrate permissions; on 401 → clear token → redirect `/login`
- Gate routes/screens using `permissions[].name` from `/me`
