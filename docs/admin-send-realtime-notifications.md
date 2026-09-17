# Admin Real-Time Notifications Integration Guide

This guide provides frontend engineering teams with everything needed to integrate the **Admin Real-Time Notification Dispatch** feature on the Herz Dashboard, as well as handle real-time WebSocket delivery on user clients (Mobile App & Web).

---

## 1. Architecture & Lifecycle Overview

The Herz notification pipeline uses **dual-delivery orchestration**:
1. **Persistent Database Storage**: Notifications are written to the `notifications` table for persistent inbox storage.
2. **Instant WebSocket Broadcast (Laravel Reverb)**: Dispatched immediately to the recipient's private WebSocket channel (`private-user.{userId}`) with event `.notification.created`.

```
┌─────────────────────────┐
│     Admin Dashboard     │
│   (React / TypeScript)  │
└────────────┬────────────┘
             │ POST /admin/notifications/send
             ▼
┌─────────────────────────┐
│      Herz Backend       │
│ (Laravel Reverb Server) │
└──────┬────────────┬─────┘
       │            │
       │ Store DB   │ Broadcast WebSocket
       ▼            ▼
┌──────────────┐  ┌────────────────────────────────────────────────────────┐
│ notifications│  │ Laravel Reverb WebSocket Engine (Port 8080/443/5174)  │
│  (Database)  │  │ Channel: private-user.{userId}                        │
└──────┬───────┘  │ Event: .notification.created                         │
       │          └───────────────────────────┬────────────────────────────┘
       │                                      │
       │ GET /api/me/notifications            │ Instant Push
       ▼                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          User Client (Mobile / Web)                      │
│                (Immediate Banner + In-App Notification Bell)             │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Admin Dashboard Endpoints

### 2.1 Send Notification Endpoint

| Method | Path | Permission Required | Content-Type |
|--------|------|---------------------|--------------|
| `POST` | `/admin/notifications/send` | `notification_logs.create` | `multipart/form-data` or `application/json` |
| `POST` | `/admin/notification-logs` | `notification_logs.create` | *(RESTful alias, identical behavior)* |

#### Headers
```http
Authorization: Bearer {admin_token}
Accept: application/json
Content-Type: multipart/form-data
```

#### Request Parameters

| Parameter | Type | Required | Default | Description & Allowed Values |
|---|---|---|---|---|
| `target_type` | string | **Yes** | — | Target audience: `all` \| `single` |
| `user_id` | integer | Conditional | `null` | Required when `target_type` is `single`. Must exist in `users` table. |
| `title` | string \| object | **Yes** | — | Notification title. Can be a string or bilingual object `{ "en": "...", "ar": "..." }` or form-data fields `title[en]` and `title[ar]`. |
| `body` | string \| object | **Yes** | — | Notification message body. Can be a string or bilingual object `{ "en": "...", "ar": "..." }` or form-data fields `body[en]` and `body[ar]`. |
| `type` | string | Optional | `general` | Notification category: `general` \| `system` \| `subscription` \| `payment` \| `happy_birthday` \| `first_invoice_created` \| `invoice_created` \| `subscription_created` \| `subscription_renewed` \| `subscription_expiring_soon` \| `subscription_overdue` \| `warranty_expiring` \| `warranty_expired` \| `invoice_analyzed` \| `family_member_joined` |
| `icon` | string | Optional | `fa-solid fa-bell` | Font Awesome 6 icon class (e.g. `fa-solid fa-bell`, `fa-solid fa-bullhorn`, `fa-solid fa-crown`, `fa-solid fa-triangle-exclamation`). |
| `icon_bg_color` | string | Optional | `#6B7280` | Hex badge color (e.g. `#6B7280`, `#3B82F6`, `#10B981`, `#EF4444`, `#8B5CF6`). |
| `action_type` | string | Optional | `null` | Deep link target category: `invoice` \| `subscription` \| `warranty` \| `custom` |
| `action_id` | integer | Optional | `null` | Related entity ID (e.g. `invoice_id`, `package_id`). |
| `action_url` | string | Optional | `null` | Target URL or web redirect link. |
| `data` | object | Optional | `null` | Key-value extra metadata dictionary. |

---

### 2.2 Single User Request Example (`target_type: single`)

#### Form-Data Payload
```ini
target_type=single
user_id=42
title[en]=System Maintenance Tonight
title[ar]=صيانة مجدولة للنظام الليلة
body[en]=The platform will be undergoing scheduled updates from 02:00 AM to 03:00 AM.
body[ar]=ستتم ترقية النظام وإجراء صيانة مجدولة من الساعة 02:00 إلى 03:00 صباحاً.
type=general
icon=fa-solid fa-wrench
icon_bg_color=#F59E0B
action_type=custom
action_url=https://herz.app/maintenance-notice
```

