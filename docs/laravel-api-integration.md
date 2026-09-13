# Laravel API Integration

This dashboard expects a Laravel API with Sanctum token authentication and standard JSON envelopes.

## Environment

```env
VITE_API_URL=https://herz-dashboard.am.prompita.com/admin
VITE_REVERB_APP_KEY=your-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=https
```

`VITE_API_URL` already includes the `/admin` prefix. Hooks call relative paths like `/users`, which resolve to `https://herz-dashboard.am.prompita.com/admin/users`.

## Auth endpoints

| Method | Path (relative to base) | Full URL example |
|--------|-------------------------|------------------|
| POST | `/login` | `.../admin/login` |
| GET | `/me` | `.../admin/me` |
| POST | `/logout` | `.../admin/logout` |
| PATCH | `/me/password` | `.../admin/me/password` |

Login returns `data.admin` with `permissions[]`. Profile uses `GET /me`.

## Documented resources (`api/` folder)

| Resource | Paths |
|----------|-------|
| App settings | `GET/PUT /app-settings/general`, `GET/PUT /app-settings/contact` |
| Pages | `GET /pages`, `GET/PUT/DELETE /pages/{id}` |
| Page sections | `GET/POST/PUT/DELETE /page-sections` |
| Contact subjects | `GET/POST/PUT/DELETE /contact-subjects`, `PATCH /contact-subjects/{id}/status` |
| Contact messages | `GET/DELETE /contact-messages` |
| Countries | `GET/POST/PUT/DELETE /countries`, `PATCH /countries/{id}/status` — FormData `name[en/ar]`, `iso_code`, `currency_code`, `phone_code` |
| Cities | `GET/POST/PUT/DELETE /cities`, `PATCH /cities/{id}/status` — FormData `name[en/ar]`, `country_id` |
| Dashboard & Reports | `GET /dashboard/stats`, `GET /dashboard/analytics`, `GET /reports/summary`, `GET /reports/financial-growth`, `GET /reports/category-share`, etc. |

See [`api/`](../api/) for full request/response contracts.

## Legacy / undocumented (still used by frontend)

| Method | Path |
|--------|------|
| GET/POST/PUT/DELETE | `/users` |
| GET/PUT | `/settings` (footer page) |
| GET | `/notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all` |

## Resource CRUD (example: users)

| Method | Path |
|--------|------|
| GET | `/users?page=1&search=&sort_by=created_at&sort_order=desc` |
| GET | `/users/{id}` |
| POST | `/users` |
| PUT | `/users/{id}` |
| DELETE | `/users/{id}` |
| PATCH | `/users/{id}/toggle-status` |

### Paginated response

```json
{
  "data": [{ "id": 1, "name": "Admin", "email": "a@example.com" }],
  "links": [],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 15, "total": 42 }
}
```

## Validation error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": { "email": ["The email has already been taken."] }
}
```

Frontend maps `errors` to react-hook-form via `applyValidationErrors()`.

## Permissions

Gate destructive UI with `hasPermission(admin, 'resource.action')` using names from `/me` (e.g. `pages.update`, `contact_messages.delete`).

## Laravel checklist

- [ ] Sanctum API tokens enabled
- [ ] CORS allows frontend origin + `Authorization` header
- [ ] Admin routes under `/admin` prefix
- [ ] Resource controllers return Laravel pagination
- [ ] Reverb running; `/broadcasting/auth` accepts Bearer token
- [ ] Channel: `App.Models.User.{id}` authorized for authenticated admin
