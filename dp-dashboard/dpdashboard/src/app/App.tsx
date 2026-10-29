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
import { useTranslation } from 'react-i18next'
import OnboardingsPage from '@/features/onboardings/pages/OnboardingsPage'
import ScreensPage from '@/features/screens/pages/ScreensPage'
import ScreenEditPage from '@/features/screens/pages/ScreenEditPage'
import WarrantyPeriodsPage from '@/features/warranty-periods/pages/WarrantyPeriodsPage'
import FamilyRelationsPage from '@/features/family-relations/pages/FamilyRelationsPage'
import NotificationSettingsPage from '@/features/notifications/pages/settings/NotificationSettingsPage'
import NotificationLogsPage from '@/features/notifications/pages/logs/NotificationLogsPage'
import SendNotificationPage from '@/features/notifications/pages/send/SendNotificationPage'
import ExpiringWarrantiesPage from '@/features/dashboard/pages/ExpiringWarrantiesPage'
import SubscriberFollowUpPage from '@/features/dashboard/pages/SubscriberFollowUpPage'
import DiscountCodesPage from '@/features/discount-codes/pages/DiscountCodesPage'
import SubscriptionSettingsPage from '@/features/settings/pages/subscriptionsettings/SubscriptionSettingsPage'
import PartnersPage from '@/features/partners/pages/PartnersPage'
import PartnerSectorsPage from '@/features/partner-sectors/pages/PartnerSectorsPage'

const Placeholder = ({ title }: { title: string }) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <h2 className="text-2xl font-semibold opacity-50">{title}</h2>
      <p className="text-muted-foreground">{t('pageUnderConstruction')}</p>
    </div>
  )
}

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
            <Route path="discount-codes" element={<DiscountCodesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:id/subcategories" element={<SubcategoriesPage />} />
            <Route path="categories/:id" element={<CategoryEditPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="partner-sectors" element={<PartnerSectorsPage />} />
            <Route path="onboardings" element={<OnboardingsPage />} />
            <Route path="screens" element={<ScreensPage />} />
            <Route path="screens/:id" element={<ScreenEditPage />} />
            <Route path="warranty-periods" element={<WarrantyPeriodsPage />} />
            <Route path="expiring-warranties" element={<ExpiringWarrantiesPage />} />
            <Route path="subscriber-follow-up" element={<SubscriberFollowUpPage />} />
            <Route path="send-notification" element={<SendNotificationPage />} />
            <Route path="notification-settings" element={<NotificationSettingsPage />} />
            <Route path="notification-logs" element={<NotificationLogsPage />} />

            <Route path="contact-messages" element={<Navigate to="/settings/support" replace />} />

            <Route path="settings" element={<Settings />}>
              <Route index element={<Navigate to="globalsettings" replace />} />
              <Route path="globalsettings" element={<GlobalSettingsPage />} />
              <Route path="subscriptionsettings" element={<SubscriptionSettingsPage />} />
              <Route path="countries" element={<CountriesPage />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="contact-subjects" element={<ContactSubjectsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="contact-messages" element={<Navigate to="/settings/support" replace />} />
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
