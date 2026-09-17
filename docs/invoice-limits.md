# Invoice limits on subscription packages — Admin changes

React admin guide for the `maximum_invoices` field on subscription packages.

Related: [subscription-packages.md](./subscription-packages.md)

## What changed

Packages now carry an optional invoice quota used by the mobile API when creating invoices (`POST /api/invoices`).

| Field | Type | Meaning |
|-------|------|---------|
| `maximum_invoices` | `integer \| null` | Cap on lifetime invoices for the **family account** (owner + members). `null` = unlimited. |

Permissions are unchanged (`subscription_packages.view` / `create` / `update` / `delete`).

## Seeded defaults

| Package | `maximum_invoices` | UI label |
|---------|--------------------|----------|
| Starter Plan (cheapest) | `10` | `10` |
| Family Plan | `null` | Unlimited |

Admins can change either value at any time.

## List (`GET /admin/subscription-packages`)

- Add a column for invoice limit next to `maximum_family_members`.
- Display: number as-is, or localized **Unlimited** when `maximum_invoices === null`.

## Create / Edit form

- Add `maximum_invoices` control:
  - Number input (`min: 0`), **or**
  - Number input + **Unlimited** checkbox that clears the number and submits empty / omits the value so the API stores `null`.
- Form-data: send empty string for unlimited (`maximum_invoices=`). Backend normalizes `""` → `null`.
- Validation: `nullable` \| `integer` \| `min:0`. Map `errors.maximum_invoices` to this field.

## Show / Edit hydration

- Show returns `maximum_invoices` as `null` or int (same on list/create/update/status responses).
- When hydrating edit: if `null`, check Unlimited and leave the number empty.

## Enforcement note (mobile only)

- Admin does **not** create invoices; this field only configures the cap.
- Mobile create uses the **account owner’s** active/trial package.
- Count = all invoices owned by the owner + family members (lifetime).
- No active/trial subscription → mobile create returns 422.
- Cap reached → mobile create returns 422 (`invoice_limit_reached`).

## `GET /api/me/subscription` (for awareness)

Mobile also receives usage fields (not needed on admin package screens):

- `invoices_count`
- `maximum_invoices` (`null` = unlimited)
- `remaining_invoices` (`null` when unlimited)
