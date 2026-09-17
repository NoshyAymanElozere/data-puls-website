# Admin Notification Settings — Flow & Implementation Guide

## 1. Overview & Objectives
Per the core specifications in `prompt.md`, the **Admin Notification Settings** module provides administrators with complete central control over the application's automated notification engine.

Administrators can:
1. **Customize bilingual message templates:** Control title and body content in both Arabic (`ar`) and English (`en`) for every event type.
2. **Configure visual branding per notification:** Set Font Awesome 6 icons and Hex background badge colors.
3. **Configure timing parameters:** Set advance reminder lead days (`days_before`) for expiring subscriptions.
4. **Toggle event activation (`is_active`):** Instantly enable or disable any notification type system-wide via a dedicated toggle endpoint.
5. **Audit sent notifications:** Track every dispatched notification via the Admin Notification Logs module.

---

## 2. End-to-End System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN DASHBOARD                                  │
│                                                                             │
│  [List Templates] ──► [Inline is_active Toggle] (PATCH .../status)         │
│         │                                                                   │
│         ▼                                                                   │
│  [Click Edit] ──────► [Edit Drawer / Modal] (GET .../{id} via forShow())   │
│                             │                                               │
│                             ▼                                               │
│                       [Save Changes] (PUT .../{id})                         │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │   notification_settings  │
                        │      Database Table      │
                        └─────────────┬────────────┘
                                      │
   ┌──────────────────────────────────┴──────────────────────────────────┐
   │                                                                     │
   ▼                                                                     ▼
[EVENT TRIGGER: REAL-TIME]                                   [EVENT TRIGGER: TIME-BASED QUEUE]
- First invoice created                                      - Happy birthday (today)
- Subsequent invoices created                                - Subscription expiring (in X days)
- Subscription confirmed                                     - Subscription overdue (late renewal)
- Subscription renewed                                       (Dispatched daily at 09:00 AM)
   │                                                                     │
   └──────────────────────────────────┬──────────────────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │      NotificationDispatcherService     │
                  ├────────────────────────────────────────┤
                  │ 1. Check setting->is_active === true   │
                  │    (If false: immediately abort)       │
                  │ 2. Resolve recipient locale (ar / en)  │
                  │ 3. Interpolate tokens: {user_name},... │
                  │ 4. Attach icon & hex background color  │
                  │ 5. Save to database notifications table│
                  │ 6. Broadcast event over Laravel Reverb │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │    Laravel Reverb Server     │
                       │         (Port 5174)          │
                       └──────────────┬───────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │  Mobile / Web Echo Client    │
                       │    private-user.{user_id}    │
                       │    .notification.created     │
                       └──────────────────────────────┘
```

---

## 3. Supported Events & Configuration Catalog

As defined in `prompt.md`, all core notification types are pre-seeded and dynamically configurable:

| Event Key | Trigger Source & Timing | Configurable Tokens | Admin Configurable Fields |
|---|---|---|---|
| `happy_birthday` | Daily scheduled queue job at 09:00 AM when user's `date_of_birth` matches today | `{user_name}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `first_invoice_created` | Triggered immediately when user saves their very first invoice | `{store_name}`, `{invoice_number}`, `{total_amount}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `invoice_created` | Triggered immediately when user creates any subsequent invoice | `{store_name}`, `{invoice_number}`, `{total_amount}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `subscription_created` | Triggered immediately upon payment confirmation of an initial subscription | `{package_name}`, `{ends_at}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `subscription_renewed` | Triggered immediately upon payment confirmation of a subscription renewal | `{package_name}`, `{ends_at}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `subscription_expiring_soon` | Daily scheduled queue job when subscription expires in $X$ days | `{package_name}`, `{days}`, `{ends_at}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `days_before`, `is_active` |
| `subscription_overdue` | Daily scheduled queue job when user's subscription expired without renewal | `{package_name}`, `{ends_at}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `warranty_expiring` | Daily scheduled queue job when product warranty expires in $X$ days | `{product_name}`, `{days}`, `{expiry_date}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `days_before`, `is_active` |
| `warranty_expired` | Daily scheduled queue job when product warranty expires | `{product_name}`, `{expiry_date}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `invoice_analyzed` | Triggered immediately when OCR / AI analysis of an invoice completes | `{invoice_number}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `family_member_joined` | Triggered immediately when an invitee accepts and joins family account | `{member_name}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |
| `general` | Manual or administrative announcements | `{message}` | `title[ar]`, `title[en]`, `body[ar]`, `body[en]`, `icon`, `icon_bg_color`, `is_active` |

---

## 4. Admin Dashboard UI & User Flow

