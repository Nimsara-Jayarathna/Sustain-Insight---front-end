import { getAuthContext } from "../context/contextBridge"; // helper bridge to access AuthContext

const backendURL = import.meta.env.VITE_BACKEND_URL;

let accessToken: string | null = null;

// Allow AuthContext to inject or update in-memory token
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// -----------------------------
// 🔁 Refresh token logic
// -----------------------------
const tryRefreshToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${backendURL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // sends HttpOnly cookie
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    if (data?.accessToken) {
      accessToken = data.accessToken;
      console.info("✅ Access token refreshed");
      return true;
    }
    return false;
  } catch (err) {
    console.error("❌ Token refresh failed", err);
    accessToken = null;

    // 🔔 Trigger session-expired popup
    const auth = getAuthContext();
    if (auth) auth.setSessionExpired(true);

    return false;
  }
};

// -----------------------------
// 🌐 API fetch wrapper
// -----------------------------
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // attach Bearer token if available
  if (accessToken && !endpoint.startsWith("/api/auth")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${backendURL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // -----------------------------
  // 401/403 = maybe access expired
  // -----------------------------
  if (res.status === 401 || res.status === 403) {
    console.warn("Access token might be expired. Trying refresh...");

    const refreshed = await tryRefreshToken();
    if (refreshed && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      res = await fetch(`${backendURL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      // refresh failed → session expired popup already triggered
      throw new Error("Session expired. Please log in again.");
    }
  }

  // -----------------------------
  // Handle response
  // -----------------------------
  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.message || "Request failed.");
    } catch {
      throw new Error(text || "Request failed.");
    }
  }

  try {
    return await res.json();
  } catch {
    throw new Error("Invalid JSON response");
  }
};
