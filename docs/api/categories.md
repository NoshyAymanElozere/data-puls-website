# Categories & User Custom Categories (API)

| Property | Value |
|----------|-------|
| Catalog Base URL | `{BASE_URL}/api` e.g. `https://api.herz.sa/api` |
| Catalog Lookups Auth | Public / Optional (`optional.sanctum`, `locale`) |
| User Categories Auth | Authenticated User (`auth:sanctum`, `user`, `locale`) |
| Postman Collection | `Herz.postman_collection.json` → `Categories (API)` |

---

## Overview

Herz supports both system default categories and user-defined custom categories:
- **System Default Categories (`is_default = true`)**: Created and managed by system administrators.
- **User Custom Categories (`is_default = false`)**: Created by authenticated users.
  - Visible to the creator and all members of their family account (`resolveAccountOwner`).
  - Automatically merged into invoice category selection dropdowns (`GET /categories` and `GET /subcategories`).
  - **Creator-Only Control**: Only the exact user who created a category can update or delete it. Attempts by other family members return `403 Forbidden`.
  - **Subcategory Restriction**: Subcategories can **only** be added under Miscellaneous Expenses (**النثريات**, `category_id = 1`). Attempting to add subcategories under any other category returns `422 Unprocessable Entity`.
  - **Invoice Safeguard**: Cannot delete a category that has linked invoices (`422 Unprocessable Entity`).

---

## Endpoint Index

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/categories` | Optional | Active top-level categories (merged with family custom categories when logged in) |
| `GET` | `/subcategories?category_id={id}` | Optional | Active subcategories (merged with family custom subcategories when logged in) |
| `GET` | `/user-categories` | User | User categories overview screen with invoice counts, total counters, and creator badge |
| `GET` | `/user-categories/subcategories` | User | Subcategories of Miscellaneous (`category_id = 1`) with invoice counts & control flags |
| `POST` | `/user-categories` | User | Create custom top-level category or custom subcategory under Miscellaneous |
| `POST` | `/user-categories/{id}` | User | Update custom category (`_method: PUT/PATCH` via form-data, creator only) |
| `DELETE` | `/user-categories/{id}` | User | Delete custom category (creator only, rejects if invoices exist) |

---

## 1. User Categories Overview

### `GET /user-categories`
Returns top-level categories visible to the authenticated user and their family, including active invoice count per category and top-level summary metrics.

**Headers**
```http
Authorization: Bearer {token}
Accept: application/json
Accept-Language: ar | en
```

**200 OK Response**
```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": {
    "total_categories": 7,
    "total_subcategories": 13,
    "categories": [
      {
        "id": 1,
        "name": "Miscellaneous Expenses",
        "description": "Daily general and sundry expenses, food, groceries, transport, utilities, and services.",
        "icon_url": "https://api.herz.sa/storage/1/placeholder-icon.png",
        "is_default": true,
        "invoices_count": 14,
        "can_manage": false,
        "created_by": null,
        "parent_id": null,
        "allows_subcategories": true,
        "slug": "nathriat"
      },
      {
        "id": 2,
        "name": "Electronics",
        "description": "Phones, computers, audio equipment, cameras, and consumer electronics with warranties.",
        "icon_url": "https://api.herz.sa/storage/2/placeholder-icon.png",
        "is_default": true,
        "invoices_count": 5,
        "can_manage": false,
        "created_by": null,
        "parent_id": null,
        "allows_subcategories": false,
        "slug": "electronics"
      },
      {
        "id": 25,
        "name": "Home Renovation",
        "description": "Custom category for home fixes",
        "icon_url": "https://api.herz.sa/storage/25/reno.png",
        "is_default": false,
        "invoices_count": 2,
        "can_manage": true,
        "created_by": "Me",
        "parent_id": null,
        "allows_subcategories": false,
        "slug": "home-renovation-4-x8f2q1"
      }
    ]
  },
  "meta": {
    "total_categories": 7,
    "total_subcategories": 13
  }
}
```

---

## 2. Miscellaneous Subcategories Overview

### `GET /user-categories/subcategories`
Returns all active subcategories under Miscellaneous (**النثريات**, `category_id = 1`) visible to the user and family account, with invoice counts.

**200 OK Response**
```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [
    {
      "id": 7,
      "name": "Food & Dining",
      "description": "Cafes, fast food, casual dining, and bakery purchases.",
      "icon_url": "https://api.herz.sa/storage/7/placeholder-icon.png",
      "is_default": true,
      "invoices_count": 8,
      "can_manage": false,
      "created_by": null,
      "parent_id": 1,
      "allows_subcategories": false,
      "slug": "food-dining"
    },
    {
      "id": 26,
      "name": "Coffee & Cafes",
      "description": "Specialty coffee subscriptions & daily beans",
      "icon_url": "https://api.herz.sa/storage/26/coffee.png",
      "is_default": false,
      "invoices_count": 1,
      "can_manage": true,
      "created_by": "Me",
      "parent_id": 1,
      "allows_subcategories": false,
      "slug": "coffee-cafes-4-m9a1z7"
    }
  ]
}
```

---

## 3. Create Custom Category

### `POST /user-categories`
Create a custom category. Subcategories may **only** specify `parent_id = 1` (Miscellaneous). Top-level categories omit `parent_id` (or pass null).

**Content-Type:** `multipart/form-data`

**Form Fields**
| Field | Type | Required | Rules | Description |
|-------|------|----------|-------|-------------|
| `name` | string | **Yes** | `required, string, max:255` | Category title |
| `description` | string | No | `nullable, string, max:1000` | Optional notes/description |
| `parent_id` | integer | No | `nullable, in:1` | Pass `1` for Miscellaneous subcategory; omit for top-level |
| `icon` | file | **Yes** | `required, image, max:2048` | Image icon (jpg, png, webp, etc.) |

**201 Created Response**
```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": 27,
    "name": "Gardening & Plants",
    "description": "Backyard plants and nursery supplies",
    "icon_url": "https://api.herz.sa/storage/27/plants.png",
    "is_default": false,
    "invoices_count": 0,
    "can_manage": true,
    "created_by": "Me",
    "parent_id": null,
    "allows_subcategories": false,
    "slug": "gardening-plants-4-k7w2p0"
  }
}
```

**422 Unprocessable Entity (Invalid parent)**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "parent_id": [
      "Subcategories can only be added under the prose category."
    ]
  }
}
```

