import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuthContext } from "./context/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.warn("⚠️ Tried to access private route without auth");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing routes handle login/signup/forgot/reset/verify */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<LandingPage />} />
        <Route path="/forgot-password" element={<LandingPage openForgotInitially />} />

        {/* ✅ NEW: Email verification route */}
        <Route path="/verify-email" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Optional: fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
