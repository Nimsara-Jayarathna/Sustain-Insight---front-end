//src/api/auth.ts
// import { apiFetch } from "../utils/api";

interface LoginResponse {
  accessToken: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 🔐 includes refresh cookie
  });

  if (!res.ok) {
    const errText = await res.text();
    try {
      const err = JSON.parse(errText);
      throw new Error(err.message || "Login failed");
    } catch {
      throw new Error(errText || "Login failed");
    }
  }

  return res.json();
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`, {
    method: "POST",
    credentials: "include", // send refresh cookie automatically
  });

  if (!res.ok) {
    throw new Error("Session expired or invalid refresh token");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
