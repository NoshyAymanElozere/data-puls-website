# Herz — Backend Requirements (Mobile APIs + Admin Dashboard APIs)

Source: client handover meeting with Majed (CS66620), 2026-10-21. Timestamps refer to the meeting recording.

Each item lists which consumer it affects:
- **[Mobile]**: Flutter app APIs
- **[Admin]**: admin dashboard APIs/UI

Flutter-only UI changes are in [flutter-requirements.md](flutter-requirements.md).

---

## 1. Free trial: 6 months per user, no subscription gate  [Mobile] [Admin]

**Current:** The user must subscribe before adding an invoice or a family member, and the app shows "You must subscribe first".

**Required:**
- There is **one** subscription package for now. The package system stays fully dynamic, so more packages can be added later.
- Each user gets a **6-month free trial counted from that user's registration date** (not from the app launch date).
- During the trial, **all features are available without subscribing**: adding invoices, AI scan, family members.
- When the trial ends, the user must subscribe to keep using these features.
- The trial duration is **configurable from the dashboard**.
- Invoice limits and family-member limits stay configurable per package from the dashboard.
- Remove or bypass the current "must subscribe" check while the trial is active. The mobile API should expose the trial state (e.g. `trial_ends_at`, `is_in_trial`) so the app can show it.

> Note raised by the team: AI scanning has a per-use cost (Gemini, usage-based pricing). Free-trial users can drive AI cost up. Consider an AI-scan cap during the trial (configurable). Not requested by the client; decide internally.

Refs: 5:02–5:11, 29:17–30:20, 43:45–45:55

## 2. Discount / promo codes  [Admin] [Mobile]

**Purpose:** Marketing through influencers. Each influencer gets their own code, and the admin tracks how many users came through each one.

### Admin: code management
- CRUD for discount codes (e.g. `A-10`).
- **Reward type** (one of):
  - Percentage discount (e.g. 10%)
  - Fixed amount discount (e.g. 50 SAR)
  - **Free subscription period** (e.g. 1 month, 2 months). The client says this type matters most.
- Max usage limit per code.
- Usage count per code.
- Optional: link the code to an owner/influencer name for tracking.

### Admin: analytics
- In the **Reports** page: per-code analytics showing how many times each code was used and by how many users.

### Mobile API
- Validate a code (`valid` / `expired` / `limit reached`) and return the reward it grants.
- Apply the code at the **subscription / checkout step** (agreed placement, rather than registration). The Flutter app needs a "Do you have a discount code?" field on that step.
- Record each redemption (user, code, date) for the analytics above.

Refs: 1:06:35–1:09:59

## 3. Admin home dashboard: user statistics  [Admin]

Add three separate user metrics:

| Metric | Definition |
|--------|------------|
| **Downloads** | Number of app installs. Shows 0 until the app is published on App Store / Play Store. Needs a data source (store APIs or manual input) |
| **Total users** | Number of registered users |
| **Active users** | Users who have added **at least one invoice** |

Refs: 37:02–38:24

## 4. Admin home dashboard: subscription revenue and subscriber follow-up  [Admin]

- Add **subscription revenue** stats to the home page: total amount paid for subscriptions in the selected period. Current home stats cover invoice spending only.
- Add a link/section that lists users by subscription status, so the team can contact them:
  - **Expiring soon**: subscription is about to end
  - **Active**: subscribed and active
  - **Expired, not renewed**
- Works like the existing "warranties near expiry" widget: show the top N on home, with a link to a full list page that has filters.

Refs: 40:02–41:13

## 5. City filter and city statistics  [Admin]

- **Users page:** add a **city filter**.
- **Reports page:** add city statistics, such as users and subscribers per city and the top city by subscribers.
- Purpose: target marketing campaigns by city.

Refs: 49:59–50:37

## 6. Phone number format: local `05XXXXXXXX`  [Mobile]

- The app will send phone numbers as typed by the user, starting with `05` (no `+966` prefix).
- All endpoints that accept a phone number must accept this format and normalize it consistently: register, login/OTP, add family member, update profile, and family-member lookup.
- Make sure existing stored numbers and new ones match. Pick one canonical storage format, e.g. E.164 `+9665XXXXXXXX`.
- The admin notification user search by phone should match both formats.
- **Future:** the countries table already supports multiple countries. Activating more countries will require reworking phone input and validation for other country codes. Saudi Arabia only for now.

Refs: 14:52–17:28, 1:03:41–1:04:27

## 7. Invoice attachments: multiple file formats  [Mobile] [Admin]

**Current:** Invoices are saved as images only.

**Required:**
- Accept invoice uploads as **image, PDF, and documents**. A previous meeting agreed on 4–5 formats; confirm the exact list (e.g. JPG, PNG, HEIC, PDF, DOC/DOCX).
- Store the file **in its original format**: a PDF upload stays a PDF, an image stays an image.
- AI analysis must handle PDF input as well as images.
- Return the file type/URL so the app and dashboard can render or download it correctly. The admin invoice details view must show PDFs and documents too.

Refs: 10:12–11:03, 14:03–14:30

## 8. Warranties: expired status filter  [Mobile]

- Make sure the mobile warranties/indicators API supports an **`expired`** filter alongside `all / active / expiring_soon`, and returns an **expired warranties count** for the new KPI card.

Refs: 22:32–23:43

## 9. App appearance controlled from dashboard  [Admin] [Mobile]  *(pending dedicated meeting)*

- The client wants to control app appearance from the dashboard: **background colors, other colors, fonts, icons, and texts per screen**.
- Scope is **not finalized**. The client asked for a separate meeting to define it. Do not implement until that meeting happens.
- Likely shape: a settings/theme config API that the app fetches on startup.

Refs: 12:16–13:59

---

## Action items (non-development)

- Send the client the **Gemini API pricing** link and an estimated AI cost per invoice scan. Explain that cost is usage-based, not fixed. (45:04–45:25)
- Share the "Herz project comments" Drive sheet. All notes from this meeting are tracked there. (32:45–33:21)
- Deliver final builds after these changes: target tomorrow, or Sunday at the latest. (1:10:16–1:10:26)

## Confirmed as-is (no change requested)

- Dashboard ↔ app changes sync immediately (app content, packages, categories, onboarding, static pages, and so on).
- Invoices a user deletes in the app stay visible to the admin.
- Admin user details show invoices, family members (parent/children links), the user's custom categories (admin can edit/delete/add), and basic info. Columns are toggleable. Admin can block a user and filter by subscribed users.
- Subscription packages are fully dynamic: monthly/yearly price, description, features, bilingual, active/inactive.
- Categories: "Nathriyat" (miscellaneous) is fixed and the only main category with subcategories. Deactivated categories stay on old invoices as read-only but cannot be picked for new invoices. User-created categories are private to that user and their family.
- Onboarding screens, warranty periods (suggestions plus custom period), relationship types (with display order).
- Notifications: manual send (to all users or to one user, searched by name/phone; bilingual, with color/icon), notification log, and automatic notifications with editable templates (birthday, first invoice, subscription activated/renewed/expiring) that can each be turned on or off.
- General settings: app name/icon, contact info, social links, countries/cities, CMS pages (about, privacy, terms), and contact subjects. Admin replies to contact messages reach the user as a push notification.
- Reports: subscription stats per package are kept for future multi-package use.
