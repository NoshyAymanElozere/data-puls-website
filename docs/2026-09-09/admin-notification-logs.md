# Admin Notification Logs API

## 1. Overview
The Sent Notification Logs endpoint allows administrators with `notification_logs.view` permission to monitor, audit, and troubleshoot notifications dispatched to users across the entire platform.

---

## 2. Endpoints

### 2.1 List Sent Notification Logs
`GET /admin/notification-logs`

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_id` | integer | Optional | Filter by recipient user ID |
| `type` | string | Optional | Filter by notification type key (e.g. `happy_birthday`, `first_invoice_created`) |
| `is_read` | boolean | Optional | Filter by read status (`true` / `false` / `1` / `0`) |
| `date_from` | date | Optional | Filter start date (`YYYY-MM-DD`) |
| `date_to` | date | Optional | Filter end date (`YYYY-MM-DD`) |
| `search` | string | Optional | Search query matching recipient name, phone, email, or message content |
| `page` | integer | Optional | Page number (default: 1) |
| `per_page` | integer | Optional | Items per page (default: 15, max: 100) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "user_id": 42,
      "user_name": "Tariq Al-Harbi",
      "user_phone": "0501234567",
      "type": "happy_birthday",
      "type_label": "Happy Birthday",
      "title": "Happy Birthday, Tariq! 🎂",
      "body": "Wishing you a wonderful birthday filled with happiness and health!",
      "icon": "fa-solid fa-cake-candles",
      "icon_bg_color": "#EC4899",
      "is_read": true,
      "read_at": "2026-09-14 10:30:15",
      "created_at": "2026-09-14 09:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  },
  "message": "Notifications retrieved successfully."
}
```

---

### 2.2 Show Sent Notification Detail
`GET /admin/notification-logs/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "type": "first_invoice_created",
    "type_label": "First Invoice Created",
    "title": "Your first invoice has been created! 🎉",
    "body": "Congratulations on adding your first invoice for Jarir Bookstore!",
    "icon": "fa-solid fa-receipt",
    "icon_bg_color": "#10B981",
    "action_type": "invoice",
    "action_id": 105,
    "action_url": null,
    "data": {
      "store_name": "Jarir Bookstore",
      "invoice_number": "INV-105",
      "total_amount": "500.00"
    },
    "is_read": false,
    "read_at": null,
    "created_at": "2026-09-14 11:20:00",
    "user": {
      "id": 42,
      "name": "Tariq Al-Harbi",
      "phone": "0501234567",
      "email": "tariq@example.com"
    }
  },
  "message": "Notifications retrieved successfully."
}
```

---

### 2.3 Delete Notification Log
`DELETE /admin/notification-logs/{id}`
*(Requires `notification_logs.delete` permission)*

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Notification deleted successfully."
}
```