### 4.1 Screen 1: Notification Settings List Table
- **Route:** `/admin/notification-settings`
- **Required Permission:** `notification_settings.view`
- **Features & UI Elements:**
  1. **Table Columns:**
     - **Event / Key:** Localized title and slug key (`happy_birthday`, `first_invoice_created`, etc.).
     - **Icon & Badge Color:** Preview of the Font Awesome icon inside its colored badge container.
     - **Localized Previews:** Current locale preview of title and body with placeholders.
     - **Parameters:** Displays extra configurations, such as `days_before: 3` for expiring subscriptions.
     - **Status Toggle (`is_active`):** Interactive switch component. Toggling sends an immediate `PATCH /admin/notification-settings/{id}/status` request with optimistic UI update.
     - **Actions:** "Edit Template" button opening the edit drawer/modal.

### 4.2 Screen 2: Edit Notification Template Drawer / Modal
- **Trigger:** Clicking "Edit" on a setting row.
- **Data Fetch:** `GET /admin/notification-settings/{id}` (uses `NotificationSettingDetailResource::forShow()` returning `{ "en": "...", "ar": "..." }`).
- **Required Permission:** `notification_settings.update`
- **Form Controls:**
  1. **Bilingual Title Tabs / Fields:**
     - Arabic Title (`title[ar]`): Text input.
     - English Title (`title[en]`): Text input.
  2. **Bilingual Body Fields:**
     - Arabic Body (`body[ar]`): Textarea with placeholder insertion chips.
     - English Body (`body[en]`): Textarea with placeholder insertion chips.
  3. **Placeholder Chips Cheatsheet:** Clickable chips for supported dynamic tokens (e.g. `{user_name}`, `{package_name}`, `{days}`, `{ends_at}`) that automatically insert at the cursor position.
  4. **Visual Branding:**
     - Font Awesome Icon Class (`icon`): Input field (e.g. `fa-solid fa-cake-candles`) with live icon preview.
     - Hex Color Picker (`icon_bg_color`): Color picker component with hex input (e.g. `#EC4899`, validated by regex `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`).
  5. **Timing Parameters (Conditional):**
     - Lead Days (`days_before`): Number input shown **only** for `subscription_expiring_soon` and `warranty_expiring` (e.g. 3 days before expiration).
  6. **Active Switch:**
     - `is_active` toggle switch.
- **Form Submission:** Dispatches `POST /admin/notification-settings/{id}` with `_method: PUT` in `multipart/form-data`.

---

## 5. Detailed API Contract & Endpoints

### 5.1 List All Notification Settings
`GET /admin/notification-settings`

**Headers:**
```http
Authorization: Bearer {admin_token}
Accept: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "happy_birthday",
      "name": "Happy Birthday",
      "title": "Happy Birthday, {user_name}! 🎂",
      "body": "Wishing you a wonderful birthday filled with happiness and health! Enjoy your special day.",
      "icon": "fa-solid fa-cake-candles",
      "icon_bg_color": "#EC4899",
      "is_active": true,
      "channels": ["database", "broadcast"],
      "config": null,
      "sort_order": 1,
      "created_at": "2026-09-14 10:00:00",
      "updated_at": "2026-09-14 10:00:00"
    },
    {
      "id": 6,
      "key": "subscription_expiring_soon",
      "name": "Subscription Expiring Soon",
      "title": "Subscription expires in {days} days ⏳",
      "body": "Your {package_name} subscription will end on {ends_at}. Renew now to keep all your family features and warranty tracking active.",
      "icon": "fa-solid fa-clock",
      "icon_bg_color": "#F59E0B",
      "is_active": true,
      "channels": ["database", "broadcast"],
      "config": {
        "days_before": 3
      },
      "sort_order": 6,
      "created_at": "2026-09-14 10:00:00",
      "updated_at": "2026-09-14 10:00:00"
    }
  ],
  "message": "Notification settings retrieved successfully."
}
```

---

### 5.2 Show Single Setting (Bilingual Edit Object)
`GET /admin/notification-settings/{id}`

