# Backend Gaps Specification: Dashboard Main Menu Statistics (القائمة الرئيسية)

**Date:** 2026-09-14  
**Target:** Backend Development Team  
**Scope:** Enhancing `GET /admin/dashboard/stats` to include aggregated quick counts for Main Menu domains (Users, Warranty Periods, Categories, Reports).

---

## 1. Context & Business Requirement

The Herz (`حِرز`) Admin Dashboard home page features a primary domain navigation section titled **"القائمة الرئيسية" (Main Menu / Quick Domain Management)**.
Currently, this section displays navigational links to the 4 core management sections:
1. **Users (`/users`)** - المستخدمين
2. **Warranty Periods (`/warranty-periods`)** - فترات الضمان
3. **Categories (`/categories`)** - التصنيفات
4. **Reports (`/reports`)** - التقارير

To enhance user experience and provide immediate at-a-glance operational insights, each card in this section needs to display its corresponding aggregated total/active count directly on dashboard load.

Currently, the frontend has to perform multiple separate pagination requests (e.g., querying `/warranty-periods?page=1` and `/categories?page=1`) or rely on local fallbacks. Having the backend return these numbers atomically in the dashboard statistics endpoint will:
- Reduce HTTP roundtrips from 3+ calls to a single call.
- Provide zero-latency loading for dashboard statistics.
- Keep database queries lightweight via fast `COUNT(*)` aggregations.

---

## 2. API Contract & Requested Changes

### Recommended Approach: Include in `GET /admin/dashboard/stats`

Extend the response of `GET /admin/dashboard/stats` with a new key: `menu_counts`.

#### Endpoint
`GET /admin/dashboard/stats`

#### Middleware & Headers
- `auth:sanctum`, `admin`, `locale`
- `Accept: application/json`
- `Authorization: Bearer {token}`

#### Expected Response (`200 OK`)
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
    "menu_counts": {
      "users": 542,
      "warranty_periods": 12,
      "categories": 28,
      "reports": 5
    }
  }
}
```

---

## 3. Data Field Specifications

| Field | Type | Description | Suggested Backend Query (Laravel) |
|-------|------|-------------|-----------------------------------|
| `users` | `integer` | Total registered app users | `User::where('role', 'user')->count()` or `User::count()` |
| `warranty_periods` | `integer` | Total defined warranty periods | `WarrantyPeriod::count()` (or `where('is_active', true)->count()`) |
| `categories` | `integer` | Total system categories | `Category::whereNull('parent_id')->count()` or `Category::count()` |
| `reports` | `integer` | Total active report modules available | Fixed integer `5` (Overview, Invoices, Warranties, Subscriptions, Users) or count of supported report datasets |

---

## 4. Alternative Approach: Standalone Endpoint (Optional)

If the backend team prefers to isolate menu shortcut counts from the main time-filtered KPI statistics:

#### Endpoint
`GET /admin/dashboard/menu-stats`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Menu counts retrieved successfully.",
  "data": {
    "users": 542,
    "warranty_periods": 12,
    "categories": 28,
    "reports": 5
  }
}
```

---

## 5. Frontend Implementation & Fallback Strategy

The frontend has already implemented the integration with automatic fallback:
1. If `stats.menu_counts` is present in `GET /admin/dashboard/stats`, it is used directly without any additional requests.
2. If `stats.menu_counts` is omitted, the frontend gracefully pulls the user count from `stats.active_users.total` and queries pagination metadata from `/warranty-periods` and `/categories`.
3. As soon as the backend deploys `menu_counts`, the dashboard will seamlessly utilize the unified data with zero configuration changes.
