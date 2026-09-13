# User Detail Extensions — Admin Frontend (2026-09-09)

Nested data for the admin **user detail** screen: invoices tab, family members tab, and family-relation labels.

API contracts:

- [User invoices API](../../api/user-invoices.md)
- [User family members API](../../api/user-family-members.md)
- [Family relations API](../../api/family-relations.md)
- [Users API](../../api/users.md) (show counts)

**Admin API base:** `{APP_URL}/admin` (e.g. `http://localhost:8000/admin`)

---

## Auth

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer {admin_token}` |
| `Accept` | `application/json` |
| `Accept-Language` | `ar` \| `en` |

All routes below require permission **`users.view`**. Missing permission → `403 Forbidden`. Hide tabs/actions in UI; backend still enforces.

---

## Route map

| Admin path | HTTP | Screen / use | Permission | Guide |
|------------|------|--------------|------------|-------|
| `/users/{id}` | GET | User detail header + tab badges | `users.view` | this file |
| `/users/{id}/invoices` | GET | Invoices tab (table) | `users.view` | [user-invoices.md](./user-invoices.md) |
| `/users/{id}/invoices/{invoiceId}` | GET | Invoice detail drawer/modal | `users.view` | [user-invoices.md](./user-invoices.md) |
| `/users/{id}/family-members` | GET | Family members tab | `users.view` | [user-family-members.md](./user-family-members.md) |
| `/family-relations` | GET | Relation labels / lookup | `users.view` | [family-relations.md](./family-relations.md) |
| `/family-relations/{id}` | GET | Single relation (full translations) | `users.view` | [family-relations.md](./family-relations.md) |

These endpoints are **read-only** in admin. Creating invoices / family members is mobile-only.

---

## User detail header — `GET /admin/users/{id}`

Load this first. Use new counts for tab badges; load full lists from nested endpoints.

### Response fields (new)

| Field | Type | Notes |
|-------|------|-------|
| `invoices_count` | integer | Invoices where this user is the **creator** |
| `family_members_count` | integer | Users with `account_owner_id = this user` (0 if user is a member, not owner) |

### Request example

```http
GET /admin/users/1
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: ar
```

### Response example — `200 OK` (relevant excerpt)

```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Ahmed",
    "avatar_url": "https://example.test/images/user-placeholder.png",
    "email": "demo.one@example.test",
    "phone": "0551234567",
    "status": "active",
    "status_label": "Active",
    "is_subscribed": true,
    "invoices_count": 12,
    "family_members_count": 3,
    "active_subscription": { },
    "subscriptions": []
  }
}
```

### UI wiring

| UI element | Source |
|------------|--------|
| Invoices tab badge | `data.invoices_count` |
| Family tab badge | `data.family_members_count` |
| Hide Family tab content note | If count is `0` and user is not an owner, show empty state (“No family members”) |

---

## Standard envelopes

**Success (single / collection):**

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

**Success (paginated):**

```json
{
  "success": true,
  "message": "...",
  "data": [],
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

**Errors:**

| Status | When | UI |
|--------|------|-----|
| `401` | Missing/invalid token | Redirect to login |
| `403` | No `users.view` | Hide module / forbidden page |
| `404` | User or nested resource not found | Toast + back to users list |
| `422` | Invalid query params | Map `errors` to filter fields |

---

## Module guides

| Guide | Contents |
|-------|----------|
| [user-invoices.md](./user-invoices.md) | List + show invoices with full payloads/responses |
| [user-family-members.md](./user-family-members.md) | Family members list + permission badges |
| [family-relations.md](./family-relations.md) | Relations catalog list + show |

## Edge cases

- Family member users (linked accounts) still have `invoices_count` for invoices **they** created; `family_members_count` is usually `0`.
- Invoice detail URL must use the **same** `{userId}` as the invoice creator; wrong pairing → `404`.
- `Accept-Language` affects localized strings on family-relations **list** (`name` as string). Show returns `{ en, ar }`.
