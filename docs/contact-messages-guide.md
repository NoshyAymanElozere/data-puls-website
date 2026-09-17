# Contact Messages & Admin Reply — Frontend Guide

This document details the contact messages fix and the new admin reply feature for the dashboard.

---

## What was fixed?

1. **Sender Name, Email & Phone**:
   - Previously, messages only stored `user_id`, omitting `name`, `email`, and `phone` on the message.
   - If a guest sent a message, `user_id` was `null` and no sender contact information was saved.
   - If a registered user sent a message, `ContactMessageUserResource` did not return `name`, and users registered with phone OTP without an email showed no email address.
   - **Fix**: Direct `name`, `email`, and `phone` columns are now persisted on `contact_messages`. If an authenticated user omits them, they are automatically populated from the user's profile.
   - The response now includes top-level `name`, `email`, and `phone` (with fallback to user attributes if null), and the nested `user` object now includes `name` alongside `email`, `phone`, and `avatar_url`.

2. **Admin Reply Ability & Real-Time Delivery (Reverb WebSocket)**:
   - Admins can now reply to any contact message directly from the dashboard via `POST /admin/contact-messages/{id}/reply`.
   - Each message tracks `reply`, `replied_at`, `replied_by`, and `replied_by_admin` (`id`, `name`, `email`).
   - Messages have an `is_replied: boolean` flag for quick status badges in the list view.
   - The list endpoint supports filtering by `?is_replied=true` or `?is_replied=false`.
   - **Real-Time Notification**:
     - When the admin submits a reply, if the sender is an authenticated app user (`user_id !== null`), a real-time notification (`AppNotification`) is dispatched immediately over **Laravel Reverb**.
     - Broadcast Channel: `private-user.{userId}`
     - Event Name: `.notification.created`
     - Type: `contact_message_replied`
     - The notification is also persisted in the database so it appears in the mobile user's notifications center (`GET /api/me/notifications`).
   - **User Inbox API**:
     - Users can view their submitted messages and read admin replies via:
       - `GET /api/me/contact-messages` (Paginated list of user's own contact messages with reply & status)
       - `GET /api/me/contact-messages/{id}` (Detail view of user's message and admin reply)

---

## Admin Route Map & Permissions

| Method | Route | Permission | Purpose |
|--------|-------|------------|---------|
| `GET` | `/admin/contact-messages` | `contact_messages.view` | Paginated message list with reply status & filters |
| `GET` | `/admin/contact-messages/{id}` | `contact_messages.view` | Show detailed message and reply thread |
| `POST` | `/admin/contact-messages/{id}/reply` | `contact_messages.reply` | Submit or update admin reply to message |
| `DELETE` | `/admin/contact-messages/{id}` | `contact_messages.delete` | Delete contact message |

---

## Endpoints Specification

### 1. GET `/admin/contact-messages` (List)

#### Query Parameters:
- `search` (optional, string): Searches in message text, sender `name`, `email`, `phone`, or linked user's name/email/phone.
- `subject_id` (optional, integer): Filter by contact subject.
- `is_replied` (optional, boolean): `true` (only replied) | `false` (only unreplied / pending).
- `created_from` (optional, date): `YYYY-MM-DD`.
- `created_to` (optional, date): `YYYY-MM-DD`.
- `per_page` (optional, integer): items per page (default: 15, max: 100).

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Contact messages retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Abdullah Al-Qahtani",
      "email": "abdullah@example.com",
      "phone": "+966501234567",
      "user_id": 5,
      "user": {
        "id": 5,
        "name": "Abdullah Al-Qahtani",
        "email": "abdullah@example.com",
        "phone": "+966501234567",
        "avatar_url": "https://..."
      },
      "subject_id": 2,
      "subject": {
        "id": 2,
        "name": "Technical Support"
      },
      "subject_name": "Technical Support",
      "message": "The app crashes when opening subscription screen.",
      "reply": "Thank you for reporting. This has been resolved in v1.2.0.",
      "is_replied": true,
      "replied_at": "2026-09-17 10:30:00",
      "created_at": "2026-09-15 09:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

> **Guest Note**: If sent by a guest (`user_id: null`), `user` is `null`, but `name`, `email`, and `phone` are populated at the top level from the contact form submission.

---

### 2. GET `/admin/contact-messages/{id}` (Detail)

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Contact messages retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Abdullah Al-Qahtani",
    "email": "abdullah@example.com",
    "phone": "+966501234567",
    "user_id": 5,
    "subject_id": 2,
    "message": "The app crashes when opening subscription screen.",
    "reply": "Thank you for reporting. This has been resolved in v1.2.0.",
    "is_replied": true,
    "replied_at": "2026-09-17 10:30:00",
    "replied_by": 1,
    "replied_by_admin": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@herz.test"
    },
    "user": {
      "id": 5,
      "name": "Abdullah Al-Qahtani",
      "email": "abdullah@example.com",
      "phone": "+966501234567",
      "avatar_url": "https://..."
    },
    "subject": {
      "id": 2,
      "name": "Technical Support"
    },
    "created_at": "2026-09-15 09:00:00",
    "updated_at": "2026-09-17 10:30:00"
  }
}
```

---

### 3. POST `/admin/contact-messages/{id}/reply` (Submit Reply)

#### Headers:
- `Accept`: `application/json`
- `Authorization`: `Bearer {admin_token}`
- `Content-Type`: `multipart/form-data` or `application/json`

#### Request Body:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reply` | string | **Yes** | Reply message text (min: 3, max: 5000 chars) |

