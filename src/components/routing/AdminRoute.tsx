import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ActionStatusOverlay from "../ui/ActionStatusOverlay";

export default function AdminRoute() {
  const { loading, initialize, isAuthenticated, role, rbacUnauthorized } = useAuth();

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  if (loading) {
    return (
      <ActionStatusOverlay
        status="saving"
        message="Checking administrator access..."
        onClose={() => {}}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin" || rbacUnauthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
