import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AuthLoadingOverlay from "./components/ui/AuthLoadingOverlay";
import ActionStatusOverlay from "./components/ui/ActionStatusOverlay";
import { useAuth } from "./hooks/useAuth";

//
// ──────────────────────────────────────────────────────────────
// 🔒 Private Route (Protects Authenticated Areas)
// ──────────────────────────────────────────────────────────────
//
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, initialize } = useAuth();

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  // 🕒 Wait until auth state is fully resolved
  if (loading) {
    return (
      <ActionStatusOverlay
        status="saving"
        message="Checking your session..."
        onClose={() => {}}
      />
    );
  }

  // 🚪 If not authenticated → redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authenticated → allow access
  return <>{children}</>;
}

//
// ──────────────────────────────────────────────────────────────
// 🌍 App Router
// ──────────────────────────────────────────────────────────────
//
export default function App() {
  const { sessionExpired, setSessionExpired, logout, initialize } = useAuth();

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  // 🚪 Handles session-expiry popup close → logs out and redirects
  const handleSessionClose = async () => {
    setSessionExpired(false);
    await logout();
    window.location.href = "/"; // Hard redirect to clear all state
  };

  return (
    <Router>
      <Routes>
        {/* ─── Public Routes ─── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<LandingPage />} />
        <Route path="/forgot-password" element={<LandingPage openForgotInitially />} />
        <Route path="/verify-email" element={<LandingPage />} />

        {/* ─── Protected Routes ─── */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* ─── Fallback Route ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ──────────────────────────────────────────────
          ⚠️ Session Expired Popup Overlay
         ────────────────────────────────────────────── */}
      {sessionExpired && (
        <AuthLoadingOverlay
          loading={false}
          error="Your session has expired. Please log in again."
          message="Your session has expired. Please log in again."
          onClose={handleSessionClose}
        />
      )}
    </Router>
  );
}
