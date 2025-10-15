// src/hooks/useAuthHandlers.ts
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
// import { login as apiLogin } from "../api/auth";

export function useAuthHandlers() {
  const { login } = useAuthContext();

  // 🔹 LOGIN HANDLER (only call context login)
  const handleLogin = async (email: string, password: string): Promise<void> => {
    await login(email, password);
  };

  // 🔹 SIGNUP HANDLER
  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    password: string;
  }): Promise<void> => {
    await apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  // 🔹 FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (email: string): Promise<void> => {
    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  // 🔹 VERIFY EMAIL HANDLER
  const handleVerifyEmail = async (token: string): Promise<void> => {
    await apiFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "POST",
    });
  };

  // 🔹 RESEND VERIFICATION HANDLER
  const handleResendVerification = async (email: string): Promise<void> => {
    await apiFetch("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleVerifyEmail,
    handleResendVerification,
  };
}
