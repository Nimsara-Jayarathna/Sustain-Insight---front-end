import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AuthLoadingOverlay from "./components/ui/AuthLoadingOverlay";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { sessionExpired, setSessionExpired, logout, initialize } = useAuth();

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  const handleSessionClose = async () => {
    setSessionExpired(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<LandingPage />} />
        <Route path="/forgot-password" element={<LandingPage openForgotInitially />} />
        <Route path="/verify-email" element={<LandingPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
