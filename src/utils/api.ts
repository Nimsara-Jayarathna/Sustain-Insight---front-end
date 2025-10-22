// src/utils/api.ts
import { getAuthContext } from "../context/contextBridge";
import { extractErrorMessage } from "./errorHandler";

const backendURL = import.meta.env.VITE_BACKEND_URL;
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// 🔁 Refresh token logic
const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${backendURL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      accessToken = null;
      return false;
    }

    const data = await res.json();
    if (data?.accessToken) {
      accessToken = data.accessToken;
      return true;
    }
    accessToken = null;
    return false;
  } catch {
    accessToken = null;
    return false;
  }
};

// 🌐 Main API fetch wrapper
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>) || {},
  };

  const isAuthEndpoint = endpoint.startsWith("/api/auth");

  // attach token only if not an auth endpoint
  if (accessToken && !isAuthEndpoint) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const isRefreshEndpoint = endpoint.includes("/api/auth/refresh-token");

  // 🔒 Only retry refresh if:
  // - not an auth route (e.g., login, signup, forgot-password)
  // - not already a refresh request
  if ((res.status === 401 || res.status === 403) && !isAuthEndpoint && !isRefreshEndpoint) {
    const refreshed = await tryRefreshToken();
    if (refreshed && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      res = await fetch(`${backendURL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      const auth = getAuthContext();
      if (auth) auth.setSessionExpired(true);
      throw new Error("Session expired. Please log in again.");
    }
  }

  // Parse response safely
  let rawText = "";
  let data: any = null;
  try {
    rawText = await res.text();
    data = JSON.parse(rawText);
  } catch {
    data = rawText;
  }

  // Unified error handling
  if (!res.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return typeof data === "object" ? data : {};
};
