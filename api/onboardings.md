# Onboardings API (Admin)

| Property | Value |
|----------|-------|
| API base path | `/admin/onboardings` |
| Auth | Protected (`auth:sanctum`, `admin`, `locale`) |
| Localization | `Accept-Language: en` \| `ar` |

Admin management endpoints for Mobile App Onboarding screens / slides.

## Permissions

| Action | Permission |
|--------|------------|
| List / View detail | `onboardings.view` |
| Create | `onboardings.create` |
| Update / Toggle Status | `onboardings.update` |
| Delete | `onboardings.delete` |

---

## 1. GET /admin/onboardings

List paginated onboarding screens with optional search and status filter.

### Query parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `search` | string | no | Search title or description across locales |
| `is_active` | boolean | no | `true` \| `false` |
| `page` | integer | no | Page number (default: 1) |
| `per_page` | integer | no | Items per page (default: 15, max: 100) |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Onboarding retrieved successfully.",
  "data": [
    {
      "id": 1,
      "title": "Welcome to Herz",
      "description": "Your smart companion for healthy intermittent fasting and wellness tracking.",
      "is_active": true,
      "sort_order": 1,
      "image_url": "https://example.com/storage/1/slide1.png",
      "created_at": "2026-09-03 10:00:00",
      "updated_at": "2026-09-03 10:00:00"
    }
  ],
  "links": {
    "first": "https://example.com/admin/onboardings?page=1",
    "last": "https://example.com/admin/onboardings?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "path": "https://example.com/admin/onboardings",
    "per_page": 15,
    "to": 1,
    "total": 1
  }
}
```

---

## 2. POST /admin/onboardings

Create a new onboarding slide. Accepts `multipart/form-data`.

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title[en]` | string | no | max:200 | English title |
| `title[ar]` | string | no | max:200 | Arabic title |
| `description[en]` | string | yes | max:5000 | English description |
| `description[ar]` | string | yes | max:5000 | Arabic description |
| `sort_order` | integer | no | min:0 | Display order |
| `is_active` | boolean | no | boolean | Status flag |
| `image` | file | no | image, max:2048 KB | Uploaded slide image |

### Response `201 Created`

```json
{
  "success": true,
  "message": "Onboarding created successfully.",
  "data": {
    "id": 2,
    "title": "Personalized Fasting Plans",
    "description": "Choose from flexible fasting schedules tailored to your lifestyle.",
    "is_active": true,
    "sort_order": 2,
    "image_url": "https://example.com/storage/2/slide2.png",
    "created_at": "2026-09-03 10:05:00",
    "updated_at": "2026-09-03 10:05:00"
  }
}
```

---

## 3. GET /admin/onboardings/{id}

Retrieve single onboarding screen detail with full translations (`{ en, ar }`).

### Response `200 OK`

```json
{
  "success": true,
  "message": "Onboarding retrieved successfully.",
  "data": {
    "id": 1,
    "title": {
      "en": "Welcome to Herz",
      "ar": "مرحبًا بك في حرز"
    },
    "description": {
      "en": "Your smart companion for healthy intermittent fasting and wellness tracking.",
      "ar": "رفيقك الذكي لممارسة الصيام المتقطع وتتبع صحتك وعافيتك اليومية."
    },
    "is_active": true,
    "sort_order": 1,
    "image_url": "https://example.com/storage/1/slide1.png",
    "created_at": "2026-09-03 10:00:00",
    "updated_at": "2026-09-03 10:00:00"
  }
}
```

---

## 4. POST /admin/onboardings/{id} (with `_method=PUT`)

Update an existing onboarding screen. When sending files, use `multipart/form-data` and include `_method=PUT`.

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `_method` | string | yes | `PUT` | Method spoofing |
| `title[en]` | string | no | max:200 | English title |
| `title[ar]` | string | no | max:200 | Arabic title |
| `description[en]` | string | no | max:5000 | English description |
| `description[ar]` | string | no | max:5000 | Arabic description |
| `sort_order` | integer | no | min:0 | Display order |
| `is_active` | boolean | no | boolean | Status flag |
| `image` | file | no | image, max:2048 KB | New image replacement |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Onboarding updated successfully.",
  "data": {
    "id": 1,
    "title": "Welcome to Herz (Updated)",
    "description": "Your smart companion for healthy intermittent fasting and wellness tracking.",
    "is_active": true,
    "sort_order": 1,
    "image_url": "https://example.com/storage/3/new-slide1.png",
    "created_at": "2026-09-03 10:00:00",
    "updated_at": "2026-09-03 10:10:00"
  }
}
```

---

## 5. PATCH /admin/onboardings/{id}/status

Toggle active status (`is_active`).

### Response `200 OK`

```json
{
  "success": true,
  "message": "Onboarding status updated successfully.",
  "data": {
    "id": 1,
    "title": "Welcome to Herz",
    "description": "Your smart companion for healthy intermittent fasting and wellness tracking.",
    "is_active": false,
    "sort_order": 1,
    "image_url": "https://example.com/storage/1/slide1.png",
    "created_at": "2026-09-03 10:00:00",
    "updated_at": "2026-09-03 10:15:00"
  }
}
```

---

## 6. DELETE /admin/onboardings/{id}

Delete an onboarding slide.

### Response `204 No Content`
