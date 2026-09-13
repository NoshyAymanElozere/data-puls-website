# Admin Reports API & Frontend Integration Guide

This document defines the complete backend API specification, data models, query parameters, and JSON response envelopes for the **Admin Reports Module** in the Herz Dashboard.

---

## 1. Overview & Permissions Matrix

All endpoints require an authenticated administrator with a Bearer token via Laravel Sanctum (`auth:sanctum`).

| Permission Key | Description | Allowed Endpoints |
|---|---|---|
| `reports.view` | View summary, trends, charts, and module analytical reports | `GET /admin/reports/*` (except export) |
| `reports.export` | Generate and download CSV / PDF / XLSX reports | `GET /admin/reports/export` |

### Base Headers
```http
Authorization: Bearer {admin_token}
Accept: application/json
Accept-Language: en|ar
```

---

## 2. API Route Map

| Method | Endpoint | Permission | Purpose |
|---|---|---|---|
| `GET` | `/admin/reports/summary` | `reports.view` | High-level aggregated KPI metrics across all modules with growth comparisons. |
| `GET` | `/admin/reports/financial-growth` | `reports.view` | Revenue, invoice sales, subscription income, and profit trends (monthly, quarterly, yearly). |
| `GET` | `/admin/reports/category-share` | `reports.view` | Category spend share percentages and invoice volume for bar/pie charts. |
| `GET` | `/admin/reports/invoices` | `reports.view` | Detailed invoice spending, ticket sizes, warranty attachment rate, and store rankings. |
| `GET` | `/admin/reports/warranties` | `reports.view` | Warranty portfolio status, upcoming expiration forecast, and duration breakdown. |
| `GET` | `/admin/reports/subscriptions` | `reports.view` | Subscriber counts, MRR, ARR, package breakdown, and billing cycle share. |
| `GET` | `/admin/reports/users` | `reports.view` | User acquisition, phone verification rates, family accounts, city distribution, and top spenders. |
| `GET` | `/admin/reports/merchants` | `reports.view` | Merchant / store leaderboard by revenue, invoices, and warranty volume. |
| `GET` | `/admin/reports/export` | `reports.export` | Generate signed temporary download link for CSV / PDF export of any module. |
| `GET` | `/admin/reports/download/{filename}` | *Signed URL* | Download generated report file. |

---

## 3. Endpoints Specification

### 3.1 Overview Summary (`GET /admin/reports/summary`)

Returns top-level metric summary widgets combining financial, warranty, subscription, and user statistics.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | 1 year ago | Filter start date |
| `date_to` | string (YYYY-MM-DD) | No | Today | Filter end date |
| `category_id` | integer | No | — | Filter by category ID |
| `city_id` | integer | No | — | Filter by user city ID |

#### Response (200 OK)
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
      "percentage": 18.5,
      "type": "YOY",
      "formatted": "+18.5% YOY"
    },
    "invoice_growth": {
      "percentage": 18.5,
      "type": "YOY",
      "formatted": "+18.5% YOY"
    },
    "top_destination": {
      "id": 1,
      "name": "Amazon KSA",
      "sales_volume": 145000,
      "bookings_count": 320
    },
    "top_merchant": {
      "id": 1,
      "name": "Amazon KSA",
      "sales_volume": 145000,
      "bookings_count": 320
    },
    "kpis": {
      "invoices": {
        "total_count": 1420,
        "total_amount": 723000.00,
        "formatted_amount": "723,000.00 SAR",
        "average_amount": 509.15,
        "growth_percentage": 18.5,
        "sales_growth_percentage": 24.2
      },
      "warranties": {
        "total_count": 890,
        "active_count": 710,
        "expiring_soon_count": 45,
        "expired_count": 180
      },
      "subscriptions": {
        "active_subscribers": 350,
        "trial_subscribers": 42,
        "active_packages_count": 4,
        "estimated_mrr": 24500.00,
        "formatted_mrr": "24,500.00 SAR"
      },
      "users": {
        "total_users": 2840,
        "new_users_count": 310,
        "account_owners_count": 1950,
        "family_members_count": 890
      }
    },
    "top_category": {
      "id": 2,
      "name": "Electronics",
      "name_ar": "إلكترونيات",
      "sales_volume": 285000.00,
      "invoices_count": 412
    },
    "currency": "SAR"
  }
}
```

---

### 3.2 Financial Growth Analytics (`GET /admin/reports/financial-growth`)

Provides time-series figures combining invoice sales and subscription revenue with profit and growth rate.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values | Description |
|---|---|---|---|---|---|
| `year` | integer | No | Current Year | `2020` to `2035` | Target calendar year |
| `period` | string | No | `monthly` | `monthly` \| `quarterly` \| `yearly` | Aggregation interval |
| `category_id` | integer | No | — | Existing Category ID | Optional category filter |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Financial growth data retrieved successfully.",
  "data": {
    "year": 2026,
    "period": "monthly",
    "currency": "SAR",
    "chart_data": [
      {
        "month": "Jan",
        "period": "Jan",
        "revenue": 58000,
        "invoice_sales": 46000,
        "subscription_revenue": 12000,
        "expenses": 23200,
        "net_profit": 34800,
        "growth_rate": 0.0
      },
      {
        "month": "Feb",
        "period": "Feb",
        "revenue": 69000,
        "invoice_sales": 55000,
        "subscription_revenue": 14000,
        "expenses": 27600,
        "net_profit": 41400,
        "growth_rate": 19.0
      }
    ]
  }
}
```

