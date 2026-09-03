# Subscription Packages

| Property | Value |
|----------|-------|
| Admin base URL | `{VITE_ADMIN_URL}` e.g. `https://localhost:8000/admin` |
| Admin base path | `/subscription-packages` |
| API base path | `/api/subscription-packages` |
| Auth (admin) | `auth:sanctum`, `admin` |
| Auth (API) | Public (`optional.sanctum`, `locale`) |
| Permissions | `subscription_packages.view/create/update/delete` |

## Admin endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/subscription-packages` | Paginated list |
| GET | `/subscription-packages/{id}` | Show (full translations + nested prices/features) |
| POST | `/subscription-packages` | Create with nested prices/features |
| PUT/PATCH | `/subscription-packages/{id}` | Update |
| PATCH | `/subscription-packages/{id}/status` | Toggle `is_active` |
| DELETE | `/subscription-packages/{id}` | Soft delete |

### Query parameters (list)

| Name | Type | Description |
|------|------|-------------|
| search | string | Matches name en/ar |
| is_active | boolean | `true` \| `false` |
| page / per_page | integer | Pagination (max per_page 100) |

### Create/update fields

| Field | Type | Rules |
|-------|------|-------|
| name.en / name.ar | string | required on create |
| description.en / description.ar | string | optional |
| maximum_family_members | integer | required, min:1 |
| is_active | boolean | optional |
| sort_order | integer | optional, min:0 |
| prices[] | array | required on create, min:1 |
| prices[].billing_period | enum | `monthly` \| `yearly` |
| prices[].price | decimal | required, min:0 |
| prices[].currency | string | required, size:3 |
| prices[].discount_percentage | integer | optional, 0–100 |
| prices[].is_active | boolean | optional |
| features[] | array | optional |
| features[].name.en/ar | string | required per feature |
| features[].type | enum | `main_feature` \| `sharing_feature` |
| features[].is_active | boolean | optional |

Use `multipart/form-data` for create/update. On update with body, POST + `_method=PUT`.

---

## Admin frontend

### Route map

| Route | Screen | Permission |
|-------|--------|------------|
| `/subscription-packages` | List + create | `subscription_packages.view`, `subscription_packages.create` |
| `/subscription-packages/:id` | Edit/show | `subscription_packages.view`, `subscription_packages.update` |

### List screen

- Columns: name, maximum_family_members, sort_order, is_active, actions
- Filters: `search`, `is_active` (`true` \| `false`)
- `PATCH …/status` toggles without body

### Create / edit form

- Translatable `name` and `description` (EN/AR inputs; show loads `{en, ar}`)
- Nested **prices** repeater: billing_period (`monthly` \| `yearly`), price, currency, discount_percentage, is_active
- Nested **features** repeater: name EN/AR, optional description EN/AR, type (`main_feature` \| `sharing_feature`), is_active

### Edge cases

- 422 on duplicate billing_period per package
- 422 when deleting package with user subscriptions
- List returns locale string for name; show returns `{en, ar}`

---

## Flutter catalog

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/subscription-packages` | Active packages with active prices/features |
| GET | `/api/subscription-packages/{id}` | Single active package |

Localized `name`/`description` strings. Prices include `final_price` after discount.

Enum fields return raw value + `*_label` (e.g. `billing_period`, `type` on features).
