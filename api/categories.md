# Categories

| Property | Value |
|----------|-------|
| Admin base URL | `{VITE_ADMIN_URL}` e.g. `https://localhost:8000/admin` |
| Admin base path | `/categories` |
| API paths | `/api/categories`, `/api/subcategories` |
| Auth (admin) | `auth:sanctum`, `admin` |
| Auth (API) | Public (`optional.sanctum`, `locale`) |
| Permissions | `categories.view/create/update/delete` |

## Business rules

- Seeded default **النثريات** (`slug: nathriat`) is the only category with `allows_subcategories: true`.
- Subcategories must use `parent_id` pointing to a parent that allows subcategories.
- Top-level categories cannot enable `allows_subcategories` via admin.
- Cannot delete النثريات or a parent with existing subcategories.

## Admin endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | Paginated list |
| GET | `/categories/{id}` | Show |
| POST | `/categories` | Create |
| PUT/PATCH | `/categories/{id}` | Update |
| PATCH | `/categories/{id}/status` | Toggle `is_active` |
| DELETE | `/categories/{id}` | Delete |

### Query filters (list)

| Name | Type | Description |
|------|------|-------------|
| parent_id | integer or `null` | Filter top-level (`null`) or children of parent |
| search | string | name en/ar, slug |
| is_active | boolean | `true` \| `false` |
| page / per_page | integer | Pagination |

### Create/update fields

| Field | Type | Rules |
|-------|------|-------|
| name.en / name.ar | string | required on create |
| slug | string | optional on create, unique, alpha_dash |
| parent_id | integer | optional; required for subcategories |
| sort_order | integer | optional, min:0 |
| is_active | boolean | optional |

---

## Admin frontend

### Route map

| Route | Screen | Permission |
|-------|--------|------------|
| `/categories` | Top-level list | `categories.view` |
| `/categories/:id` | Edit top-level | `categories.view`, `categories.update` |
| `/categories/:id/subcategories` | Subcategory list (parent = النثريات) | `categories.view` |

### List screens

- Top-level: `GET /admin/categories?parent_id=null`
- Subcategories: `GET /admin/categories?parent_id={nathriatId}`

### Create subcategory

- Only allow `parent_id` selector when parent is النثريات (`slug: nathriat`, `allows_subcategories: true`)
- Do not expose `allows_subcategories` toggle in UI (server-managed)

### Delete guards

- Disable delete for النثريات row
- Show error if parent still has subcategories

### Edge cases

- 422 when assigning invalid parent (e.g. poetry)
- Translatable show vs list: show = `{en, ar}`, list = locale string

---

## Flutter lookup

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | Active top-level categories |
| GET | `/api/subcategories?category_id=` | Active subcategories for allowed parent |

`category_id` is required on subcategories endpoint.