---

### 3.3 Category Share Distribution (`GET /admin/reports/category-share`)

Provides category sales breakdown and market share percentage for bar or donut charts.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | integer | No | `5` | Top N categories (1 to 50) |
| `date_from` | string (YYYY-MM-DD) | No | — | Start date filter |
| `date_to` | string (YYYY-MM-DD) | No | — | End date filter |
| `parent_id` | integer | No | — | Filter by parent category (e.g., subcategories under Miscellaneous) |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Category share data retrieved successfully.",
  "data": [
    {
      "category_id": 1,
      "name": "Electronics & Gadgets",
      "name_ar": "إلكترونيات وأجهزة",
      "value": 42,
      "total_sales": 304000,
      "invoices_count": 412,
      "average_invoice_value": 737.86,
      "stores_count": 28
    },
    {
      "category_id": 2,
      "name": "Home Appliances",
      "name_ar": "أجهزة منزلية",
      "value": 26,
      "total_sales": 188000,
      "invoices_count": 185,
      "average_invoice_value": 1016.22,
      "stores_count": 14
    }
  ]
}
```

---

### 3.4 Invoices & Spending Report (`GET /admin/reports/invoices`)

Comprehensive analytical breakdown of customer invoices, average spend ticket sizes, warranty attachment rate, and spending brackets.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | — | Purchase date range start |
| `date_to` | string (YYYY-MM-DD) | No | — | Purchase date range end |
| `category_id` | integer | No | — | Filter by category |
| `city_id` | integer | No | — | Filter by user's city |
| `min_amount` | numeric | No | — | Minimum invoice amount |
| `max_amount` | numeric | No | — | Maximum invoice amount |
| `store_name` | string | No | — | Partial merchant store name filter |
| `has_warranty` | boolean | No | — | `true` (with warranty) \| `false` (without warranty) |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Invoices report retrieved successfully.",
  "data": {
    "summary": {
      "total_invoices": 1420,
      "total_amount": 723000.00,
      "average_amount": 509.15,
      "min_amount": 15.00,
      "max_amount": 12500.00,
      "invoices_with_warranty": 890,
      "warranty_attachment_rate": 62.7,
      "currency": "SAR"
    },
    "by_category": [
      {
        "category_id": 1,
        "name": "Electronics",
        "name_ar": "إلكترونيات",
        "total_sales": 304000.00,
        "invoices_count": 412,
        "share_percentage": 42.0
      }
    ],
    "top_stores": [
      {
        "store_name": "Jarir Bookstore",
        "sales_volume": 154000.00,
        "invoices_count": 210,
        "average_invoice_value": 733.33,
        "share_percentage": 21.3
      }
    ],
    "amount_brackets": [
      { "label": "<= 200 SAR", "count": 480 },
      { "label": "201 - 1,000 SAR", "count": 620 },
      { "label": "1,001 - 5,000 SAR", "count": 280 },
      { "label": "> 5,000 SAR", "count": 40 }
    ]
  }
}
```

---

### 3.5 Warranty Status & Expirations Report (`GET /admin/reports/warranties`)

