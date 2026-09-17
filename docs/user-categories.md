# User Categories — Admin Frontend Guide

Nested CRUD for managing and displaying user-added categories on the admin **User Detail** screen.

**Base path:** `/admin/users/{userId}/categories`  
**Auth:** `Bearer {admin_token}` · `Accept: application/json`

---

## Permissions

| Action | Permission |
|--------|------------|
| List / View detail | `users.view` |
| Create / Update / Status toggle | `users.update` |
| Delete | `users.delete` |

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/users/{userId}/categories` | Paginated list of categories created by the user |
| `POST` | `/admin/users/{userId}/categories` | Create a new category assigned to the user |
| `GET` | `/admin/users/{userId}/categories/{categoryId}` | Get user category detail (for edit modal / show view) |
| `PUT` / `PATCH` | `/admin/users/{userId}/categories/{categoryId}` | Update an existing user category |
| `PATCH` | `/admin/users/{userId}/categories/{categoryId}/status` | Toggle or set `is_active` status |
| `DELETE` | `/admin/users/{userId}/categories/{categoryId}` | Delete a user category (blocked if invoices exist) |

`{categoryId}` must belong to `{userId}` and have `is_default = false`; otherwise `404 Not Found` is returned.

---

## 1. List User Categories — `GET /admin/users/{userId}/categories`

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `search` | string | No | — | Searches in English/Arabic name, description, and slug |
| `parent_id` | integer \| null | No | — | Filter by parent category ID, or `null` for top-level only |
| `is_active` | boolean | No | — | `true` or `false` |
| `page` | integer | No | `1` | Page number |
| `per_page` | integer | No | `15` | Page size (max: 100) |

### Request Example

```http
GET /admin/users/42/categories?is_active=true&page=1&per_page=15
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: en
```

### Response — `200 OK`

```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [
    {
      "id": 18,
      "name": "Home Renovation",
      "description": "Invoices and warranties for house remodel",
      "icon": "fa-solid fa-hammer",
      "icon_bg_color": "#8B5CF6",
      "slug": "home-renovation-42-a8f1b2",
      "is_default": false,
      "parent_name": null,
      "parent_id": null,
      "invoices_count": 3,
      "is_active": true,
      "sort_order": 1,
      "created_at": "2026-09-15 10:30:00",
      "updated_at": "2026-09-15 10:30:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

> **Note on `invoices_count`:** Indicates how many invoices currently reference this category. If `invoices_count > 0`, the backend will reject deletion with HTTP 422. Use this count to show a warning badge or disable the Delete action in the UI.

---

## 2. Create User Category — `POST /admin/users/{userId}/categories`

Supports both multipart `form-data` and `application/json`.

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string \| object | **Yes** | Single string (auto-mirrored to EN & AR) or `{ "en": "...", "ar": "..." }` |
| `description` | string \| object | No | Single string or `{ "en": "...", "ar": "..." }` |
| `icon` | string | **Yes** | Icon name / identifier (e.g. `fa-solid fa-hammer`) |
| `icon_bg_color` | string | **Yes** | Hex color (e.g. `#8B5CF6` or `#FFF`). Aliases: `bg_color`, `background_color` |
| `parent_id` | integer \| null | No | Optional parent category ID |
| `is_active` | boolean | No | Default: `true` |
| `sort_order` | integer | No | Integer ordering index (default: next auto order) |

### Request Example (JSON)

```json
{
  "name": {
    "en": "Gym Equipment",
    "ar": "معدات رياضية"
  },
  "description": {
    "en": "Fitness gear and maintenance",
    "ar": "أدوات اللياقة والصيانة"
  },
  "icon": "fa-solid fa-dumbbell",
  "icon_bg_color": "#10B981",
  "is_active": true
}
```

### Response — `201 Created`

```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": 19,
    "name": "Gym Equipment",
    "description": "Fitness gear and maintenance",
    "icon": "fa-solid fa-dumbbell",
    "icon_bg_color": "#10B981",
    "slug": "gym-equipment-42-b91c0e",
    "is_default": false,
    "user_id": 42,
    "user": {
      "id": 42,
      "name": "Ahmed Ali",
      "email": "ahmed@example.com"
    },
    "parent_id": null,
    "allows_subcategories": false,
    "is_active": true,
    "sort_order": 2,
    "parent": null,
    "children": [],
    "created_at": "2026-09-15 10:35:00",
    "updated_at": "2026-09-15 10:35:00"
  }
}
```

---

## 3. Show User Category — `GET /admin/users/{userId}/categories/{categoryId}`

Returns full translatable values (`{ "en": "...", "ar": "..." }`) for population in edit forms.

### Request Example

```http
GET /admin/users/42/categories/19
Authorization: Bearer {admin_token}
Accept: application/json
```

### Response — `200 OK`

```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": {
    "id": 19,
    "name": {
      "en": "Gym Equipment",
      "ar": "معدات رياضية"
    },
    "description": {
      "en": "Fitness gear and maintenance",
      "ar": "أدوات اللياقة والصيانة"
    },
    "icon": "fa-solid fa-dumbbell",
    "icon_bg_color": "#10B981",
    "slug": "gym-equipment-42-b91c0e",
    "is_default": false,
    "user_id": 42,
    "user": {
      "id": 42,
      "name": "Ahmed Ali",
      "email": "ahmed@example.com"
    },
    "parent_id": null,
    "allows_subcategories": false,
    "is_active": true,
    "sort_order": 2,
    "parent": null,
    "children": [],
    "created_at": "2026-09-15 10:35:00",
    "updated_at": "2026-09-15 10:35:00"
  }
}
```

---

## 4. Update User Category — `PUT` / `PATCH` / `POST` with `_method=PUT`

Route accepts `PUT`, `PATCH`, or `POST` with `_method: PUT` (for multipart form submissions).

### Request Example (JSON)

```json
{
  "name": {
    "en": "Home Fitness & Gym",
    "ar": "اللياقة المنزلية والجيم"
  },
  "icon_bg_color": "#059669"
}
```

### Response — `200 OK`

Returns updated category resource.

---

## 5. Toggle Status — `PATCH /admin/users/{userId}/categories/{categoryId}/status`

Quick status toggle for table switches without sending full category body.

### Request Example

```http
PATCH /admin/users/42/categories/19/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "is_active": false
}
```

*(If body is empty, it automatically inverts current `is_active`)*.

### Response — `200 OK`

```json
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 19,
    "is_active": false
  }
}
```

---

## 6. Delete User Category — `DELETE /admin/users/{userId}/categories/{categoryId}`

Permanently removes a custom user category.

### Safeguards (Error Responses)

1. **Has Invoices (`422 Unprocessable Content`):**
   ```json
   {
     "message": "Cannot delete a category that is associated with invoices.",
     "errors": {
       "category": [
         "Cannot delete a category that is associated with invoices."
       ]
     }
   }
   ```
2. **Has Subcategories (`422 Unprocessable Content`):**
   ```json
   {
     "message": "Cannot delete a category that has subcategories.",
     "errors": {
       "category": [
         "Cannot delete a category that has subcategories."
       ]
     }
   }
   ```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Category deleted successfully.",
  "data": null
}
```

---

## 7. User Details Screen Integration

On `GET /admin/users/{userId}`, the user details header response now includes `categories_count`:

```json
{
  "success": true,
  "data": {
    "id": 42,
    "name": "Ahmed Ali",
    "invoices_count": 14,
    "family_members_count": 3,
    "categories_count": 2
  }
}
```

### UI Tab Layout Recommendation:
- **Tab 1:** Overview & Profile
- **Tab 2:** Invoices (`/admin/users/{id}/invoices`) — badge count: `invoices_count`
- **Tab 3:** Family Members (`/admin/users/{id}/family-members`) — badge count: `family_members_count`
- **Tab 4:** Added Categories (`/admin/users/{id}/categories`) — badge count: `categories_count`
