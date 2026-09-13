# User Family Members — Admin Guide

API contract: [`docs/api/user-family-members.md`](../../api/user-family-members.md)

Nested under user detail. **Read-only** in admin (members are created from the mobile app by the account owner).

**Base path:** `/admin/users/{userId}/family-members`

**Auth:** `Authorization: Bearer {admin_token}` · `Accept: application/json` · `Accept-Language: ar|en`

---

## Permissions

| Action | Permission | Endpoint(s) |
|--------|------------|-------------|
| List | `users.view` | `GET /admin/users/{userId}/family-members` |

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users/{userId}/family-members` | Family members where `account_owner_id = {userId}` |

Related header counts: `GET /admin/users/{userId}` → `family_members_count` (see [README.md](./README.md)).

Relation labels catalog: [family-relations.md](./family-relations.md).

---

## List — `GET /admin/users/{userId}/family-members`

### Scope

- Returns linked **User** accounts with `account_owner_id = {userId}`.
- Empty `data: []` when the user is not an account owner, or has no members yet.
- No query filters in this release (full list; typically small).

### Request example

```http
GET /admin/users/1/family-members
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: ar
```

### Response — `200 OK`

```json
{
  "success": true,
  "message": "Family members retrieved successfully.",
  "data": [
    {
      "id": 15,
      "name": "Sarah",
      "phone": "0552222222",
      "avatar_url": "https://example.test/images/user-placeholder.png",
      "family_relation_id": 1,
      "family_relation": {
        "id": 1,
        "name": {
          "en": "Wife",
          "ar": "الزوجة"
        }
      },
      "permissions": {
        "view_family_invoices": true,
        "delete_own_invoices": false,
        "delete_family_invoices": false
      },
      "status": "active",
      "created_at": "2026-09-09 10:00:00"
    },
    {
      "id": 16,
      "name": "Mohammed",
      "phone": "0553333333",
      "avatar_url": "https://example.test/images/user-placeholder.png",
      "family_relation_id": 2,
      "family_relation": {
        "id": 2,
        "name": {
          "en": "Son",
          "ar": "الابن"
        }
      },
      "permissions": {
        "view_family_invoices": false,
        "delete_own_invoices": true,
        "delete_family_invoices": false
      },
      "status": "active",
      "created_at": "2026-09-09 11:30:00"
    }
  ]
}
```

### Empty list example

```json
{
  "success": true,
  "message": "Family members retrieved successfully.",
  "data": []
}
```

### Field reference

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Member user id (can deep-link to `/users/{id}`) |
| `name` | string | Display name |
| `phone` | string | Login phone |
| `avatar_url` | string | Never empty — placeholder if no upload |
| `family_relation_id` | integer \| null | FK to family relations |
| `family_relation` | object \| null | `{ id, name: { en, ar } }` |
| `permissions` | object | Always includes all three keys (defaults `false`) |
| `permissions.view_family_invoices` | boolean | Can see other family invoices |
| `permissions.delete_own_invoices` | boolean | Stored for later delete flows |
| `permissions.delete_family_invoices` | boolean | Stored for later delete flows |
| `status` | string | `active` \| `suspended` |
| `created_at` | string | `YYYY-MM-DD HH:MM:SS` |

### Suggested table columns

| Column | Field |
|--------|-------|
| Avatar | `avatar_url` |
| Name | `name` |
| Phone | `phone` |
| Relation | `family_relation.name` (pick `ar`/`en` by UI language) |
| Permissions | three boolean badges |
| Status | `status` badge |
| Joined | `created_at` |
| Actions | Optional: open member’s user profile `/users/{id}` |

### Permissions display (read-only)

| Permission key | Label (EN) | Label (AR suggestion) |
|----------------|------------|------------------------|
| `view_family_invoices` | View Family Members’ Invoices | عرض فواتير أفراد العائلة |
| `delete_own_invoices` | Delete Own Invoices | حذف فواتيره |
| `delete_family_invoices` | Delete Family Members’ Invoices | حذف فواتير أفراد العائلة |

Render as chips/toggles **disabled** (admin cannot change them here).

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

### `404 — user not found`

```json
{
  "success": false,
  "message": "Resource not found."
}
```

---

## Error mapping

| Status | UI area |
|--------|---------|
| `403` | Hide family tab or forbidden state |
| `404` | Back to users list |
| Empty `data` | Empty state: “No family members for this account” |

---

## UI notes

- Prefer tab badge from parent show: `family_members_count` on `GET /admin/users/{id}` — avoid waiting on this list to paint the badge.
- Creating / editing members is **not** available on admin APIs in this release.
- Member `id` is a real user — their own invoices are on `GET /admin/users/{memberId}/invoices`.
- Relation name is always bilingual on this endpoint; do not depend on `Accept-Language` for relation text (unlike family-relations **list**).
