# Dashboard & Reports API Requirements Specification

This document defines the backend API contracts, endpoints, query parameters, data models, and JSON payload structures required by the backend (Laravel) to power the **Dashboard** and **Reports** pages according to the project modules.

---

## 1. Overview & Project Module Mapping

The admin dashboard aggregates data across multiple core project modules. The backend endpoints described here source their metrics from the following modules:

| Dashboard / Report Component | Sourced Project Module | Primary Backend Model(s) |
|------------------------------|------------------------|---------------------------|
| Travel Packages KPI & Featured List | `subscription-packages` / `categories` | `SubscriptionPackage`, `Category` |
| Tourist Destinations & Attractions | `warranty-periods` / Location Catalogs | `Destination`, `Attraction`, `Country`, `City` |
| Total Bookings & Booking Growth | `users` / Subscriptions | `User`, `Subscription`, `Invoice` |
| Financial Growth & Sales | `users` / `user-invoices` | `Invoice`, `Payment` |
| Category Share Distribution | `categories` | `Category`, `SubscriptionPackage` |
| Team Collaboration | `users` (Staff/Admins) | `Admin`, `TeamMemberTask` |
| Meeting Reminders | `notifications` / Calendar | `MeetingReminder`, `Notification` |
| Time Tracker | Dashboard Utility | `TimeLog` |

---

## 2. Base Configuration & Global Conventions

| Property | Value |
|----------|-------|
| Base URL | `{VITE_API_URL}` (e.g., `https://herz-dashboard.am.prompita.com/admin`) |
| Auth Middleware | `auth:sanctum` (Admin Bearer Token) |
| Headers Required | `Authorization: Bearer {token}`, `Accept: application/json`, `Accept-Language: en\|ar` |
| Content-Type | `application/json` (unless uploading files via `multipart/form-data`) |

### Standard Response Envelopes

**Single Resource / Metric Payload:**
```json
{
  "success": true,
  "message": "Data retrieved successfully.",
  "data": { }
}
```

**Paginated Collection / List:**
```json
{
  "success": true,
  "message": "Data retrieved successfully.",
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "last_page": 1,
    "total": 42
  },
  "links": {
    "first": "https://...",
    "last": "https://...",
    "prev": null,
    "next": null
  }
}
```

**Validation Error Envelope (422 Unprocessable Content):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "start_date": ["The start_date field must be a valid date after 2020-01-01."]
  }
}
```

---

## 3. Dashboard Page API Specification

The Dashboard page requires aggregated statistics, progress charts, collaboration items, reminders, and featured packages.

### 3.1 Overview of Dashboard Endpoints

| Method | Path | Required Permission | Description |
|--------|------|---------------------|-------------|
| GET | `/admin/dashboard/stats` | `dashboard.view` | Overall KPI summary cards |
| GET | `/admin/dashboard/analytics` | `dashboard.view` | Analytics chart (weekly/monthly pill chart) |
| GET | `/admin/dashboard/team-collaboration` | `dashboard.view` | Team collaboration member activity |
| POST | `/admin/dashboard/team-collaboration` | `dashboard.manage` | Assign/Add team member task |
| GET | `/admin/dashboard/reminders` | `dashboard.view` | Upcoming meetings and reminders |
| GET | `/admin/dashboard/featured-packages` | `dashboard.view` | Featured packages list |
| GET | `/admin/dashboard/progress-gauge` | `dashboard.view` | Project / completion progress gauge data |
| GET | `/admin/dashboard/time-tracker` | `dashboard.view` | Current active time tracking status |
| POST | `/admin/dashboard/time-tracker/log` | `dashboard.manage` | Log completed time session |
| POST | `/admin/dashboard/import` | `dashboard.import` | Bulk import data payload |
| GET | `/admin/dashboard/export` | `dashboard.export` | Export dashboard report summary |

---

### 3.2 Endpoint Specifications — Dashboard

#### GET `/admin/dashboard/stats`

Returns aggregated KPI summary metrics displayed in the top card row.

**Query Parameters:**
- `period` *(optional, string)*: `this_month` | `last_month` | `this_year` (Default: `this_month`).

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully.",
  "data": {
    "travel_packages": {
      "total": 48,
      "change_percentage": 12.0,
      "change_direction": "increase",
      "subtitle": "increased from last month"
    },
    "tourist_destinations": {
      "total": 18,
      "status": "Active",
      "countries_count": 5,
      "subtitle": "Across 5 Countries"
    },
    "tourist_attractions": {
      "total": 124,
      "change_percentage": 8.0,
      "change_direction": "increase",
      "subtitle": "New attractions added"
    },
    "total_bookings": {
      "total": 1842,
      "change_percentage": 18.2,
      "change_direction": "increase",
      "subtitle": "increased from last month"
    }
  }
}
```

---

#### GET `/admin/dashboard/analytics`

