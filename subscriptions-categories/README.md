# Subscriptions & Categories — Admin Frontend Guide

React admin implementation reference. API contracts: [`docs/api/`](../api/).

## Scope

- Subscription packages CRUD (nested prices + features)
- Categories and subcategories (النثريات parent rule)

## Guides

| Guide | Screen(s) |
|-------|-----------|
| [subscription-packages.md](./subscription-packages.md) | `/subscription-packages` |
| [categories.md](./categories.md) | `/categories`, subcategory list |

## Auth & permissions

- Bearer `admin_token` on all requests
- Hide actions when `permissions[].name` missing; backend returns 403

## Postman

- Full admin + API: [`postman/Herz-Pages-Settings-Contact.postman_collection.json`](../../postman/Herz-Pages-Settings-Contact.postman_collection.json)
- Flutter only: [`postman/Herz-Flutter-API.postman_collection.json`](../../postman/Herz-Flutter-API.postman_collection.json)

Run **Auth (Admin) → Login** first for admin routes; **Auth (API) → Verify OTP** for user routes.

## Flutter notes (reference)

Mobile catalog uses `GET /api/subscription-packages` and `GET /api/categories`. Subscribe via `POST /api/me/subscription` → open `checkout_url` in WebView → handle `/api/payment/callback` result meta tag.
