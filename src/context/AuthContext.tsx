import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/authStore";
import type { AuthState } from "../stores/authStore";

type AuthContextValue = AuthState;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthStore();
  const value = useMemo(() => auth, [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }
  return context;
}
