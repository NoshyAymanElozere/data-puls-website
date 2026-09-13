# Categories — Admin Guide

API contract: [`docs/api/categories.md`](../../api/categories.md)

## Permissions

| Action | Permission |
|--------|------------|
| View list / show | `categories.view` |
| Create | `categories.create` |
| Update / status toggle | `categories.update` |
| Delete | `categories.delete` |

## Business rules (UI must enforce)

- **Default System Categories (`is_default = true`)**: Created by administrators.
- **User Custom Categories (`is_default = false`)**: Created by mobile app users. Administrators have full oversight to inspect and delete them.
- **Icons**: Categories require an image icon (`icon`) uploaded via multipart form-data.
- **Descriptions**: Translatable descriptions (`description.en` and `description.ar`) provide category guidance.
- **النثريات** (`slug: nathriat`) is seeded with `id: 1` and is the **only** category that may have subcategories.
- Cannot delete النثريات.
- Cannot delete any category that still has subcategories.
- Cannot delete any category that is associated with invoices (`422 Unprocessable Entity`).

## Top-level list (`GET /admin/categories?parent_id=null`)

- **Columns**: `icon`, `name`, `description`, `slug`, `is_default`, `creator_name` (e.g. `System` or User name), `sort_order`, `is_active`, `actions`
- **Filters**:
  - `search`: filters name, description, and slug
  - `is_active`: `true` | `false`
  - `is_default`: `true` (System default) | `false` (User custom categories)
  - `parent_id`: `null` for top-level categories

## Subcategory list (`GET /admin/categories?parent_id={nathriatId}`)

- Filter locked to النثريات parent ID (`1`).
- Breadcrumb: Categories → النثريات → Subcategories
- Displays both system default subcategories and user-created subcategories under Miscellaneous.
- "Add subcategory" button only on this screen.

## Show (`GET /admin/categories/{id}`)

- Translatable fields returned as objects for edit form:
  - `name`: `{ en: "...", ar: "..." }`
  - `description`: `{ en: "...", ar: "..." }`
- Includes `icon_url`, `is_default`, and `user` object when user-created (`{ id, name, email }`).

## Create (`POST /admin/categories`)

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `name[en]`: string (required)
  - `name[ar]`: string (required)
  - `description[en]`: string (optional)
  - `description[ar]`: string (optional)
  - `icon`: image file (required, max: 2048 KB)
  - `slug`: string (optional)
  - `sort_order`: integer (optional)
  - `is_active`: boolean (optional, defaults to true)
  - `parent_id`: omitted for top-level; set to `1` for subcategory under Miscellaneous

## Update (`POST /admin/categories/{id}`)

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `_method`: `PUT` or `PATCH`
  - `name[en]`, `name[ar]`: string (optional)
  - `description[en]`, `description[ar]`: string (optional)
  - `icon`: image file (optional, replaces current icon if provided)
  - `sort_order`: integer (optional)
  - `is_active`: boolean (optional)
- Note: System-protected categories like النثريات cannot change `slug`, `parent_id`, or `allows_subcategories`.

## Status toggle (`PATCH /admin/categories/{id}/status`)

- Flips `is_active`.
- Inactive categories are hidden from mobile catalog lookups.

## Overseeing & Deleting User Categories (`DELETE /admin/categories/{id}`)

- Administrators can delete any category, including user-created categories.
- Returns `204 No Content` on successful deletion.
- Returns `422 Unprocessable Entity` if:
  - Attempting to delete النثريات
  - Attempting to delete a parent with subcategories
  - Attempting to delete a category that has linked invoices

## Validation mapping

| Error key | Form area |
|-----------|-----------|
| `name.en`, `name.ar` | Name translatable inputs |
| `description.en`, `description.ar` | Description translatable inputs |
| `icon` | Icon file uploader |
| `parent_id` | Parent selector |
| `category` | Delete confirmation modal |
| `slug` | Slug input |
