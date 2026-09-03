# Routing & Navigation

## Route map

| Path | Component |
|------|-----------|
| `/login` | Login |
| `/` | Dashboard |
| `/users` | UsersPage |
| `/reports` | Reports |
| `/settings/globalsettings` | GlobalSettingsPage |
| `/settings/countries` | CountriesPage |
| `/settings/cities` | CitiesPage |
| `/settings/footer` | FooterPage |
| `/settings/support` | SupportPage |
| `/settings/privacypolicy` | PrivacyPolicyPage |
| `/settings/termsconditions` | TermsConditionsPage |
| `/settings/aboutus` | AboutUsPage |

## Sidebar nav

Defined in `Sidebar.tsx`: Dashboard, Users, Reports, and an expandable **Settings** group.

Settings sub-pages (from `SidebarLinks.ts`) appear nested under Settings in the sidebar:

- Global Settings, Countries, Cities
- About Us, Privacy Policy, Terms & Conditions
- Contact Subjects, Support (contact messages), Footer

Also reachable via Header user menu → Settings dropdown.

## Guards

`RouteGuards.tsx`:
- `ProtectedRoute` — requires `auth_token`
- `PublicRoute` — redirects authenticated users away from login

## Adding a route

1. Import page in `App.tsx`
2. Add `<Route>` inside protected Layout
3. Add nav item to `Sidebar.tsx` if top-level
4. Add `routeTitles` entry in `Header.tsx` if needed
