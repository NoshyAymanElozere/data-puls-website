# Backend Gaps Specification: User Invoices, Family Members & Relations

**Date:** 2026-09-10  
**Target:** Backend Development Team  
**Scope:** Enhancements and missing endpoints/keys for Admin Frontend User Details, Family Tree, Invoices, and Family Relations management.

---

## 1. Parent Account Data on User Profile (`GET /admin/users/{id}`)

### Problem / Gap
When an admin opens the profile of a user who is a **family member** linked to an account owner (i.e. child account), the frontend needs to immediately display the **Parent Account Owner** banner with deep-linking to the owner's account.

Currently, `GET /admin/users/{id}` returns `invoices_count` and `family_members_count` (which is 0 for member accounts), but omits the parent account owner object and the member's relation.

### Required Backend Additions in `GET /admin/users/{id}` Response

```json
{
  "success": true,
  "message": "User retrieved successfully.",
  "data": {
    "id": 16,
    "name": "Mohammed",
    "email": "mohammed@example.test",
    "phone": "0553333333",
    "status": "active",
    "status_label": "Active",
    "is_subscribed": false,
    "invoices_count": 4,
    "family_members_count": 0,

    "account_owner_id": 1,
    "account_owner": {
      "id": 1,
      "name": "Ahmed",
      "email": "ahmed@example.test",
      "phone": "0551234567",
      "avatar_url": "https://example.test/storage/avatars/1.jpg"
    },
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
    }
  }
}
```

#### Required Keys:
- `account_owner_id`: integer | null
- `account_owner`: object | null (`id`, `name`, `email`, `phone`, `avatar_url`)
- `family_relation_id`: integer | null
- `family_relation`: object | null (`id`, `name: { en, ar }`)
- `permissions`: object | null (`view_family_invoices`, `delete_own_invoices`, `delete_family_invoices`)

---

## 2. Admin Family Member Management & Control Endpoints

### Problem / Gap
The 2026-09-09 release notes state that family member endpoints are **Read-Only** in admin. However, admin operators must be able to control permissions, unlink members, or adjust family relationships on behalf of users.

### Required Endpoints

| Method | Route | Description | Permission |
|--------|-------|-------------|------------|
| `PATCH` | `/admin/users/{ownerId}/family-members/{memberId}/permissions` | Update member permissions | `users.update` |
| `PATCH` | `/admin/users/{ownerId}/family-members/{memberId}/relation` | Update member family relation | `users.update` |
| `DELETE` | `/admin/users/{ownerId}/family-members/{memberId}` | Unlink/remove family member from owner | `users.update` |
| `POST` | `/admin/users/{ownerId}/family-members` | Link an existing user or add new member | `users.create` |

### Request / Response Examples

#### 2.1 Update Member Permissions: `PATCH /admin/users/{ownerId}/family-members/{memberId}/permissions`
**Request:**
```json
{
  "view_family_invoices": true,
  "delete_own_invoices": true,
  "delete_family_invoices": false
}
```
**Response: `200 OK`**
```json
{
  "success": true,
  "message": "Family member permissions updated successfully.",
  "data": {
    "id": 16,
    "permissions": {
      "view_family_invoices": true,
      "delete_own_invoices": true,
      "delete_family_invoices": false
    }
  }
}
```

#### 2.2 Unlink Member: `DELETE /admin/users/{ownerId}/family-members/{memberId}`
**Response: `200 OK` / `204 No Content`**
```json
{
  "success": true,
  "message": "Family member unlinked successfully."
}
```

---

## 3. Aggregate / Family-Wide Invoices Querying

### Problem / Gap
Currently, `GET /admin/users/{userId}/invoices` returns **only** invoices where `user_id = {userId}` (the creator).
When reviewing an account owner, the admin should be able to view all invoices belonging to the whole family in one consolidated view.

### Recommended Solution
Support an optional query parameter on `GET /admin/users/{userId}/invoices`:
- `include_family=true` (boolean)

Alternatively, provide a dedicated route:
- `GET /admin/users/{userId}/family-invoices`

### Example Request
```http
GET /admin/users/1/invoices?include_family=true&page=1&per_page=15
```

Each invoice item in the response already includes the `creator` object with name & avatar, allowing the UI to clearly distinguish who created each invoice.

---

## 4. Admin Invoice Moderation / Deletion

### Problem / Gap
Invoices currently only support `GET` (list and show). Admins need to be able to delete corrupt, fraudulent, or requested-for-deletion invoices.

### Required Endpoint
- `DELETE /admin/users/{userId}/invoices/{invoiceId}`
- **Permission:** `users.delete` (or `invoices.delete`)
- **Response:** `200 OK` or `204 No Content`

---

## 5. Family Relations Catalog CRUD Endpoints

### Problem / Gap
The `/admin/family-relations` module is currently read-only. Admins cannot add custom relations (e.g. Grandfather, Cousin) or modify sort order / active status.

### Required Endpoints

| Method | Route | Description | Permission |
|--------|-------|-------------|------------|
| `POST` | `/admin/family-relations` | Create family relation | `users.create` |
| `PUT` | `/admin/family-relations/{id}` | Update names (`en`, `ar`), `sort_order` | `users.update` |
| `PATCH` | `/admin/family-relations/{id}/status` | Toggle `is_active` (`true`/`false`) | `users.update` |
| `DELETE` | `/admin/family-relations/{id}` | Delete relation (if not in use) | `users.delete` |

### Example Request: `POST /admin/family-relations`
```json
{
  "name": {
    "en": "Grandfather",
    "ar": "الجد"
  },
  "sort_order": 9,
  "is_active": true
}
```

---

## Summary Checklist for Backend

1. [ ] Include `account_owner_id`, `account_owner`, `family_relation_id`, `family_relation`, and `permissions` in `GET /admin/users/{id}` for child accounts.
2. [ ] Add `include_family=true` filter to `GET /admin/users/{userId}/invoices`.
3. [ ] Add admin family member permission and unlink endpoints (`PATCH` and `DELETE`).
4. [ ] Add admin invoice delete endpoint (`DELETE /admin/users/{userId}/invoices/{invoiceId}`).
5. [ ] Add CRUD endpoints for `/admin/family-relations` (`POST`, `PUT`, `PATCH /status`, `DELETE`).
