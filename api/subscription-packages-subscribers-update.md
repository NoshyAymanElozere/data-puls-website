# Subscription Packages — API Updates (Subscribers)

Frontend integration notes for the subscriber-related changes to the **admin** subscription-packages endpoints.

**Scope:** Admin dashboard only. Public `GET /api/subscription-packages` is unchanged.

**Auth:** `Authorization: Bearer {admin_token}` · Permission: `subscription_packages.view`

---

## Summary

| Endpoint | Change |
|----------|--------|
| `GET /admin/subscription-packages` | New field: `subscribers_count` |
| `GET /admin/subscription-packages/{id}` | New fields: `subscribers_count`, `subscribers[]` |
| Create / update / status / delete | No changes |

---

## Index — `GET /admin/subscription-packages`

### Added field

| Field | Type | Notes |
|-------|------|-------|
| `subscribers_count` | integer | Active subscribers only: `trial` + `active`. Excludes `expired`, `cancelled`, `pending_payment`. |

### Example (excerpt)

```json
{
  "id": 1,
  "name": "Starter Plan",
  "subscribers_count": 2,
  "is_active": true
}
```

### Frontend

- Add a **Subscribers** column to the packages list table using `subscribers_count`.

---

## Show — `GET /admin/subscription-packages/{id}`

### Added fields

| Field | Type | Notes |
|-------|------|-------|
| `subscribers_count` | integer | Same active-only count as index |
| `subscribers` | array | All subscriptions for this package (all statuses), newest first |

### `subscribers[]` item

```json
{
  "id": 2,
  "status": "active",
  "status_label": "Active",
  "auto_renewal": true,
  "starts_at": "2026-08-28 00:00:00",
  "trial_ends_at": null,
  "ends_at": "2026-09-27 00:00:00",
  "cancelled_at": null,
  "remaining_days": 25,
  "user": {
    "id": 2,
    "avatar_url": "https://example.test/images/user-placeholder.png",
    "email": "demo.two@example.test",
    "phone": "0557654321",
    "gender": "male",
    "gender_label": "Male",
    "status": "active",
    "status_label": "Active"
  },
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
  "created_at": "2026-09-01 12:00:00",
  "updated_at": "2026-09-01 12:00:00"
}
```

### Field reference

| Field | Type | Values / notes |
|-------|------|----------------|
| `status` | string | `pending_payment` · `trial` · `active` · `cancelled` · `expired` |
| `status_label` | string | Localized label — use for display |
| `remaining_days` | integer \| null | Days until `ends_at`; `0` if past |

### Frontend

- Add a **Subscribers** section on the package detail page (table or cards).
- Badge text from `status_label`; badge color from raw `status`.
- Show `user.email`, `user.phone`, `user.avatar_url`.
- Show billing period from `billing_option.billing_period_label`.
- **Important:** `subscribers_count` is active/trial only; `subscribers[]` includes expired and cancelled records for admin history.

---

## Unchanged responses

These endpoints do **not** return `subscribers_count` or `subscribers`:

- `POST /admin/subscription-packages`
- `PUT /admin/subscription-packages/{id}`
- `PATCH /admin/subscription-packages/{id}/status`
- `DELETE /admin/subscription-packages/{id}`

---

## Demo data (after `php artisan db:seed`)

| Package | `subscribers_count` | Total in `subscribers[]` |
|---------|---------------------|----------------------------|
| Starter (`sort_order: 1`) | 2 | 3 (2 active, 1 expired) |
| Family (`sort_order: 2`) | 2 | 3 (1 trial, 1 active, 1 cancelled) |
