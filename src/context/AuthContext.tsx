// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, setAccessToken } from "../utils/api";
import { extractErrorMessage } from "../utils/errorHandler";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshAccessToken,
} from "../api/auth";

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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  //
  // 🔁 Silent refresh on initial load
  //
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data: RefreshResponse = await refreshAccessToken();
        if (data?.accessToken) {
          setToken(data.accessToken);
          setAccessToken(data.accessToken);

          // ✅ If backend returned user info, set it directly
          if (data.firstName && data.lastName && data.email) {
            setUser({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            });
            console.info("✅ Session restored via refresh token (with user)");
          } else {
            // ✅ Otherwise fetch user profile using apiFetch
            const profile = await apiFetch("/api/account/me");
            setUser({
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
            });
            console.info("✅ Session restored via refresh token (fetched user)");
          }
        } else {
          throw new Error("No access token returned");
        }
      } catch (err) {
        console.warn("⚠️ Silent refresh failed:", extractErrorMessage(err));
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
  // 🔐 Login
  //
  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      setToken(res.accessToken);
      setAccessToken(res.accessToken);
      setUser({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
      });
      setSessionExpired(false);
      console.info("✅ Logged in successfully");
    } catch (err) {
      const message = extractErrorMessage(err);
      console.error("❌ Login failed:", message);
      throw new Error(message);
    }
  };

  //
  // 🚪 Logout
  //
  const logout = async () => {
    try {
      await apiLogout();
      console.info("👋 Logged out");
    } catch (err) {
      console.warn("⚠️ Logout request failed:", extractErrorMessage(err));
    } finally {
      setToken(null);
      setAccessToken(null);
      setUser(null);
      setSessionExpired(false);
    }
  };

  //
  // 🧩 Context Provider
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
// 🔹 Hook for Access
//
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("❌ useAuthContext must be used inside <AuthProvider>");
  return ctx;
};
