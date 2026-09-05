import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { PublicTripPage } from './pages/PublicTripPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { TripCalendarPage } from './pages/TripCalendarPage';
import { TripBudgetPage } from './pages/TripBudgetPage';
import { GlobalSearchPage } from './pages/GlobalSearchPage';
import { GlobalCalendarPage } from './pages/GlobalCalendarPage';
import { ProfilePage } from './pages/ProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TravelerBookingsPage } from './pages/TravelerBookingsPage';

// PS7: Operator Portal Pages
import { OperatorDashboardPage } from './pages/OperatorDashboardPage';
import { BookingManagementPage } from './pages/BookingManagementPage';
import { VendorManagementPage } from './pages/VendorManagementPage';
import { TourGroupsPage } from './pages/TourGroupsPage';
import { CoordinatorManagementPage } from './pages/CoordinatorManagementPage';
import { ItineraryChangesPage } from './pages/ItineraryChangesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ScheduleCalendarPage } from './pages/ScheduleCalendarPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
          {/* Global Toast Notification System */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#18181b',
                color: '#ffffff',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/trips/:shareSlug" element={<PublicTripPage />} />

            {/* Authenticated Workspace Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="trips" element={<MyTripsPage />} />
              <Route path="bookings" element={<TravelerBookingsPage />} />
              <Route path="trips/new" element={<CreateTripPage />} />
              <Route path="trips/:tripId" element={<Navigate to="builder" replace />} />
              <Route path="trips/:tripId/builder" element={<ItineraryBuilderPage />} />
              <Route path="trips/:tripId/view" element={<ItineraryViewPage />} />
              <Route path="trips/:tripId/calendar" element={<TripCalendarPage />} />
              <Route path="trips/:tripId/budget" element={<TripBudgetPage />} />
              <Route path="search" element={<GlobalSearchPage />} />
              <Route path="activities" element={<ActivitySearchPage />} />
              <Route path="calendar" element={<GlobalCalendarPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="admin" element={<AdminDashboardPage />} />

              {/* PS7: Operator Workspace Sub-Routes */}
              <Route path="operator" element={<OperatorDashboardPage />} />
              <Route path="operator/bookings" element={<BookingManagementPage />} />
              <Route path="operator/vendors" element={<VendorManagementPage />} />
              <Route path="operator/tour-groups" element={<TourGroupsPage />} />
              <Route path="operator/coordinators" element={<CoordinatorManagementPage />} />
              <Route path="operator/changes" element={<ItineraryChangesPage />} />
              <Route path="operator/payments" element={<PaymentsPage />} />
              <Route path="operator/schedule" element={<ScheduleCalendarPage />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
