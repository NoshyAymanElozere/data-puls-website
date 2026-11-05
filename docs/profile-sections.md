# My Account Page Sections

Admins choose which sections appear on the mobile **My Account** (`حسابي`) page and in what order. Sections are a fixed list defined by the backend (`ProfileSectionKey`), because the app maps each key to its own screen, so there is no create, edit or delete.

## Route

| Path | Component | Sidebar label | Shown when |
|------|-----------|---------------|------------|
| `/profile-sections` | `features/profile-sections/pages/ProfileSectionsPage.tsx` | My Account Page / صفحة حسابي | `profile_sections.view` |

Changing a section needs `profile_sections.update`. Without it the page is read-only.

## Behavior

- **Show / hide:** the status switch saves at once.
- **Reorder:** drag a row or use the up and down arrows. The list moves at once, saves the whole order, and returns to the previous order if saving fails.
- **Titles** come translated from the backend, so the query is cached per language.

## API

| Method | Path | Permission | Purpose |
|--------|------|------------|---------|
| GET | `/admin/profile-sections` | `profile_sections.view` | All sections in order, including hidden ones |
| PATCH | `/admin/profile-sections/{id}/status` | `profile_sections.update` | Flip visibility, or set it with `is_active` |
| PUT | `/admin/profile-sections/sort` | `profile_sections.update` | Save the order: `ids` lists every section id from first to last |

The app reads `GET /api/profile-sections`, which returns only the visible sections in order. Its contract is in the backend repo at `docs/flutter-docs/2026-11-05/hirz-profile-sections.md`.