#### JSON Payload Equivalent
```json
{
  "target_type": "single",
  "user_id": 42,
  "title": {
    "en": "System Maintenance Tonight",
    "ar": "صيانة مجدولة للنظام الليلة"
  },
  "body": {
    "en": "The platform will be undergoing scheduled updates from 02:00 AM to 03:00 AM.",
    "ar": "ستتم ترقية النظام وإجراء صيانة مجدولة من الساعة 02:00 إلى 03:00 صباحاً."
  },
  "type": "general",
  "icon": "fa-solid fa-wrench",
  "icon_bg_color": "#F59E0B",
  "action_type": "custom",
  "action_url": "https://herz.app/maintenance-notice"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "7b0a5f78-29bf-4882-9351-4043fbbce042",
    "type": "general",
    "type_label": "General",
    "title": "System Maintenance Tonight",
    "body": "The platform will be undergoing scheduled updates from 02:00 AM to 03:00 AM.",
    "icon": "fa-solid fa-wrench",
    "icon_bg_color": "#F59E0B",
    "action_type": "custom",
    "action_id": null,
    "action_url": "https://herz.app/maintenance-notice",
    "data": {},
    "is_read": false,
    "read_at": null,
    "created_at": "2026-09-15 15:45:00",
    "user": {
      "id": 42,
      "name": "Tariq Al-Harbi",
      "phone": "0501234567",
      "email": "tariq@example.com"
    }
  },
  "message": "Notification sent successfully."
}
```

---

### 2.3 Broadcast to All Users (`target_type: all`)

#### Form-Data Payload
```ini
target_type=all
title[en]=Special Promotion: 25% Off Annual Plans!
title[ar]=عرض خاص: خصم 25% على الباقات السنوية!
body[en]=Upgrade your package today to unlock family sharing and unlimited warranty logs.
body[ar]=قم بترقية باقتك اليوم للاستفادة من مشاركة العائلة وتتبع الضمان اللامحدود.
type=subscription
icon=fa-solid fa-crown
icon_bg_color=#8B5CF6
action_type=subscription
action_id=2
action_url=https://herz.app/packages
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "target_type": "all",
    "recipients_count": 1250,
    "type": "subscription",
    "title": "Special Promotion: 25% Off Annual Plans!",
    "body": "Upgrade your package today to unlock family sharing and unlimited warranty logs."
  },
  "message": "Notifications sent successfully to 1250 users."
}
```

---

### 2.4 User Selection Autocomplete Helper

When the dashboard admin chooses `target_type: single`, use the existing users endpoint to power a live searchable dropdown:

`GET /admin/users?search={query}&status=active&per_page=20`

Response items provide:
- `id`: Recipient `user_id`
- `name`: Display name
- `phone`: Mobile phone
- `avatar_url`: User avatar thumbnail

---

## 3. Real-Time Reverb WebSocket Specification

When a notification is dispatched, Laravel Reverb pushes an event in real-time.

### 3.1 Connection Configuration

| Setting | Value | Source |
|---|---|---|
| **Broadcaster** | `reverb` | Laravel Reverb driver |
| **Host** | `window.location.hostname` / `config.reverbHost` | `REVERB_HOST` |
| **Port** | `443` (prod) / `8080` (dev) | `REVERB_PORT` |
| **Force TLS** | `true` in production (`https`) | `REVERB_SCHEME` |
| **Auth Endpoint** | `/broadcasting/auth` | User Sanctum authentication |

### 3.2 Private Channel & Event Name

- **Private Channel**: `private-user.{userId}`  
  *(When using Laravel Echo, pass without `private-`: `echo.private('user.' + userId)`)*
- **Event Name**: `.notification.created`  
  *(Note the leading dot `.` required by Laravel Echo)*

### 3.3 Real-Time WebSocket Payload Structure

When `.notification.created` fires, the client callback receives this payload:

```json
{
  "id": "7b0a5f78-29bf-4882-9351-4043fbbce042",
  "type": "general",
  "type_label": "General",
  "title": "System Maintenance Tonight",
  "body": "The platform will be undergoing scheduled updates from 02:00 AM to 03:00 AM.",
  "icon": "fa-solid fa-wrench",
  "icon_bg_color": "#F59E0B",
  "action_type": "custom",
  "action_id": null,
  "action_url": "https://herz.app/maintenance-notice",
  "data": {},
  "is_read": false,
  "read_at": null,
  "created_at": "2026-09-15T15:45:00+03:00",
  "created_at_human": "1 second ago"
}
```