Provides bar/pill chart analytics data broken down by day or month.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | no | `weekly` | Allowed: `weekly`, `monthly`, `yearly` |

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Analytics fetched successfully.",
  "data": {
    "period": "weekly",
    "items": [
      { "day": "S", "val": "40%", "type": "striped" },
      { "day": "M", "val": "75%", "type": "solid" },
      { "day": "T", "val": "60%", "type": "light", "tooltip": "74%" },
      { "day": "W", "val": "95%", "type": "dark-solid" },
      { "day": "T", "val": "45%", "type": "striped" },
      { "day": "F", "val": "70%", "type": "striped" },
      { "day": "S", "val": "50%", "type": "striped" }
    ]
  }
}
```

---

#### GET `/admin/dashboard/team-collaboration`

Returns the current active team collaboration tasks.

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Team collaboration list fetched successfully.",
  "data": [
    {
      "id": 1,
      "name": "Alexandra Deff",
      "role": "Working on Github Project Repository",
      "status": "Completed",
      "status_color_class": "bg-emerald-50 text-emerald-700 border-emerald-100",
      "avatar_url": "https://example.test/avatars/alexandra.jpg"
    },
    {
      "id": 2,
      "name": "Edwin Adenike",
      "role": "Working on Integrate User Authentication System",
      "status": "In Progress",
      "status_color_class": "bg-amber-50 text-amber-700 border-amber-100",
      "avatar_url": null
    },
    {
      "id": 3,
      "name": "Isaac Oluwatemilorun",
      "role": "Working on Develop Search and Filter Functionality",
      "status": "Pending",
      "status_color_class": "bg-red-50 text-red-700 border-red-100",
      "avatar_url": null
    }
  ]
}
```

#### POST `/admin/dashboard/team-collaboration`

Assigns or adds a team member task.

**Validation Rules:**
| Field | Type | Rules |
|-------|------|-------|
| `admin_id` | integer | required, exists:admins,id |
| `task_description` | string | required, max:255 |
| `status` | string | required, in:Completed,In Progress,Pending |

---

#### GET `/admin/dashboard/reminders`

Returns upcoming meetings or task reminders.

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Reminders fetched successfully.",
  "data": {
    "id": 101,
    "title": "Meeting with Arc",
    "time_range": "10:00 AM - 11:30 AM",
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "scheduled_at": "2026-09-15T10:00:00Z"
  }
}
```

---

#### GET `/admin/dashboard/featured-packages`

Returns featured travel/subscription packages displayed on the dashboard sidebar card.

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Featured packages fetched successfully.",
  "data": [
    {
      "id": 1,
      "title": "Dubai Luxury Desert Getaway",
      "due_date": "2026-07-15",
      "formatted_due_date": "July 15, 2026",
      "category": "Luxury Packages",
      "icon_type": "globe"
    },
    {
      "id": 2,
      "title": "Cairo Historical Pyramids Tour",
      "due_date": "2026-07-20",
      "formatted_due_date": "July 20, 2026",
      "category": "Historical Tours",
      "icon_type": "landmark"
    }
  ]
}
```

---

#### GET `/admin/dashboard/progress-gauge`

Returns overall project/package progress percentage and breakdown.

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Progress gauge data fetched successfully.",
  "data": {
    "percentage": 41,
    "status_label": "Project Ended",
    "breakdown": {
      "completed": 41,
      "in_progress": 35,
      "pending": 24
    }
  }
}
```

---

#### GET `/admin/dashboard/time-tracker` & POST `/admin/dashboard/time-tracker/log`

**GET Response Example (200 OK):**
```json
{
  "success": true,
  "data": {
    "hours": 1,
    "minutes": 24,
    "seconds": 8,
    "is_active": false
  }
}
```

**POST `/admin/dashboard/time-tracker/log` Payload:**
```json
{
  "hours": 2,
  "minutes": 15,
  "seconds": 40,
  "notes": "Completed dashboard UI components review"
}
```

---

## 4. Reports Page API Specification

The Reports page focuses on financial performance, booking growth, top-performing categories, and trend charts.

### 4.1 Overview of Reports Endpoints

| Method | Path | Required Permission | Description |
|--------|------|---------------------|-------------|
| GET | `/admin/reports/summary` | `reports.view` | Key report widgets (Total sales, growth, top destination) |
| GET | `/admin/reports/financial-growth` | `reports.view` | Line chart data for financial growth (Revenue vs Expenses) |
| GET | `/admin/reports/category-share` | `reports.view` | Bar chart breakdown of market/category share percentage |
| GET | `/admin/reports/export` | `reports.export` | Export filtered financial & category reports (PDF, CSV, XLSX) |

---

### 4.2 Endpoint Specifications — Reports

#### GET `/admin/reports/summary`

Returns top-level metric summary widgets for the reports screen.

**Query Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `date_from` | date | no | 1 year ago | YYYY-MM-DD |
| `date_to` | date | no | today | YYYY-MM-DD |

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Report summary fetched successfully.",
  "data": {
    "total_sales": {
      "amount": 723000,
      "formatted_amount": "$723,000",
      "currency": "USD"
    },
    "booking_growth": {
      "percentage": 48.2,
      "type": "YOY",
      "formatted": "+48.2% YOY"
    },
    "top_destination": {
      "id": 5,
      "name": "Dubai, UAE",
      "sales_volume": 245000,
      "bookings_count": 512
    }
  }
}
```

