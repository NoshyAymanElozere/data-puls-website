# User Invoices — Admin Guide

API contract: [`docs/api/user-invoices.md`](../../api/user-invoices.md)

Nested under user detail. All routes are **GET only** (read-only admin).

**Base path:** `/admin/users/{userId}/invoices`

**Auth:** `Authorization: Bearer {admin_token}` · `Accept: application/json` · `Accept-Language: ar|en`

---

## Permissions

| Action | Permission | Endpoint(s) |
|--------|------------|-------------|
| List | `users.view` | `GET /admin/users/{userId}/invoices` |
| Show | `users.view` | `GET /admin/users/{userId}/invoices/{invoiceId}` |

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users/{userId}/invoices` | Paginated invoices created by this user |
| GET | `/admin/users/{userId}/invoices/{invoiceId}` | Invoice detail (must belong to that user) |

---

## List — `GET /admin/users/{userId}/invoices`

### Scope

Only invoices where `user_id = {userId}` (creator). Does **not** include family members’ invoices on the owner’s page — open each member’s user detail to see theirs.

### Query parameters

| Param | Type | Required | Default | Rules / notes |
|-------|------|----------|---------|---------------|
| `search` | string | No | — | Partial match on `store_name`, `invoice_number`, `notes` |
| `page` | integer | No | `1` | min 1 |
| `per_page` | integer | No | `15` | min 1, max 100 |

### Request example

```http
GET /admin/users/1/invoices?search=Tech&page=1&per_page=15
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: ar
```

### Response — `200 OK` (paginated)

```json
{
  "success": true,
  "message": "Invoices retrieved successfully.",
  "data": [
    {
      "id": 5,
      "invoice_number": "INV-100",
      "store_name": "Tech Store",
      "image": "https://example.test/storage/invoices/5.jpg",
      "purchase_date": "2026-09-01",
      "total_amount": 1500.5,
      "category_id": 2,
      "subcategory_id": null,
      "category": {
        "id": 2,
        "name": { "en": "Electronics", "ar": "إلكترونيات" }
      },
      "subcategory": null,
      "has_warranty": true,
      "return_period_days": 7,
      "exchange_period_days": 14,
      "return": {
        "is_applicable": true,
        "period_days": 7,
        "end_date": "2026-09-08",
        "is_expired": false
      },
      "exchange": {
        "is_applicable": true,
        "period_days": 14,
        "end_date": "2026-09-15",
        "is_expired": false
      },
      "creator": {
        "id": 1,
        "name": "Ahmed (صاحب الحساب)",
        "avatar_url": "https://example.test/images/user-placeholder.png"
      },
      "products_count": 1,
      "products": [
        {
          "id": 10,
          "name": "Laptop",
          "quantity": 1,
          "unit_price": 1500.5,
          "total_price": 1500.5,
          "warranty_period_name": "12 Months",
          "warranty_end_date": "2027-09-01"
        }
      ],
      "created_at": "2026-09-02 12:00:00"
    }
  ],
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

### List item field reference

| Field | Type | UI use |
|-------|------|--------|
| `id` | integer | Row key / open detail |
| `invoice_number` | string | Column |
| `store_name` | string | Column |
| `image` | string \| null | Thumbnail (attachment) |
| `purchase_date` | string | `YYYY-MM-DD` |
| `total_amount` | number | Money column |
| `category` | object \| omitted | Badge: prefer `name.ar` / `name.en` by UI locale |
| `has_warranty` | boolean | Badge Yes/No |
| `return_period_days` | integer \| null | Raw days if set |
| `exchange_period_days` | integer \| null | Raw days if set |
| `return` / `exchange` | object | See return/exchange shape below |
| `creator` | object | Name already includes relation suffix |
| `products` | array | Present when loaded (list may include products) |
| `created_at` | string | Optional secondary column |

### Suggested table columns

| Column | Field |
|--------|-------|
| Invoice # | `invoice_number` |
| Store | `store_name` |
| Image | `image` |
| Purchase date | `purchase_date` |
| Category | `category.name` |
| Total | `total_amount` |
| Warranty | `has_warranty` |
| Return | `return` (`is_applicable` / `end_date` / `is_expired`) |
| Exchange | `exchange` |
| Actions | Open detail |

### Filters UI

- Search input → `search`
- Page size selector → `per_page`
- Use `meta.total` for “X results”

---

## Show — `GET /admin/users/{userId}/invoices/{invoiceId}`

### Request example

```http
GET /admin/users/1/invoices/5
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: ar
```

### Response — `200 OK`

Same invoice object shape as list items, with full `products[]` and computed `return` / `exchange`.

```json
{
  "success": true,
  "message": "Invoices retrieved successfully.",
  "data": {
    "id": 5,
    "invoice_number": "INV-100",
    "store_name": "Tech Store",
    "image": "https://example.test/storage/invoices/5.jpg",
    "purchase_date": "2026-09-01",
    "total_amount": 1500.5,
    "category_id": 2,
    "subcategory_id": null,
    "category": {
      "id": 2,
      "name": { "en": "Electronics", "ar": "إلكترونيات" }
    },
    "subcategory": null,
    "has_warranty": true,
    "return_period_days": 7,
    "exchange_period_days": null,
    "return": {
      "is_applicable": true,
      "period_days": 7,
      "end_date": "2026-09-08",
      "is_expired": false
    },
    "exchange": {
      "is_applicable": false,
      "period_days": null,
      "end_date": null,
      "is_expired": null
    },
    "creator": {
      "id": 1,
      "name": "Ahmed (صاحب الحساب)",
      "avatar_url": "https://example.test/images/user-placeholder.png"
    },
    "products_count": 2,
    "products": [
      {
        "id": 10,
        "name": "Laptop",
        "quantity": 1,
        "unit_price": 1200,
        "total_price": 1200,
        "warranty_period_name": "12 Months",
        "warranty_end_date": "2027-09-01"
      },
      {
        "id": 11,
        "name": "Mouse",
        "quantity": 2,
        "unit_price": 150.25,
        "total_price": 300.5,
        "warranty_period_name": null,
        "warranty_end_date": null
      }
    ],
    "created_at": "2026-09-02 12:00:00"
  }
}
```

### Product row fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | |
| `name` | string | |
| `quantity` | integer | |
| `unit_price` | number | Unit price |
| `total_price` | number | `quantity × unit_price` |
| `warranty_period_name` | string \| null | Localized period label when warranty exists |
| `warranty_end_date` | string \| null | `YYYY-MM-DD` |

### Return / exchange object shape

| Field | Type | Notes |
|-------|------|-------|
| `is_applicable` | boolean | `false` when period days were not set on invoice |
| `period_days` | integer \| null | |
| `end_date` | string \| null | `purchase_date + period_days` |
| `is_expired` | boolean \| null | `null` when not applicable |

Food / non-returnable invoices often have both windows with `is_applicable: false`.

### Detail UI sections

1. Header: store, invoice #, image, purchase date, total  
2. Category / subcategory badges  
3. Creator card (`creator.name`, `creator.avatar_url`)  
4. Return & exchange status cards  
5. Products table (`products_count` as title count)

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

### `404 — user or invoice not found / invoice not owned by user`

```json
{
  "success": false,
  "message": "Resource not found."
}
```

### `422 — invalid query`

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "per_page": ["The per page field must not be greater than 100."]
  }
}
```

---

## Validation / error mapping

| Status / key | UI area |
|--------------|---------|
| `403` | Hide invoices tab or show forbidden state |
| `404` (list user) | Back to users list |
| `404` (invoice) | Close drawer; toast “Invoice not found for this user” |
| `errors.search` | Search input |
| `errors.per_page` | Page size control |

---

## Notes

- No create / update / delete invoice routes in admin for this release.
- List and show share the same resource shape; prefer show for the drawer so products are always complete.
- Creator `name` already concatenates relation (e.g. `محمد (الابن)` or `Ahmed (Account owner)` depending on locale).
