---
description: How to manage and test bilingual content flow between Dashboard, Backend, and Frontend
---

# Bilingual Content Flow Workflow

This workflow describes the architecture, data structures, and verification steps for synchronizing bilingual content (Arabic and English) across the Data Pulse platform.

## 1. Data Entry Flow (Dashboard to Backend)
1. The admin dashboard submits a single `POST` or `PUT` request to `/api/blogs` containing both language blocks (`ar` and `en`) and shared settings.
2. The endpoint validates the schema and stores the record in a unified MongoDB document matching the `Blog` model.

## 2. API Localization Filtering (Backend)
1. The Express server intercepts `GET /api/blogs` and `GET /api/blogs/:slug`.
2. Reads the client's `Accept-Language` header (or `accept-lang`).
3. Passes the document to `formatBlogByLanguage` helper, which:
   - Sets root properties (title, subtitle, category, author, readTime) matching the header language.
   - Embeds language-specific content blocks (sections list).
   - Strips out the unselected language nodes to optimize payloads.

## 3. Client Consumption (Frontend Website)
1. The Next.js/Vite frontend obtains the active browser language (via `useLanguage()`).
2. Appends the active language code as the `Accept-Language` HTTP header value in API requests.
3. Renders the unified keys (e.g. `title` and `sections` array) directly.

## 4. Testing & Verification Steps
1. Import `dplus-backend/Data_Puls_API.postman_collection.json` into Postman.
2. Select **Get All Blogs** or **Get Blog by Slug** request.
3. Go to the **Headers** tab, enable `Accept-Language` and set its value to `ar` to verify Arabic payloads.
4. Update `Accept-Language` to `en` to verify English translations.