---

#### GET `/admin/reports/financial-growth`

Provides monthly time-series financial figures (revenue vs. expenses) for the line chart component.

**Query Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `year` | integer | no | Current year | e.g., `2026` |
| `period` | string | no | `monthly` | Allowed: `monthly`, `quarterly` |

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Financial growth data fetched successfully.",
  "data": {
    "year": 2026,
    "currency": "USD",
    "chart_data": [
      { "month": "Jan", "revenue": 45000, "expenses": 28000, "net_profit": 17000 },
      { "month": "Feb", "revenue": 52000, "expenses": 31000, "net_profit": 21000 },
      { "month": "Mar", "revenue": 48000, "expenses": 29000, "net_profit": 19000 },
      { "month": "Apr", "revenue": 61000, "expenses": 35000, "net_profit": 26000 },
      { "month": "May", "revenue": 55000, "expenses": 32000, "net_profit": 23000 },
      { "month": "Jun", "revenue": 67000, "expenses": 38000, "net_profit": 29000 },
      { "month": "Jul", "revenue": 72000, "expenses": 41000, "net_profit": 31000 },
      { "month": "Aug", "revenue": 78000, "expenses": 43000, "net_profit": 35000 },
      { "month": "Sep", "revenue": 85000, "expenses": 46000, "net_profit": 39000 },
      { "month": "Oct", "revenue": 80000, "expenses": 44000, "net_profit": 36000 },
      { "month": "Nov", "revenue": 88000, "expenses": 47000, "net_profit": 41000 },
      { "month": "Dec", "revenue": 92000, "expenses": 50000, "net_profit": 42000 }
    ]
  }
}
```

---

#### GET `/admin/reports/category-share`

Provides category revenue share percentages for vertical bar chart visualization. Formatted with localized category names according to `Accept-Language` (`en` or `ar`).

**Query Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `limit` | integer | no | 5 | Top N categories |

**Response Example (200 OK):**
```json
{
  "success": true,
  "message": "Category share fetched successfully.",
  "data": [
    {
      "category_id": 1,
      "name": "Luxury Packages",
      "name_ar": "باقات فاخرة",
      "value": 35,
      "total_sales": 253050
    },
    {
      "category_id": 2,
      "name": "Beach Resorts",
      "name_ar": "منتجعات شاطئية",
      "value": 25,
      "total_sales": 180750
    },
    {
      "category_id": 3,
      "name": "Historical Tours",
      "name_ar": "جولات تاريخية",
      "value": 20,
      "total_sales": 144600
    },
    {
      "category_id": 4,
      "name": "Adventure Safari",
      "name_ar": "سفاري ومغامرات",
      "value": 12,
      "total_sales": 86760
    },
    {
      "category_id": 5,
      "name": "City Sightseeing",
      "name_ar": "جولات المدينة",
      "value": 8,
      "total_sales": 57840
    }
  ]
}
```

---

#### GET `/admin/reports/export`

Downloads export files containing report data formatted in CSV, Excel, or PDF.

**Query Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `format` | string | yes | `csv` | Allowed: `csv`, `xlsx`, `pdf` |
| `module` | string | no | `all` | Allowed: `all`, `financial`, `categories`, `packages`, `users` |
| `date_from` | date | no | — | YYYY-MM-DD |
| `date_to` | date | no | — | YYYY-MM-DD |

**Response (200 OK):**
- Headers: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (or `text/csv` / `application/pdf`)
- Attachment disposition with filename (e.g. `report_2026-09-13.xlsx`).

---

## 5. Permissions Matrix

All endpoints require Sanctum authentication. Backend policies must evaluate the following permissions:

| Permission Name | Assigned Role(s) | Description |
|-----------------|------------------|-------------|
| `dashboard.view` | Admin, Manager, Staff | View dashboard metrics, charts, and reminders |
| `dashboard.manage` | Admin, Manager | Add team member tasks, sync time logs |
| `dashboard.import` | Admin | Access bulk import feature |
| `dashboard.export` | Admin, Manager | Download dashboard summary |
| `reports.view` | Admin, Manager | View financial reports and category shares |
| `reports.export` | Admin, Manager | Export PDF/CSV/Excel report files |

---

## 6. Implementation Checklist for Backend Team

- [ ] Register routes under `routes/api.php` with `/admin` prefix and `auth:sanctum` middleware.
- [ ] Create `DashboardController` and `ReportController` returning exact JSON shapes specified.
- [ ] Create Form Requests for validation (`ImportDashboardRequest`, `TeamMemberTaskRequest`, `ReportExportRequest`).
- [ ] Utilize Eloquent aggregates (`count()`, `sum()`, `groupBy()`) for optimal performance on financial and category metrics.
- [ ] Ensure Arabic and English locale strings align with `Accept-Language` headers.
- [ ] Handle empty states gracefully (`0` counts, empty arrays `[]`, default `0.0` percentages).
