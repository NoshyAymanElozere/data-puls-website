# Users — API Updates (Subscriptions)

Frontend integration notes for subscription-related changes to the **admin** users endpoints.

**Scope:** Admin dashboard only.

**Auth:** `Authorization: Bearer {admin_token}` · Permission: `users.view`

---

## Summary

| Endpoint | Change |
|----------|--------|
| `GET /admin/users` | New field: `is_subscribed` |
| `GET /admin/users/{id}` | New fields: `is_subscribed`, `active_subscription`, `subscriptions[]` |
| Create / update / status / delete | No changes |

---

## Index — `GET /admin/users`

### Added field

| Field | Type | Notes |
|-------|------|-------|
| `is_subscribed` | boolean | `true` when the user has an **active package subscription** (`trial` or `active`). `false` for `expired`, `cancelled`, `pending_payment`, or no subscription. |

### Example (excerpt)

```json
{
  "id": 1,
  "email": "demo.one@example.test",
  "phone": "0551234567",
  "gender": "female",
  "age": 28,
  "status": "active",
  "is_subscribed": true,
  "created_at": "2026-09-01 10:00:00"
}
```

### Frontend

- Add a **Subscribed** column or badge in the users list using `is_subscribed`.
- Optional filter toggle (client-side or future API filter) to show subscribed users only.

---

## Show — `GET /admin/users/{id}`

### Added fields

| Field | Type | Notes |
|-------|------|-------|
| `is_subscribed` | boolean | Same rule as index |
| `active_subscription` | object \| null | Current `trial` or `active` subscription with full package details; `null` if none |
| `subscriptions` | array | All subscription records for this user (all statuses), newest first |

### `active_subscription` object

Same shape as items in `subscriptions[]`:

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Subscription ID |
| `status` | string | `pending_payment` · `trial` · `active` · `cancelled` · `expired` |
| `status_label` | string | Localized label |
| `auto_renewal` | boolean | |
| `starts_at` | string \| null | Formatted datetime |
| `trial_ends_at` | string \| null | Formatted datetime |
| `ends_at` | string \| null | Formatted datetime |
| `cancelled_at` | string \| null | Formatted datetime |
| `remaining_days` | integer \| null | Days until `ends_at` |
| `billing_option` | object | Selected price (period, amount, currency) |
| `package` | object | Full package details (name, description, prices, features) |
| `created_at` | string | Formatted datetime |
| `updated_at` | string | Formatted datetime |

### Nested `package` object

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | |
| `name` | string | Current locale string |
| `description` | string \| null | Current locale string |
| `maximum_family_members` | integer | |
| `is_active` | boolean | |
| `sort_order` | integer | |
| `prices` | array | Monthly/yearly price options |
| `features` | array | Package features |
| `created_at` | string | |
| `updated_at` | string | |

### Example (excerpt)

```json
{
  "id": 1,
  "email": "demo.one@example.test",
  "is_subscribed": true,
  "active_subscription": {
    "id": 1,
    "status": "active",
    "status_label": "Active",
    "auto_renewal": true,
    "starts_at": "2026-08-18 00:00:00",
    "trial_ends_at": null,
    "ends_at": "2026-09-17 00:00:00",
    "cancelled_at": null,
    "remaining_days": 15,
    "billing_option": {
      "id": 1,
      "billing_period": "monthly",
      "billing_period_label": "Monthly",
      "price": "29.00",
      "final_price": "29.00",
      "currency": "SAR",
      "discount_percentage": 0,
      "is_active": true
    },
    "package": {
      "id": 1,
      "name": "Starter Plan",
      "description": "Essential access for individuals.",
      "maximum_family_members": 1,
      "is_active": true,
      "sort_order": 1,
      "prices": [],
      "features": []
    },
    "created_at": "2026-09-01 10:00:00",
    "updated_at": "2026-09-01 10:00:00"
  },
  "subscriptions": []
}
```

### Unsubscribed user

```json
{
  "id": 5,
  "email": "no.subscription@example.test",
  "is_subscribed": false,
  "active_subscription": null,
  "subscriptions": []
}
```

User with only expired/cancelled history:

```json
{
  "is_subscribed": false,
  "active_subscription": null,
  "subscriptions": [
    {
      "id": 3,
      "status": "expired",
      "status_label": "Expired",
      "package": { "id": 1, "name": "Starter Plan" }
    }
  ]
}
```

### Frontend

- **Detail page — subscription section:**
  - If `is_subscribed` → highlight `active_subscription` (package name, status badge, billing period, renewal dates).
  - Show `package.prices` and `package.features` for full package context.
- **Subscription history:** Render `subscriptions[]` table below (all statuses) for admin audit.
- Use `status_label` for display; `status` for badge colors.
- `active_subscription` is a convenience shortcut — it matches the newest `trial`/`active` record in `subscriptions[]` when one exists.

---

## Unchanged endpoints

These do **not** return subscription fields:

- `POST /admin/users`
- `PUT /admin/users/{id}`
- `PATCH /admin/users/{id}/status`
- `DELETE /admin/users/{id}`

---

## `is_subscribed` rules

| Subscription status | `is_subscribed` |
|---------------------|-----------------|
| `trial` | `true` |
| `active` | `true` |
| `pending_payment` | `false` |
| `cancelled` | `false` |
| `expired` | `false` |
| No subscription | `false` |

---

## Demo data

After `php artisan db:seed`:

| Email | `is_subscribed` | Notes |
|-------|-----------------|-------|
| `demo.one@example.test` | `true` | Active on Starter |
| `demo.two@example.test` | `true` | Active on Starter |
| `subscriber.starter.expired@example.test` | `false` | Expired only |
| `subscriber.family.trial@example.test` | `true` | Trial on Family |
| `subscriber.family.active@example.test` | `true` | Active on Family |
| `subscriber.family.cancelled@example.test` | `false` | Cancelled only |

See also: [subscription-packages-subscribers-update.md](./subscription-packages-subscribers-update.md)
