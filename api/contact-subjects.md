# Contact Subjects

| Property | Value |
|----------|-------|
| Base path | `/contact-subjects` |
| Auth | `auth:sanctum` |
| Policy / permission | `contact_subjects.view/create/update/delete` |
| Frontend hook | `src/features/contact/api/useContactSubjects.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/contact-subjects` | Paginated list |
| GET | `/contact-subjects/{id}` | Show |
| POST | `/contact-subjects` | Create |
| PUT/PATCH | `/contact-subjects/{id}` | Update |
| DELETE | `/contact-subjects/{id}` | Delete |
| PATCH | `/contact-subjects/{id}/status` | Toggle `is_active` |

---

## GET /contact-subjects

### Query parameters

| Name | Type | Description |
|------|------|-------------|
| search | string | Matches name en/ar |
| is_active | boolean | `true` \| `false` |
| page / per_page | integer | Pagination |

---

## POST /contact-subjects

| Field | Type | Rules |
|-------|------|-------|
| name.en / name.ar | string | required, max:150 |
| sort_order | integer | optional, min:0 |
| is_active | boolean | optional |

**201 — created**

---

## PATCH /contact-subjects/{id}/status

No body. Toggles `is_active`.

---

## Flutter public lookup

`GET /api/contact-subjects` — active subjects only, localized `name` string.