```json
{
  "reply": "Thank you for reaching out. We have investigated the issue and resolved your inquiry."
}
```

#### Response (`200 OK`):
Returns the updated message detail resource with updated `reply`, `replied_at`, `replied_by`, `replied_by_admin`, and `is_replied: true`.

```json
{
  "success": true,
  "message": "Reply sent successfully.",
  "data": {
    "id": 1,
    "name": "Abdullah Al-Qahtani",
    "email": "abdullah@example.com",
    "phone": "+966501234567",
    "user_id": 5,
    "subject_id": 2,
    "message": "The app crashes when opening subscription screen.",
    "reply": "Thank you for reaching out. We have investigated the issue and resolved your inquiry.",
    "is_replied": true,
    "replied_at": "2026-09-17 12:15:00",
    "replied_by": 1,
    "replied_by_admin": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@herz.test"
    },
    "user": { ... },
    "subject": { ... },
    "created_at": "2026-09-15 09:00:00",
    "updated_at": "2026-09-17 12:15:00"
  }
}
```

#### Errors:
- `403 Forbidden`: If current admin role does not have `contact_messages.reply` permission.
- `422 Unprocessable Entity`: If `reply` is missing or shorter than 3 characters.

---

## UI / Dashboard Implementation Guidelines

1. **Table Columns (`/contact-messages`)**:
   - **Sender**: Display `name` (if available), fallback to `user.name`, fallback to `"Guest" / "زائر"`.
   - **Contact**: Display `email` and/or `phone`.
   - **User Link**: If `user_id` is present, render `name` as a clickable link navigating to `/users/{user_id}`.
   - **Subject**: Display `subject_name`.
   - **Message Excerpt**: Message snippet with truncation.
   - **Status Badge**:
     - `is_replied === true`: Green badge: `"Replied"` / `"تم الرد"` with tooltip showing `replied_at`.
     - `is_replied === false`: Yellow/gray badge: `"Pending"` / `"قيد الانتظار"`.
   - **Date**: Formatted `created_at`.
   - **Actions**:
     - "View" (`GET /contact-messages/:id`)
     - "Reply" (Opens reply modal if admin has `contact_messages.reply` permission)
     - "Delete" (Delete confirmation modal if admin has `contact_messages.delete` permission)

2. **Filter Tabs**:
   - `All` (no filter)
   - `Pending` (`?is_replied=false`)
   - `Replied` (`?is_replied=true`)

3. **Message Detail & Reply Box (`/contact-messages/:id`)**:
   - Display original message card with sender details (name, email, phone, avatar).
   - If `reply` exists, show the reply thread box with:
     - Admin name (`replied_by_admin.name`)
     - Reply timestamp (`replied_at`)
     - Reply body (`reply`)
     - "Edit Reply" button (can submit `POST /admin/contact-messages/{id}/reply` to overwrite/update reply).
   - If `reply` does not exist:
     - Show a textarea and "Send Reply" button.
