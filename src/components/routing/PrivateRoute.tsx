import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ActionStatusOverlay from "../ui/ActionStatusOverlay";

export default function PrivateRoute() {
  const { isAuthenticated, loading, initialize } = useAuth();

  useEffect(() => {
    initialize?.();
  }, [initialize]);

  if (loading) {
    return (
      <ActionStatusOverlay
        status="saving"
        message="Checking your session..."
        onClose={() => {}}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
