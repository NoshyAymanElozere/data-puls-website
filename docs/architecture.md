# Architecture

## Repo layout

```
herz-frontend/
├── dp-dashboard/dpdashboard/   ← the admin SPA (only app)
├── .cursor/rules/              ← Cursor AI rules
└── docs/                       ← human-readable docs
```

Previously this monorepo contained Express backend and marketing site — those were removed. Laravel is **external**.

## Frontend stack

| Layer | Choice |
|-------|--------|
| UI | React 18 + TypeScript |
| Build | Vite 7 |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| HTTP | Axios + Sanctum Bearer |
| Real-time | Laravel Echo + Reverb |
| Forms | React Hook Form + Zod |
| Tables | AG Grid via `GenericDataGrid` |
| Styling | Tailwind + Radix/shadcn |
| i18n | i18next (en/ar) |

## Feature modules

```
src/features/
├── auth/           Login, token session
├── dashboard/      Home page widgets
├── users/          Primary CRUD template
├── settings/       Global config + lookups + CMS pages
├── reports/        Reports placeholder
└── notifications/  REST + Reverb hook
```

## Data flow

```
Page → useXxx hook (TanStack Query) → axios → Laravel API
Header bell → useNotifications → GET /notifications (base `/admin`) + Echo private channel
```

## Shared layer

`src/shared/` holds components, hooks, services (axios, echo, queryClient), layouts, i18n, and utilities.
