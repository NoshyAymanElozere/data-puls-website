# Components

Shared UI lives in `src/shared/components/`.

## Primitives (shadcn-style)

`button`, `card`, `input`, `dialog`, `dropdown-menu`, `select`, `tabs`, `badge`, `alert`, etc.

Built with Radix UI + CVA variants + Tailwind.

## Form components

| Component | Purpose |
|-----------|---------|
| `BaseInputField` | Text input bound to react-hook-form |
| `BaseTextareaField` | Textarea bound to form |
| `form-fields.tsx` | `useZodForm`, `FormField`, controlled helpers |
| `StatusDropdown` | Active/inactive toggle |
| `CountrySelect` / `CitySelect` | Entity search selects |

## Data display

| Component | Purpose |
|-----------|---------|
| `GenericDataGrid` | AG Grid table with sort/filter/pagination |
| `TableSkeleton` | Loading placeholder |
| `pagination.tsx` | Standalone pager |
| `SearchInput` | Search field with icon |
| `DateRangePicker` | Date range filter |
| `stat-card.tsx` | Dashboard metric card |
| `modal-status.tsx` | Confirm + form modals |

## Layout

- `Layout.tsx` — shell with sidebar + header + outlet
- `Sidebar.tsx` — main navigation
- `Header.tsx` — title, search, theme, language, notifications, user menu

## Usage rule

Add domain-specific UI under `features/<domain>/`. Only promote to `shared/` when reused across features.
