import { Layout } from '@/shared/layouts/Layout'
import { AppBrandingHead } from '@/shared/components/AppBrandingHead'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from '@/shared/components/RouteGuards'
import { routerBasename } from '@/shared/utils/router-basename'

import Login from '@/features/auth/pages/Login'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import UsersPage from '@/features/users/pages/UsersPage'
import Reports from '@/features/reports/pages/Reports'
import Settings from '@/features/settings/pages/Settings'
import GlobalSettingsPage from '@/features/settings/pages/globalsettings/GlobalSettingsPage'
import CountriesPage from '@/features/settings/pages/countries/CountriesPage'
import CitiesPage from '@/features/settings/pages/cities/CitiesPage'
import SupportPage from '@/features/settings/pages/support/SupportPage'
import PrivacyPolicyPage from '@/features/settings/pages/privacypolicy/PrivacyPolicyPage'
import TermsConditionsPage from '@/features/settings/pages/termsconditions/TermsConditionsPage'
import AboutUsPage from '@/features/settings/pages/aboutus/AboutUsPage'
import ContactSubjectsPage from '@/features/contact/pages/contact-subjects/ContactSubjectsPage'
import SubscriptionPackagesPage from '@/features/subscription-packages/pages/SubscriptionPackagesPage'
import SubscriptionPackageEditPage from '@/features/subscription-packages/pages/SubscriptionPackageEditPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'
import CategoryEditPage from '@/features/categories/pages/CategoryEditPage'
import SubcategoriesPage from '@/features/categories/pages/SubcategoriesPage'
import OnboardingsPage from '@/features/onboardings/pages/OnboardingsPage'
import WarrantyPeriodsPage from '@/features/warranty-periods/pages/WarrantyPeriodsPage'
import FamilyRelationsPage from '@/features/family-relations/pages/FamilyRelationsPage'

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
    <h2 className="text-2xl font-semibold opacity-50">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
)

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AppBrandingHead />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="family-relations" element={<FamilyRelationsPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="subscription-packages" element={<SubscriptionPackagesPage />} />
            <Route path="subscription-packages/:id" element={<SubscriptionPackageEditPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:id/subcategories" element={<SubcategoriesPage />} />
            <Route path="categories/:id" element={<CategoryEditPage />} />
            <Route path="onboardings" element={<OnboardingsPage />} />
            <Route path="warranty-periods" element={<WarrantyPeriodsPage />} />

            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="globalsettings" replace />} />
              <Route path="globalsettings" element={<GlobalSettingsPage />} />
              <Route path="countries" element={<CountriesPage />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="contact-subjects" element={<ContactSubjectsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="privacypolicy" element={<PrivacyPolicyPage />} />
              <Route path="termsconditions" element={<TermsConditionsPage />} />
              <Route path="aboutus" element={<AboutUsPage />} />
            </Route>

            <Route path="*" element={<Placeholder title="404 Not Found" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
