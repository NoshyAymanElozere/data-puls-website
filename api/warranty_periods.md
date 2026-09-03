# Warranty Periods

| Property | Value |
|----------|-------|
| Admin base URL | `{VITE_ADMIN_URL}` e.g. `http://localhost:8000/admin` |
| Admin base path | `/warranty-periods` |
| Auth (admin) | `auth:sanctum`, `admin` |
| Permissions | `warranty_periods.view/create/update/delete` |

## Business rules

- Each period is uniquely identified by `(duration, unit)` where `unit` is `month` or `year`.
- Optional translatable `name` overrides the auto-generated label (e.g. `12 Months` / `12 شهر`).
- Inactive periods are hidden from the Flutter lookup catalog.
- `months` is computed server-side for API responses (`year` → duration × 12).

## Admin endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/warranty-periods` | Paginated list |
| GET | `/warranty-periods/{id}` | Show |
| POST | `/warranty-periods` | Create |
| PUT/PATCH | `/warranty-periods/{id}` | Update |
| PATCH | `/warranty-periods/{id}/status` | Toggle `is_active` |
| DELETE | `/warranty-periods/{id}` | Delete |

### Query filters (list)

| Name | Type | Description |
|------|------|-------------|
| search | string | name en/ar |
| is_active | boolean | `true` \| `false` |
| unit | enum | `month` \| `year` |
| page / per_page | integer | Pagination |

### Create/update fields

| Field | Type | Rules |
|-------|------|-------|
| duration | integer | required on create, min:1 |
| unit | enum | required on create: `month` \| `year` |
| name.en / name.ar | string | optional |
| sort_order | integer | optional, min:0 |
| is_active | boolean | optional |

## Admin frontend

See [`docs/frontend/invoices-warranty/warranty_periods.md`](../frontend/invoices-warranty/warranty_periods.md).

Flutter lookup is documented in Postman: `postman/Flutter_Invoices.postman_collection.json`.
