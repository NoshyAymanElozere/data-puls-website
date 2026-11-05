# App Bottom Bar Icons

Admins choose the Font Awesome icon of each of the 5 items in the mobile bottom bar: Categories, Invoices, Home, Family Members and My Account. The items are a fixed list defined by the backend (`BottomNavKey`), because the app maps each key to its own tab. Only the icon can change.

## Route

| Path | Component | Sidebar label | Shown when |
|------|-----------|---------------|------------|
| `/bottom-nav-items` | `features/bottom-nav-items/pages/BottomNavItemsPage.tsx` | App Bottom Bar / الشريط السفلي للتطبيق | `bottom_nav_items.view` |

Changing an icon needs `bottom_nav_items.update`. Without it the page is read-only.

## Font Awesome

Font Awesome Free **6.7.2** (solid and regular styles) is committed under `src/assets/fontawesome/`, so the dashboard needs no CDN or extra npm package. The picker's list comes from the backend, which also validates the choice, so both must stay on the same Font Awesome version.

To upgrade, regenerate the backend's `resources/data/font-awesome-free.json`, replace `src/assets/fontawesome/`, and change the version the app uses (see the Flutter doc). Icon names and code points can change between major versions.

## API

| Method | Path | Permission | Purpose |
|--------|------|------------|---------|
| GET | `/admin/bottom-nav-items` | `bottom_nav_items.view` | The 5 items with their current icons |
| GET | `/admin/bottom-nav-items/icons` | `bottom_nav_items.view` | Icons available to the picker |
| PUT | `/admin/bottom-nav-items/{id}` | `bottom_nav_items.update` | Change an icon: `icon_style` (`solid` or `regular`) and `icon_name` (e.g. `house`) |

The app reads `GET /api/bottom-nav-items`. Its contract is in the backend repo at `docs/flutter-docs/2026-11-05/hirz-bottom-nav-icons.md`.