Returns translatable fields formatted as structured `{ "en": "...", "ar": "..." }` objects via `forShow()`.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "key": "subscription_expiring_soon",
    "name": {
      "en": "Subscription Expiring Soon",
      "ar": "قرب انتهاء الاشتراك"
    },
    "title": {
      "en": "Subscription expires in {days} days ⏳",
      "ar": "ينتهي اشتراكك خلال {days} أيام ⏳"
    },
    "body": {
      "en": "Your {package_name} subscription will end on {ends_at}. Renew now to keep all your family features and warranty tracking active.",
      "ar": "سينتهي اشتراكك في باقة {package_name} بتاريخ {ends_at}. بادر بالتجديد الآن للاحتفاظ بكافة الميزات ومتابعة الضمان."
    },
    "icon": "fa-solid fa-clock",
    "icon_bg_color": "#F59E0B",
    "is_active": true,
    "channels": ["database", "broadcast"],
    "config": {
      "days_before": 3
    },
    "sort_order": 6,
    "created_at": "2026-09-14 10:00:00",
    "updated_at": "2026-09-14 10:00:00"
  },
  "message": "Notification settings retrieved successfully."
}
```

---

### 5.3 Update Notification Template & Visuals
`POST /admin/notification-settings/{id}`
*(Method Spoofing: `_method: PUT` in `multipart/form-data`)*

**Request Fields:**
| Field | Type | Required | Description |
|---|---|---|---|
| `_method` | string | Yes | Must be `PUT` |
| `title[en]` | string | Optional | English notification title (max 255) |
| `title[ar]` | string | Optional | Arabic notification title (max 255) |
| `body[en]` | string | Optional | English notification message body (max 2000) |
| `body[ar]` | string | Optional | Arabic notification message body (max 2000) |
| `icon` | string | Optional | Font Awesome icon class (e.g. `fa-solid fa-cake-candles`) |
| `icon_bg_color` | string | Optional | Hex color code matching `/^#([A-Fa-f0-9]{6}\|[A-Fa-f0-9]{3})$/` |
| `days_before` | integer | Optional | Lead days before expiration (min: 1, max: 60) |
| `is_active` | boolean | Optional | `true` or `false` (`"true"`, `"false"`, `1`, `0`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "key": "subscription_expiring_soon",
    "name": "قرب انتهاء الاشتراك",
    "title": "ينتهي اشتراكك خلال 3 أيام ⏳",
    "body": "سينتهي اشتراكك في باقة الذهبية بتاريخ 2026-09-17.",
    "icon": "fa-solid fa-clock",
    "icon_bg_color": "#F59E0B",
    "is_active": true,
    "channels": ["database", "broadcast"],
    "config": {
      "days_before": 3
    },
    "sort_order": 6,
    "created_at": "2026-09-14 10:00:00",
    "updated_at": "2026-09-14 11:30:00"
  },
  "message": "Notification setting updated successfully."
}
```

---

### 5.4 Dedicated Status Toggle Endpoint
`POST /admin/notification-settings/{id}/status`
*(Method Spoofing: `_method: PATCH` in `multipart/form-data`)*

Used for instant toggle switches on the table row without opening the full edit form.

**Request Fields:**
| Field | Type | Required | Description |
|---|---|---|---|
| `_method` | string | Yes | Must be `PATCH` |
| `is_active` | boolean | Yes | `true` or `false` (`"true"`, `"false"`, `1`, `0`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "happy_birthday",
    "is_active": false,
    "name": "عيد ميلاد سعيد",
    "title": "عيد ميلاد سعيد، {user_name}! 🎂",
    "icon": "fa-solid fa-cake-candles",
    "icon_bg_color": "#EC4899"
  },
  "message": "Notification setting status updated successfully."
}
```

---

## 6. Business Logic, Edge Cases & Verification

1. **Immediate Delivery Suppression:** When an administrator toggles `is_active` to `false`:
   - Neither a database notification record nor a Reverb WebSocket broadcast will be generated for that event.
   - The scheduled queue jobs (`SendBirthdayNotificationsJob`, etc.) will cleanly skip dispatching when `is_active` is `false`.
2. **Dynamic Interpolation Safety:**
   - If an admin edits a template and omits dynamic placeholder tokens (e.g. `{user_name}`), the system will safely render the static text without errors.
   - Tokens are case-sensitive and match exactly what is defined in the Catalog.
3. **Hex Color Code Validation:**
   - Any hex color input must start with `#` and contain either 3 or 6 valid hexadecimal characters (`/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`).
4. **Form-Data Boolean Normalization:**
   - Requests arriving from HTML forms or `FormData` pass booleans as strings (`"true"`, `"false"`, `"1"`, `"0"`).
   - Form Requests (`UpdateNotificationSettingRequest` and `UpdateNotificationSettingStatusRequest`) automatically normalize booleans in `prepareForValidation()` via `filter_var($value, FILTER_VALIDATE_BOOLEAN)`.
5. **Role & Permission Access Control:**
   - Read-only admins can only view settings (`notification_settings.view`).
   - Only admins with `notification_settings.update` can alter templates or toggle `is_active`.
   - Unauthorized requests return HTTP 403 Forbidden.
