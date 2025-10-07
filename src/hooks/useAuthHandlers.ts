import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export function useAuthHandlers() {
  const { login } = useAuthContext();

  // 🔹 LOGIN HANDLER
  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      const loginData = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // fetch user profile
      const userData = await apiFetch("/api/account/me", {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });

      login(loginData.token, userData);
    } catch (err: any) {
      // Pass error up for specific handling (e.g. EMAIL_NOT_VERIFIED)
      throw err;
    }
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
    // No auto-login — wait until verification
  };

  // 🔹 FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (email: string): Promise<void> => {
    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  // 🔹 VERIFY EMAIL HANDLER (fixed)
const handleVerifyEmail = async (token: string): Promise<void> => {
  // Send as query param, not body
  await apiFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "POST",
  });
};


  // 🔹 RESEND VERIFICATION EMAIL HANDLER
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
