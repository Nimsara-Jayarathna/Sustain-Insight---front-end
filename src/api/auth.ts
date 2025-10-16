// src/api/auth.ts
import { apiFetch } from "../utils/api";
import { extractErrorMessage } from "../utils/errorHandler";

export interface LoginResponse {
  accessToken: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  message?: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  try {
    const data = await apiFetch("/api/auth/refresh-token", {
      method: "POST",
    });
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    // Logout errors aren’t critical — we just log them
    console.warn("⚠️ Logout failed:", extractErrorMessage(err));
  }
}
