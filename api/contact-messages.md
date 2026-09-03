# Contact Messages

| Property | Value |
|----------|-------|
| Base path | `/contact-messages` |
| Auth | `auth:sanctum` |
| Policy / permission | `contact_messages.view`, `contact_messages.delete` |
| Frontend hook | `src/features/contact/api/useContactMessages.ts` |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/contact-messages` | Paginated inbox |
| GET | `/contact-messages/{id}` | Show detail |
| DELETE | `/contact-messages/{id}` | Delete |

No create/update from admin — messages are submitted via `POST /api/contact-us`.

---

## GET /contact-messages

### Query parameters

| Name | Type | Description |
|------|------|-------------|
| search | string | User email/phone or message text |
| subject_id | integer | Filter by subject |
| created_from | date | YYYY-MM-DD |
| created_to | date | YYYY-MM-DD, >= created_from |
| page / per_page | integer | Pagination |

### Responses

**200 — paginated**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "subject_id": 2,
      "message": "…",
      "user": {
        "id": 5,
        "email": "user@example.com",
        "phone": "+966…",
        "avatar_url": "https://…"
      },
      "subject": { "id": 2, "name": "Technical Support" },
      "created_at": "2026-08-31T10:00:00.000000Z"
    }
  ],
  "meta": { "current_page": 1, "total": 1 }
}
```

Use `user.id` to link to `/users/{id}` in the admin UI.

---

## GET /contact-messages/{id}

Full message with nested `user` and `subject`.

---

## DELETE /contact-messages/{id}

**Auth:** `contact_messages.delete`

**204 — deleted**

---

## Flutter submit (reference)

`POST /api/contact-us` — auth required, body `{ subject_id, message }`. See Postman **Contact (API)** folder.