---

## 4. Frontend Code Snippets

### 4.1 Admin Dashboard: React Mutation Hook

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface SendNotificationPayload {
  target_type: 'all' | 'single';
  user_id?: number | null;
  title: {
    en: string;
    ar: string;
  };
  body: {
    en: string;
    ar: string;
  };
  type?: string;
  icon?: string;
  icon_bg_color?: string;
  action_type?: string;
  action_id?: number | null;
  action_url?: string | null;
}

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendNotificationPayload) => {
      const formData = new FormData();
      formData.append('target_type', payload.target_type);

      if (payload.target_type === 'single' && payload.user_id) {
        formData.append('user_id', String(payload.user_id));
      }

      formData.append('title[en]', payload.title.en);
      formData.append('title[ar]', payload.title.ar);
      formData.append('body[en]', payload.body.en);
      formData.append('body[ar]', payload.body.ar);

      if (payload.type) formData.append('type', payload.type);
      if (payload.icon) formData.append('icon', payload.icon);
      if (payload.icon_bg_color) formData.append('icon_bg_color', payload.icon_bg_color);
      if (payload.action_type) formData.append('action_type', payload.action_type);
      if (payload.action_id) formData.append('action_id', String(payload.action_id));
      if (payload.action_url) formData.append('action_url', payload.action_url);

      const res = await axios.post('/admin/notifications/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onSuccess: () => {
      // Invalidate audit logs table
      queryClient.invalidateQueries({ queryKey: ['admin', 'notification-logs'] });
    },
  });
}
```

---

### 4.2 Web Client / Mobile Web: Listening via Laravel Echo

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

export function initializeRealtimeNotifications(userToken: string, userId: number) {
  const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || window.location.hostname,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 443),
    forceTLS: process.env.NODE_ENV === 'production',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
      },
    },
  });

  // Subscribe to user's private channel
  echo.private(`user.${userId}`)
    .listen('.notification.created', (notification: any) => {
      console.log('Real-time notification received:', notification);

      // 1. Show in-app banner / toast
      showToast({
        title: notification.title,
        message: notification.body,
        icon: notification.icon,
        iconColor: notification.icon_bg_color,
        actionUrl: notification.action_url,
      });

      // 2. Increment unread counter badge in header
      incrementUnreadNotificationBadge();
    });

  return echo;
}
```

---

### 4.3 Flutter Client: Subscribing to Private Channel

```dart
import 'package:laravel_echo/laravel_echo.dart';
import 'package:pusher_client/pusher_client.dart';

class NotificationSocketService {
  late Echo echo;

  void init({required String token, required int userId}) {
    PusherOptions options = PusherOptions(
      host: 'api.herz.app',
      port: 443,
      encrypted: true,
      auth: PusherAuth(
        'https://api.herz.app/broadcasting/auth',
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ),
    );

    PusherClient pusher = PusherClient('herz_reverb_key', options, enableLogging: true);

    echo = Echo(
      client: pusher,
      broadcaster: EchoBroadcasterType.Pusher,
    );

    echo.private('user.$userId')
      .listen('.notification.created', (Map<String, dynamic>? data) {
        if (data != null) {
          handleIncomingNotification(data);
        }
      });
  }

  void handleIncomingNotification(Map<String, dynamic> payload) {
    // Trigger local push notification banner
    LocalNotificationManager.show(
      title: payload['title'] ?? '',
      body: payload['body'] ?? '',
      payload: payload['action_url'],
    );
  }
}
```

---

## 5. Offline Sync & Read Acknowledgments

- **Offline Synchronization**: If the client is disconnected when a notification is dispatched, it is stored in the database. When the app resumes or comes online, fetch the inbox via:
  - `GET /api/me/notifications?page=1&per_page=15`
  - `GET /api/me/notifications/unread-count`
- **Mark as Read**:
  - Single: `PATCH /api/me/notifications/{id}/read`
  - All: `PATCH /api/me/notifications/read-all`

---

## 6. Admin Audit Logs Verification

Every notification sent via the admin dashboard is audited in the notification logs:
- `GET /admin/notification-logs`: Lists dispatched notifications with filters (`user_id`, `type`, `date_from`, `date_to`, `search`).
- `GET /admin/notification-logs/{id}`: Full detail with recipient info.
- `DELETE /admin/notification-logs/{id}`: Remove log entry.
