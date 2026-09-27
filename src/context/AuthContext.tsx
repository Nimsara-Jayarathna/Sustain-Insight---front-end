// src/context/AuthContext.tsx
import React, { useEffect, useState } from "react";
import { apiFetch, setAccessToken } from "../utils/api";
import { extractErrorMessage } from "../utils/errorHandler";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshAccessToken,
} from "../api/auth";
import { AuthContext, type AuthUser } from "./authContextValue";

type RefreshResponse = { accessToken: string } & Partial<AuthUser>;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  //
  // 🔁 Silent refresh on initial load
  //
  const refreshUser = async () => {
    try {
      const profile = await apiFetch<AuthUser>("/api/account/me");
      setUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    } catch {
      // ignore refresh errors
    }
  };

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data: RefreshResponse = await refreshAccessToken();
        if (data?.accessToken) {
          setToken(data.accessToken);
          setAccessToken(data.accessToken);

          if (data.firstName && data.lastName && data.email) {
            setUser({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            });
          } else {
            await refreshUser();
          }
        } else {
          throw new Error("No access token returned");
        }
      } catch {
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
    } catch (err) {
      const message = extractErrorMessage(err);
      throw new Error(message);
    }
  };

  //
  // 🚪 Logout
  //
  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore logout errors
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
