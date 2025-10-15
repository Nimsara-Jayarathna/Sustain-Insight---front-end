// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshAccessToken,
} from "../api/auth";
import { setAccessToken } from "../utils/api";

//
// ──────────────────────────────────────────────────────────────
// 🔹 Type Definitions
// ──────────────────────────────────────────────────────────────
//
type User = { firstName: string; lastName: string; email: string };
type RefreshResponse = { accessToken: string } & Partial<User>;

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  setSessionExpired: (v: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

//
// ──────────────────────────────────────────────────────────────
// 🔹 Context Initialization
// ──────────────────────────────────────────────────────────────
//
const AuthContext = createContext<AuthContextType | null>(null);

//
// ──────────────────────────────────────────────────────────────
// 🔹 Auth Provider Implementation
// ──────────────────────────────────────────────────────────────
//
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  //
  // ──────────────────────────────────────────────────────────────
  // 🔁 Silent refresh on initial load (restore session)
  // ──────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data: RefreshResponse = await refreshAccessToken(); // backend reads refreshToken cookie
        if (data?.accessToken) {
          setToken(data.accessToken);
          setAccessToken(data.accessToken);

          // ✅ If backend includes user info → set immediately
          if (data.firstName && data.lastName && data.email) {
            setUser({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            });
            console.info("✅ Session restored via refresh token (with user)");
          } else {
            // ✅ Otherwise fetch from /api/account/me
            const profileRes = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/account/me`,
              {
                headers: { Authorization: `Bearer ${data.accessToken}` },
                credentials: "include",
              }
            );

            if (profileRes.ok) {
              const profile = await profileRes.json();
              setUser({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
              });
              console.info("✅ Session restored via refresh token (fetched user)");
            } else {
              console.warn(
                "⚠️ Access token valid, but /account/me failed:",
                profileRes.status
              );
              setUser(null);
            }
          }
        } else {
          throw new Error("No access token returned");
        }
      } catch (err) {
        console.warn("⚠️ Silent refresh failed:", err);
        setToken(null);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  //
  // ──────────────────────────────────────────────────────────────
  // 🔐 Login Handler
  // ──────────────────────────────────────────────────────────────
  //
  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password); // backend sets refresh cookie
    setToken(res.accessToken);
    setAccessToken(res.accessToken);
    setUser({
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
    });
    setSessionExpired(false);
    console.info("✅ Logged in successfully");
  };

  //
  // ──────────────────────────────────────────────────────────────
  // 🚪 Logout Handler
  // ──────────────────────────────────────────────────────────────
  //
  const logout = async () => {
    try {
      await apiLogout(); // backend clears cookie
      console.info("👋 Logged out");
    } catch (err) {
      console.warn("⚠️ Logout request failed:", err);
    } finally {
      setToken(null);
      setAccessToken(null);
      setUser(null);
      setSessionExpired(false);
    }
  };

  //
  // ──────────────────────────────────────────────────────────────
  // 🧩 Context Provider
  // ──────────────────────────────────────────────────────────────
  //
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        sessionExpired,
        setSessionExpired,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//
// ──────────────────────────────────────────────────────────────
// 🔹 Hook for Easy Access
// ──────────────────────────────────────────────────────────────
//
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("❌ useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