---

## 4. Update Custom Category

### `POST /user-categories/{id}`
Update an existing custom category. Must be sent via `multipart/form-data` with `_method: PUT` or `_method: PATCH`.

**Permission:** Only the creator can edit (`can_manage: true`). Non-creators receive `403 Forbidden`.

**Form Fields**
| Field | Type | Required | Rules | Description |
|-------|------|----------|-------|-------------|
| `_method` | string | **Yes** | `in:PUT,PATCH` | HTTP verb spoofing for multipart uploads |
| `name` | string | No | `sometimes, required, string, max:255` | Updated title |
| `description` | string | No | `nullable, string, max:1000` | Updated description |
| `icon` | file | No | `nullable, image, max:2048` | New icon file to replace current icon |
| `parent_id` | — | No | `prohibited` | Changing category hierarchy is not allowed |

**200 OK Response**
```json
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 27,
    "name": "Gardening & Landscaping",
    "description": "Updated description",
    "icon_url": "https://api.herz.sa/storage/27/new-icon.png",
    "is_default": false,
    "invoices_count": 0,
    "can_manage": true,
    "created_by": "Me",
    "parent_id": null,
    "allows_subcategories": false,
    "slug": "gardening-plants-4-k7w2p0"
  }
}
```

**403 Forbidden Response**
```json
{
  "success": false,
  "message": "You can only edit or delete categories you created."
}
```

---

## 5. Delete Custom Category

### `DELETE /user-categories/{id}`
Deletes a user-created category.

**Rules:**
1. Only the creator can delete it (non-creators get `403 Forbidden`).
2. Cannot delete system default categories (`is_default = true` → `403 Forbidden`).
3. Cannot delete a category that is associated with invoices (`422 Unprocessable Entity`).

**200 OK Response**
```json
{
  "success": true,
  "message": "Category deleted successfully.",
  "data": null
}
```

**422 In-Use Response**
```json
{
  "success": false,
  "message": "Cannot delete a category that is associated with invoices."
}
```

---

## 6. Catalog Lookups (Invoice Forms)

### `GET /categories`
Dropdown lookup for invoice creation. Returns all active default top-level categories, automatically merged with custom top-level categories created by the authenticated user's family account.

### `GET /subcategories?category_id={id}`
Dropdown lookup for invoice subcategories. When `category_id = 1` (Miscellaneous), returns all active default subcategories merged with custom subcategories created by the user's family.

**Resource Object Shape**
```json
{
  "id": 27,
  "name": "Gardening & Landscaping",
  "description": "Updated description",
  "icon_url": "https://api.herz.sa/storage/27/new-icon.png",
  "is_default": false,
  "slug": "gardening-plants-4-k7w2p0",
  "allows_subcategories": false,
  "sort_order": 7
}
```
