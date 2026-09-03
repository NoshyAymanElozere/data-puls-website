# Categories — Admin Frontend Guide

API contract: [`docs/api/categories.md`](../api/categories.md)

## Route map

| Route | Screen | Permission |
|-------|--------|------------|
| `/categories` | Top-level list | `categories.view` |
| `/categories/:id` | Edit top-level | `categories.view`, `categories.update` |
| `/categories/:id/subcategories` | Subcategory list (parent = النثريات) | `categories.view` |

## List screens

- Top-level: `GET /admin/categories?parent_id=null`
- Subcategories: `GET /admin/categories?parent_id={nathriatId}`

## Create subcategory

- Only allow `parent_id` selector when parent is النثريات (`slug: nathriat`, `allows_subcategories: true`)
- Do not expose `allows_subcategories` toggle in UI (server-managed)

## Delete guards

- Disable delete for النثريات row
- Show error if parent still has subcategories

## Edge cases

- 422 when assigning invalid parent (e.g. poetry)
- Translatable show vs list same pattern as other modules
