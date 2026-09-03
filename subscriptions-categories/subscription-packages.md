# Subscription Packages — Admin Frontend Guide

API contract: [`docs/api/subscription-packages.md`](../api/subscription-packages.md)

## Route map

| Route | Screen | Permission |
|-------|--------|------------|
| `/subscription-packages` | List + create | `subscription_packages.view`, `subscription_packages.create` |
| `/subscription-packages/:id` | Edit/show | `subscription_packages.view`, `subscription_packages.update` |

## List

- Columns: name, maximum_family_members, sort_order, is_active, actions
- Filters: `search`, `is_active` (`true` \| `false`)
- `PATCH …/status` toggles without body

## Create / edit form

- Translatable `name` and `description` (EN/AR inputs; show loads `{en, ar}`)
- Nested **prices** repeater: billing_period (`monthly` \| `yearly`), price, currency, discount_percentage, is_active
- Nested **features** repeater: name EN/AR, optional description EN/AR, type (`main_feature` \| `sharing_feature`), is_active
- Use form-data for POST/PUT with `_method=PUT` on update

## Edge cases

- 422 on duplicate billing_period per package
- 422 when deleting package with user subscriptions
- List returns locale string for name; show returns `{en, ar}`