Detailed analytics for warranties coverage, active vs. expired status, duration brackets, and upcoming expiration timeline.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values | Description |
|---|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | — | — | Warranty start date from |
| `date_to` | string (YYYY-MM-DD) | No | — | — | Warranty start date to |
| `warranty_period_id` | integer | No | — | — | Filter by period definition |
| `status` | string | No | `all` | `active` \| `expired` \| `expiring_soon` \| `all` | Warranty status |
| `expiring_days` | integer | No | `30` | `1` to `365` | Horizon for `expiring_soon` |
| `category_id` | integer | No | — | — | Category filter |
| `store_name` | string | No | — | — | Store name filter |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Warranties report retrieved successfully.",
  "data": {
    "summary": {
      "total_warranties": 890,
      "active_warranties": 710,
      "expired_warranties": 180,
      "expiring_soon_count": 45,
      "expiring_7_days": 8,
      "expiring_30_days": 45,
      "expiring_90_days": 112,
      "average_duration_months": 18.4
    },
    "by_period": [
      {
        "warranty_period_id": 1,
        "name": "1 Year Standard",
        "name_ar": "سنة واحدة قياسي",
        "count": 520,
        "percentage": 58.4
      },
      {
        "warranty_period_id": 2,
        "name": "2 Years Extended",
        "name_ar": "سنتان ممتد",
        "count": 310,
        "percentage": 34.8
      }
    ],
    "top_stores_covered": [
      {
        "store_name": "Extra Electronics",
        "warranties_count": 340
      },
      {
        "store_name": "Apple Store",
        "warranties_count": 210
      }
    ],
    "expiring_forecast": [
      { "period": "Next 7 Days", "count": 8 },
      { "period": "Next 30 Days", "count": 45 },
      { "period": "Next 90 Days", "count": 112 }
    ]
  }
}
```

---

### 3.6 Subscriptions & Recurring Revenue Report (`GET /admin/reports/subscriptions`)

Detailed report on membership tiers, recurring subscription revenue (MRR/ARR), and billing intervals.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values | Description |
|---|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | — | — | Subscription creation start date |
| `date_to` | string (YYYY-MM-DD) | No | — | — | Subscription creation end date |
| `subscription_package_id` | integer | No | — | — | Filter by package ID |
| `billing_period` | string | No | — | `monthly` \| `yearly` | Billing frequency |
| `status` | string | No | `all` | `active` \| `trial` \| `cancelled` \| `expired` \| `all` | Subscription status |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Subscriptions report retrieved successfully.",
  "data": {
    "summary": {
      "total_subscribers": 420,
      "active_subscribers": 350,
      "trial_subscribers": 42,
      "cancelled_subscribers": 18,
      "expired_subscribers": 10,
      "estimated_mrr": 24500.00,
      "estimated_arr": 294000.00,
      "average_revenue_per_user": 62.50,
      "currency": "SAR"
    },
    "packages": [
      {
        "package_id": 1,
        "name": "Gold Family Plan",
        "name_ar": "باقة العائلة الذهبية",
        "total_subscriptions": 220,
        "active_subscribers": 190,
        "monthly_mrr": 14250.00
      },
      {
        "package_id": 2,
        "name": "Silver Individual",
        "name_ar": "الباقة الفردية الفضية",
        "total_subscriptions": 200,
        "active_subscribers": 160,
        "monthly_mrr": 10250.00
      }
    ],
    "billing_cycles": {
      "monthly": {
        "count": 310,
        "percentage": 73.8
      },
      "yearly": {
        "count": 110,
        "percentage": 26.2
      }
    }
  }
}
```

---

### 3.7 Users Growth & Demographics Report (`GET /admin/reports/users`)

