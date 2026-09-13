# Admin Dashboard & Reports API

This document provides complete technical specifications for the admin **Dashboard** and **Reports** API endpoints in **Herz (`حِرز`)**.

All metrics and charts are sourced strictly from Herz's core domain: **Invoices, Warranties, Spending, Store Merchants, and Categories**.

---

## 1. Overview & Base Configuration

| Property | Value |
|----------|-------|
| **Base URL** | `/admin` (e.g., `https://api.hirz.app/admin`) |
| **Authentication** | Bearer Sanctum Token (`Authorization: Bearer {token}`) |
| **Middleware** | `auth:sanctum`, `admin`, `locale` |
| **Headers** | `Accept: application/json`<br>`Accept-Language: ar|en` |

### Required Permissions
- `dashboard.view`: View dashboard KPI cards, analytics chart, expiring warranties, and progress gauge.
- `dashboard.export`: Export dashboard summary CSV.
- `reports.view`: View financial report summary, growth timeline, and category share.
- `reports.export`: Export filtered financial & invoice reports (CSV, XLSX, PDF).

---

## 2. Endpoints Summary

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| `GET` | `/admin/dashboard/stats` | `dashboard.view` | Top KPI cards (Invoices, Warranties, Spending, Users) |
| `GET` | `/admin/dashboard/analytics` | `dashboard.view` | Day-by-day activity bar/pill chart |
| `GET` | `/admin/dashboard/expiring-warranties` | `dashboard.view` | Urgent warranties expiring soon *(alias: `/featured-packages`)* |
| `GET` | `/admin/dashboard/progress-gauge` | `dashboard.view` | Categorization and warranty tracking coverage rate |
| `GET` | `/admin/dashboard/export` | `dashboard.export` | Download dashboard summary as CSV |
| `GET` | `/admin/reports/summary` | `reports.view` | Total sales/spending, YoY invoice growth, top merchant |
| `GET` | `/admin/reports/financial-growth` | `reports.view` | Monthly/Quarterly financial timeline (Revenue, Expenses, Net Profit) |
| `GET` | `/admin/reports/category-share` | `reports.view` | Spending share per invoice category with localized titles |
| `GET` | `/admin/reports/export` | `reports.export` | Generate export file (CSV, XLSX, PDF) |
| `GET` | `/admin/reports/download/{filename}` | Signed route | Temporary signed download endpoint for exported files |

---

## 3. Dashboard Endpoints Detail

### 3.1 GET `/admin/dashboard/stats`
Returns aggregated top-level KPI metrics comparing current period to the preceding period of the same duration.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values |
|-----------|------|----------|---------|----------------|
| `period` | string | No | `this_month` | `this_month`, `last_month`, `this_year` |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully.",
  "data": {
    "total_invoices": {
      "total": 184,
      "change_percentage": 14.5,
      "change_direction": "increase",
      "subtitle": "increase from last month"
    },
    "active_warranties": {
      "total": 126,
      "status": "Active",
      "expiring_soon_count": 8,
      "subtitle": "8 expiring within 30 days"
    },
    "total_spending": {
      "total": 78450,
      "formatted": "78,450.00",
      "change_percentage": 8.2,
      "change_direction": "increase",
      "subtitle": "increase in spending from last month"
    },
    "active_users": {
      "total": 542,
      "change_percentage": 12.0,
      "change_direction": "increase",
      "subtitle": "increase from last month"
    },
    "travel_packages": { "...": "Backward-compatible alias for total_invoices" },
    "tourist_destinations": { "...": "Backward-compatible alias for active_warranties" },
    "tourist_attractions": { "...": "Backward-compatible alias for total_spending" },
    "total_bookings": { "...": "Backward-compatible alias for active_users" }
  }
}
```

---

### 3.2 GET `/admin/dashboard/analytics`
Generates activity distribution pills across days of the week (Sunday through Saturday) or months of the year.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values |
|-----------|------|----------|---------|----------------|
| `period` | string | No | `weekly` | `weekly`, `monthly`, `yearly` |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Dashboard analytics retrieved successfully.",
  "data": {
    "period": "weekly",
    "items": [
      { "day": "S", "val": "45%", "type": "striped", "tooltip": "12 invoices" },
      { "day": "M", "val": "75%", "type": "solid", "tooltip": "28 invoices" },
      { "day": "T", "val": "60%", "type": "light", "tooltip": "20 invoices" },
      { "day": "W", "val": "95%", "type": "dark-solid", "tooltip": "36 invoices" },
      { "day": "T", "val": "50%", "type": "striped", "tooltip": "18 invoices" },
      { "day": "F", "val": "30%", "type": "striped", "tooltip": "8 invoices" },
      { "day": "S", "val": "65%", "type": "striped", "tooltip": "24 invoices" }
    ]
  }
}
```

