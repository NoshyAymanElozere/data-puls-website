# Page Sections

| Property | Value |
|----------|-------|
| Base path | `/page-sections` |
| Auth | `auth:sanctum` |
| Policy / permission | `pages.view/create/update/delete` |
| Frontend hook | `src/features/pages/api/usePageSections.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/page-sections` | Paginated list |
| GET | `/page-sections/{id}` | Show (full translations) |
| POST | `/page-sections` | Create with optional icon |
| PUT/PATCH | `/page-sections/{id}` | Update |
| DELETE | `/page-sections/{id}` | Delete |

---

## GET /page-sections

### Query parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page_id | integer | no | Filter by parent page |
| search | string | no | Matches title en/ar |
| page | integer | no | Page number (default 1) |
| per_page | integer | no | 1–100 (default 15) |

---

## POST /page-sections

### Validation rules

| Field | Type | Rules |
|-------|------|-------|
| page_id | integer | required, exists:pages,id |
| title.en / title.ar | string | required, max:200 |
| description.en / description.ar | string | required, max:5000 |
| sort_order | integer | optional, min:0 |
| icon | file | optional, image, max:2048 KB |

### Payload (form-data)

```
page_id=1
title[en]=Data Collection
title[ar]=جمع البيانات
description[en]=…
description[ar]=…
sort_order=1
icon=<file>
```

### Response field

- `icon_url` — Spatie media URL (never a string icon identifier)

**201 — created** | **422 — validation**

---

## PUT /page-sections/{id}

Use POST + `_method=PUT` with form-data when uploading icon.

---

## DELETE /page-sections/{id}

**204 — deleted**
