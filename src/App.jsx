import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import OfflineDetector from './components/common/OfflineDetector';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingApproval from './pages/auth/PendingApproval';

// Profile Pages
import CreateProfile from './pages/profile/CreateProfile';
import ViewProfile from './pages/profile/ViewProfile';
import EditProfile from './pages/profile/EditProfile';

// Matching Pages
import Browse from './pages/matching/Browse';
import Matches from './pages/matching/Matches';
import MatchHistory from './pages/matching/MatchHistory';

// Message Pages
import Conversations from './pages/messages/Conversations';
import ChatThread from './pages/messages/ChatThread';

// Notification Pages
import NotificationList from './pages/notifications/NotificationList';

// Settings Pages
import Account from './pages/settings/Account';
import Invites from './pages/settings/Invites';
import BlockedUsers from './pages/settings/BlockedUsers';
import Reports from './pages/settings/Reports';

// Verification Pages
import VerificationStatus from './pages/verification/VerificationStatus';
import UploadSelfie from './pages/verification/UploadSelfie';
import UploadID from './pages/verification/UploadID';

// Report Pages
import ReportUser from './pages/reports/ReportUser';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import PendingUsers from './pages/admin/PendingUsers';
import PendingProfiles from './pages/admin/PendingProfiles';
import Verifications from './pages/admin/Verifications';
import AdminReports from './pages/admin/AdminReports';
import Statistics from './pages/admin/Statistics';
import AdminInvites from './pages/admin/AdminInvites';

// Other Pages
import NotFound from './pages/NotFound';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requireActive = true, requireProfile = false, adminOnly = false }) => {
  const { currentUser, userProfile, loading, isAdmin, isActive, isPending } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/browse" replace />;
  }

  if (!adminOnly && isPending) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (requireActive && !isActive && !isAdmin) {
    return <Navigate to="/pending-approval" replace />;
  }

  if (requireProfile && !userProfile && !isAdmin) {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { currentUser, loading, isAdmin, isActive, isPending, hasProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (currentUser) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isPending) {
      return <Navigate to="/pending-approval" replace />;
    } else if (isActive && !hasProfile) {
      return <Navigate to="/create-profile" replace />;
    } else if (isActive && hasProfile) {
      return <Navigate to="/browse" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Pending Approval - accessible to logged in users regardless of status */}
                <Route
                  path="/pending-approval"
                  element={<PendingApproval />}
                />

                {/* Profile Routes */}
                <Route
                  path="/create-profile"
                  element={
                    <ProtectedRoute requireProfile={false}>
                      <CreateProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/me"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <ViewProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Matching Routes */}
                <Route
                  path="/browse"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <Browse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <Matches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <MatchHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Message Routes */}
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <Conversations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages/:matchId"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <ChatThread />
                    </ProtectedRoute>
                  }
                />

                {/* Notification Routes */}
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <NotificationList />
                    </ProtectedRoute>
                  }
                />

                {/* Verification Routes */}
                <Route
                  path="/verification/status"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <VerificationStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verification/selfie"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <UploadSelfie />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verification/id"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <UploadID />
                    </ProtectedRoute>
                  }
                />

                {/* Report Routes */}
                <Route
                  path="/report/:userId"
                  element={
                    <ProtectedRoute requireProfile={true}>
                      <ReportUser />
                    </ProtectedRoute>
                  }
                />

                {/* Settings Routes */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/invites"
                  element={
                    <ProtectedRoute>
                      <Invites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/blocked"
                  element={
                    <ProtectedRoute>
                      <BlockedUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Login - separate from user login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/pending"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <PendingUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profiles/pending"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <PendingProfiles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/verifications"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Verifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/statistics"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Statistics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/invites"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminInvites />
                    </ProtectedRoute>
                  }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Offline Detector */}
              <OfflineDetector />

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#363636',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
