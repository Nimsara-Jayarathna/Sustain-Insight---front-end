import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuthContext } from "./context/AuthContext";
import AuthLoadingOverlay from "./components/ui/AuthLoadingOverlay";

//
// ──────────────────────────────────────────────────────────────
// 🔒 Private Route (Protects Authenticated Areas)
// ──────────────────────────────────────────────────────────────
//
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  // 🕒 Wait until auth state is fully resolved
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-gray-500 text-sm">
        Checking session...
      </div>
    );
  }

  // 🚪 If not authenticated → redirect to landing page
  if (!isAuthenticated) {
    console.warn("⚠️ Tried to access private route without auth");
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
  const { sessionExpired, setSessionExpired, logout } = useAuthContext();

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