Demographic breakdown, family account adoption, phone verification metrics, and top spending customers.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values | Description |
|---|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | — | — | Registration start date |
| `date_to` | string (YYYY-MM-DD) | No | — | — | Registration end date |
| `city_id` | integer | No | — | — | Filter by city ID |
| `country_id` | integer | No | — | — | Filter by country ID |
| `status` | string | No | `all` | `active` \| `inactive` \| `suspended` \| `all` | User status |
| `has_family` | boolean | No | — | `true` \| `false` | Filter account owners with linked family members |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Users report retrieved successfully.",
  "data": {
    "summary": {
      "total_users": 2840,
      "active_users": 2650,
      "inactive_users": 190,
      "phone_verified_count": 2720,
      "phone_verified_rate": 95.8,
      "account_owners_count": 1950,
      "family_members_count": 890,
      "average_family_size": 0.5
    },
    "geographic_distribution": [
      {
        "city_id": 1,
        "name": "Riyadh",
        "name_ar": "الرياض",
        "users_count": 1250,
        "percentage": 44.0
      },
      {
        "city_id": 2,
        "name": "Jeddah",
        "name_ar": "جدة",
        "users_count": 680,
        "percentage": 23.9
      }
    ],
    "top_spenders": [
      {
        "user_id": 45,
        "name": "Mohammed Al-Otaibi",
        "email": "m.otaibi@example.com",
        "phone": "+966501234567",
        "city": "Riyadh",
        "total_spent": 48500.00,
        "invoice_count": 28
      }
    ]
  }
}
```

---

### 3.8 Merchant Ranking & Performance Report (`GET /admin/reports/merchants`)

Ranks retail stores and merchants according to sales volume, invoice count, customer reach, and warranty issuance.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `date_from` | string (YYYY-MM-DD) | No | — | Purchase date from |
| `date_to` | string (YYYY-MM-DD) | No | — | Purchase date to |
| `search` | string | No | — | Search store name |
| `category_id` | integer | No | — | Category filter |
| `limit` | integer | No | `10` | Top N stores (1 to 100) |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Merchants report retrieved successfully.",
  "data": {
    "summary": {
      "total_unique_merchants": 142,
      "total_sales_volume": 723000.00,
      "top_merchant_name": "Jarir Bookstore",
      "top_merchant_sales": 154000.00,
      "average_sales_per_merchant": 5091.55,
      "currency": "SAR"
    },
    "merchants": [
      {
        "store_name": "Jarir Bookstore",
        "total_sales": 154000.00,
        "invoices_count": 210,
        "average_invoice_value": 733.33,
        "unique_customers": 182,
        "warranties_count": 145,
        "market_share_percentage": 21.3
      },
      {
        "store_name": "Extra Electronics",
        "total_sales": 128000.00,
        "invoices_count": 140,
        "average_invoice_value": 914.29,
        "unique_customers": 115,
        "warranties_count": 130,
        "market_share_percentage": 17.7
      }
    ]
  }
}
```

---

### 3.9 Export Reports (`GET /admin/reports/export`)

Generates an on-demand CSV or PDF export file for any specific module with a signed temporary download URL.

#### Query Parameters
| Parameter | Type | Required | Default | Allowed Values | Description |
|---|---|---|---|---|---|
| `format` | string | **Yes** | `csv` | `csv` \| `xlsx` \| `pdf` | Export file format |
| `module` | string | No | `all` | `all` \| `invoices` \| `warranties` \| `subscriptions` \| `users` \| `categories` \| `financial` \| `merchants` | Module to export |
| `date_from` | string (YYYY-MM-DD) | No | — | — | Filter start date |
| `date_to` | string (YYYY-MM-DD) | No | — | — | Filter end date |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Report export generated successfully.",
  "data": {
    "download_url": "https://api.herz.sa/admin/reports/download/report-warranties-2026-09-13-162000-abc12345.pdf?expires=1789395600&signature=fedcba...",
    "filename": "report-warranties-2026-09-13-162000-abc12345.pdf",
    "expires_at": "2026-09-13 17:20:00",
    "records_count": 890
  }
}
```

---

## 4. Frontend UI Components Recommendations

1. **Dashboard Top Cards**: Display the 4 core cards from `kpis` in `GET /admin/reports/summary` (Invoices Total, Warranties Active, MRR, Total Users).
2. **Date Range Filter Bar**: Global date picker (`date_from`, `date_to`) at the top of the reports page to synchronize queries across all active report widgets.
3. **Module Tabs**:
   - **Financials**: Line chart component rendering `chart_data` from `financial-growth` (Revenue, Invoice Sales, Subscriptions, Profit).
   - **Invoices & Spend**: Categories breakdown, store volume, and amount bracket distribution from `invoices`.
   - **Warranties**: Active vs. expiring status pills and upcoming expirations forecast from `warranties`.
   - **Subscriptions**: MRR/ARR gauge, package table, and billing interval breakdown from `subscriptions`.
   - **Users & Demographics**: Top cities distribution and top spending customers table from `users`.
   - **Merchants**: Leaderboard table with search input (`search`) and sortable columns from `merchants`.
4. **Export Button**: Modal allowing user to select format (`CSV` or `PDF`) and module (`Invoices`, `Warranties`, `Subscriptions`, `Users`, `Merchants`, `Financial`), which calls `GET /admin/reports/export` and triggers direct browser download using `download_url`.
