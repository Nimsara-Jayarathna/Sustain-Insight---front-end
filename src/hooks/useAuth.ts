// src/hooks/useAuth.ts
import { useAuthContext } from "./useAuthContext";

export const useAuth = () => {
  const { user, token, loading, isAuthenticated, login, logout } = useAuthContext();
  return { user, token, loading, isAuthenticated, login, logout };
};
