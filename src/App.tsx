import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuthContext } from "./context/AuthContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  const DEV_MODE = true; // 🔹 set to false when enforcing real auth

  if (DEV_MODE) return children;

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
        {/* Landing handles login/signup/forgot/reset inside modal */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/reset-password" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