---

### 3.3 GET `/admin/dashboard/expiring-warranties`
*(Alias: `/admin/dashboard/featured-packages`)*  
Returns list of urgent warranties nearing expiration.

#### Query Parameters
*None.*

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Expiring warranties retrieved successfully.",
  "data": [
    {
      "id": 14,
      "title": "Smart OLED TV 65\"",
      "store_name": "Extra Electronics",
      "due_date": "2026-09-28",
      "formatted_due_date": "September 28, 2026",
      "category": "Electronics",
      "icon_type": "shield",
      "days_remaining": 15
    },
    {
      "id": 22,
      "title": "Air Conditioner Split 2 Ton",
      "store_name": "Al Manea",
      "due_date": "2026-10-04",
      "formatted_due_date": "October 04, 2026",
      "category": "Home Appliances",
      "icon_type": "shield",
      "days_remaining": 21
    }
  ]
}
```

---

### 3.4 GET `/admin/dashboard/progress-gauge`
Returns overall system completion rate for invoice categorization and warranty capture.

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Progress gauge retrieved successfully.",
  "data": {
    "percentage": 82,
    "status_label": "Tracking on Target",
    "breakdown": {
      "completed": 82,
      "in_progress": 12,
      "pending": 6
    }
  }
}
```

---

### 3.5 GET `/admin/dashboard/export`
Streams a UTF-8 encoded CSV file summarizing current dashboard metrics.

#### Headers
- `Content-Type: text/csv; charset=UTF-8`
- `Content-Disposition: attachment; filename="dashboard-stats-2026-09-13.csv"`

---

## 4. Reports Endpoints Detail

### 4.1 GET `/admin/reports/summary`
Returns high-level performance metrics for invoices, spending growth, and the top-spending merchant.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `date_from` | date | No | 1 year ago | Start date `YYYY-MM-DD` |
| `date_to` | date | No | Today | End date `YYYY-MM-DD` (must be $\ge$ `date_from`) |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Report summary retrieved successfully.",
  "data": {
    "total_sales": {
      "amount": 723000,
      "formatted_amount": "723,000.00 SAR",
      "currency": "SAR"
    },
    "total_spending": {
      "amount": 723000,
      "formatted_amount": "723,000.00 SAR",
      "currency": "SAR"
    },
    "booking_growth": {
      "percentage": 48.2,
      "type": "YOY",
      "formatted": "+48.2% YOY"
    },
    "invoice_growth": {
      "percentage": 48.2,
      "type": "YOY",
      "formatted": "+48.2% YOY"
    },
    "top_destination": {
      "id": 1,
      "name": "Jarir Bookstore",
      "sales_volume": 245000,
      "bookings_count": 512
    },
    "top_merchant": {
      "id": 1,
      "name": "Jarir Bookstore",
      "sales_volume": 245000,
      "bookings_count": 512
    }
  }
}
```

---

### 4.2 GET `/admin/reports/financial-growth`
Returns time-series monthly or quarterly financial totals for the reports line chart.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values |
|-----------|------|----------|---------|----------------|
| `year` | integer | No | Current year | e.g., `2026` |
| `period` | string | No | `monthly` | `monthly`, `quarterly` |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Financial growth retrieved successfully.",
  "data": {
    "year": 2026,
    "currency": "SAR",
    "chart_data": [
      { "month": "Jan", "revenue": 45000, "expenses": 18000, "net_profit": 27000 },
      { "month": "Feb", "revenue": 52000, "expenses": 20800, "net_profit": 31200 },
      { "month": "Mar", "revenue": 48000, "expenses": 19200, "net_profit": 28800 },
      { "month": "Apr", "revenue": 61000, "expenses": 24400, "net_profit": 36600 },
      { "month": "May", "revenue": 55000, "expenses": 22000, "net_profit": 33000 },
      { "month": "Jun", "revenue": 67000, "expenses": 26800, "net_profit": 40200 },
      { "month": "Jul", "revenue": 72000, "expenses": 28800, "net_profit": 43200 },
      { "month": "Aug", "revenue": 78000, "expenses": 31200, "net_profit": 46800 },
      { "month": "Sep", "revenue": 85000, "expenses": 34000, "net_profit": 51000 },
      { "month": "Oct", "revenue": 80000, "expenses": 32000, "net_profit": 48000 },
      { "month": "Nov", "revenue": 88000, "expenses": 35200, "net_profit": 52800 },
      { "month": "Dec", "revenue": 92000, "expenses": 36800, "net_profit": 55200 }
    ]
  }
}
```

