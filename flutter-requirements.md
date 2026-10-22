# Herz — Flutter App Requirements (UI only, no backend changes)

Source: client handover meeting with Majed (CS66620), 2026-10-21. Timestamps refer to the meeting recording.

These items change only the Flutter app. Anything that also needs API or dashboard work is in [backend-requirements.md](backend-requirements.md).

---

## 1. Home screen: three ways to add an invoice

**Current:** Home has two boxes: "Smart invoice scan" and "Manual invoice entry". Tapping smart scan opens a chooser (camera or gallery).

**Required:** Show three separate options on the home screen (under the "Indicators & Operations" quick access):

| # | Option | Behavior |
|---|--------|----------|
| 1 | Smart invoice scan (AI) | Opens the **camera directly**, with no camera/gallery chooser |
| 2 | Manual invoice entry | Same manual form as today |
| 3 | Upload invoice from gallery / phone files | Opens the gallery / file picker, then runs the same AI analysis and pre-fills the form |

- Fewer steps is the goal: one tap → camera → capture → done.
- The scan screen's "Start scan" button should also open the camera only. Gallery upload moves to option 3.

Refs: 7:55–9:38, 11:34–11:48, 27:35–27:46

## 2. Bottom navigation bar: swap Home and Scan

**Current:** The center button of the bottom bar is the scan icon. "Home" is on the right.

**Required:**
- Put **Home** in the **center** slot, large and prominent, replacing the scan icon.
- Put **Scan** in the right-side slot where Home used to be.

Refs: 27:13–28:54

## 3. Phone number input format (every phone field)

**Current:** The hint shows `+966…`, and there was discussion of separate fixed `+966` / `05` sections.

**Required:**
- No `+966` country-code section and no locked `05` prefix section.
- The user types the full local number directly, starting with `05` (e.g. `05XXXXXXXX`).
- The placeholder/hint shows the `05` format as the example (e.g. `05XXXXXXXX`).
- Applies to **every** phone field in the app: registration, login, add family member, profile edit, and any other phone input.

> The backend must accept and normalize this format. See backend doc §6.

Refs: 14:52–17:28, 30:45–30:47

## 4. Indicators & Operations screen: expired warranties

**Required:**
- **Top KPI cards:** add an **"Expired warranties"** card next to "Active warranties".
- **Bottom "Warranties & Operations" list:** add an **"Expired"** filter tab next to the existing `All / Active / Expiring soon` tabs.
- The top card and the bottom tab open the **same** filtered view.

> Check that the warranties API supports an `expired` status filter. If it does not, see backend doc §8.

Refs: 22:32–23:43

## 5. Indicators & Operations: quick access (confirm only)

The client considers this screen very important. It must stay reachable in one tap from the home screen (quick access under the title/app bar) as well as from "My Account". This already works, so no change is needed; just don't remove it.

Refs: 26:15–26:58

---

## Confirmed as-is (no change requested)

- Guest mode: can browse, view privacy policy, terms, and contact us. Cannot scan, add invoices, or add family members until logged in.
- Invoice details: edit/delete product warranty, return-period status, delete invoice, zoom invoice image.
- Invoices list: filter by family member, pull to refresh to show invoices added by family members.
- Family member flow: permissions (view / delete invoices / delete family members' invoices), relationship label, per-member reports.
- Family-member account: sees the parent's invoices according to the permissions granted, and cannot delete the main account.
- Profile edit, light/dark theme, language switch, notification settings, custom categories, static pages, contact us.
