# Admin Dashboard Documentation

Base React admin dashboard integrated with **Laravel Sanctum** (HTTP) and **Laravel Reverb** (real-time notifications).

## App location

`dp-dashboard/dpdashboard/`

## Quick start

```bash
cd dp-dashboard/dpdashboard
cp .env.example .env
pnpm install   # or npm install --legacy-peer-deps
pnpm dev
```

## Docs index

| Doc | Topic |
|-----|-------|
| [architecture.md](./architecture.md) | Repo structure & stack |
| [laravel-api-integration.md](./laravel-api-integration.md) | API contract for your Laravel backend |
| [api/TEMPLATE.md](./api/TEMPLATE.md) | **Format spec for per-resource API docs** (hand to backend team) |
| [api/dashboard-and-reports.md](./api/dashboard-and-reports.md) | **Backend API specification for Dashboard & Reports** |
| [authentication.md](./authentication.md) | Sanctum Bearer login flow |
| [components.md](./components.md) | Shared UI library |
| [data-tables-and-filtering.md](./data-tables-and-filtering.md) | GenericDataGrid, pagination, search |
| [forms-and-validation.md](./forms-and-validation.md) | RHF + Zod + 422 mapping |
| [notifications-and-toasts.md](./notifications-and-toasts.md) | Toasts + Reverb bell |
| [state-management-and-data-fetching.md](./state-management-and-data-fetching.md) | TanStack Query |
| [routing-and-navigation.md](./routing-and-navigation.md) | Routes & sidebar |
| [styling-and-theming.md](./styling-and-theming.md) | Tailwind & dark mode |
| [internationalization.md](./internationalization.md) | en/ar + RTL |
| [settings.md](./settings.md) | Settings module (incl. company info group, page-section full content) |
| [partners.md](./partners.md) | Herz partners & partner sectors |
| [adding-a-new-feature.md](./adding-a-new-feature.md) | Copy users CRUD template |

## Cursor rules

AI guidance lives in `.cursor/rules/*.mdc` at the repo root.