---

### 4.3 GET `/admin/reports/category-share`
Provides category spending share percentages for bar chart visualization. Formatted with localized category titles according to `Accept-Language` header (`en` or `ar`).

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | `5` | Top N categories (1–50) |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Category share retrieved successfully.",
  "data": [
    {
      "category_id": 2,
      "name": "إلكترونيات",
      "name_ar": "إلكترونيات",
      "value": 42,
      "total_sales": 328000
    },
    {
      "category_id": 3,
      "name": "أجهزة منزلية",
      "name_ar": "أجهزة منزلية",
      "value": 28,
      "total_sales": 218500
    },
    {
      "category_id": 4,
      "name": "أثاث",
      "name_ar": "أثاث",
      "value": 18,
      "total_sales": 140400
    },
    {
      "category_id": 5,
      "name": "مركبات وقطع غيار",
      "name_ar": "مركبات وقطع غيار",
      "value": 12,
      "total_sales": 93600
    }
  ]
}
```

---

### 4.4 GET `/admin/reports/export`
Generates a downloadable CSV or PDF report based on filters.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values |
|-----------|------|----------|---------|----------------|
| `format` | string | **Yes** | — | `csv`, `xlsx`, `pdf` |
| `module` | string | No | `all` | `all`, `invoices`, `warranties`, `categories`, `financial` |
| `date_from` | date | No | — | `YYYY-MM-DD` |
| `date_to` | date | No | — | `YYYY-MM-DD` |

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Report export generated successfully.",
  "data": {
    "download_url": "https://api.hirz.app/admin/reports/download/report-invoices-2026-09-13-131758-aBcDeFgH.pdf?expires=1789395478&signature=78a9c...",
    "filename": "report-invoices-2026-09-13-131758-aBcDeFgH.pdf",
    "expires_at": "2026-09-13 14:17:58",
    "records_count": 184
  }
}
```

---

### 4.5 GET `/admin/reports/download/{filename}`
Signed temporary URL to download the generated file.

- **Middleware**: `signed:relative`
- **Expires**: 60 minutes after generation.
- **Content-Type**: `application/pdf` or `text/csv`.

---

## 5. Error Responses

| Status Code | Scenario | Sample Body |
|-------------|----------|-------------|
| `401 Unauthorized` | Missing or invalid Bearer token | `{"success": false, "message": "Unauthenticated."}` |
| `403 Forbidden` | Admin user lacks required permission | `{"success": false, "message": "This action is unauthorized."}` |
| `404 Not Found` | Download URL expired or file missing | `{"message": "Export file not found or expired."}` |
| `422 Unprocessable` | Validation error (e.g. invalid date or format) | `{"message": "The given data was invalid.", "errors": {"format": ["The selected format is invalid."]}}` |
