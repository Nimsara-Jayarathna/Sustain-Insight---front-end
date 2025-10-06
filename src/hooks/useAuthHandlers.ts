import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export function useAuthHandlers() {
  const { login } = useAuthContext();

  // 🔹 LOGIN HANDLER
  const handleLogin = async (email: string, password: string): Promise<void> => {
    // Call backend for authentication
    const loginData = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Then fetch the user profile
    const userData = await apiFetch("/api/account/me", {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });

    // Save auth state globally
    login(loginData.token, userData);
  };

  // 🔹 SIGNUP HANDLER
  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    password: string;
  }): Promise<void> => {
    const signupData = await apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Save token and partial user info
    login(signupData.token, {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  // 🔹 FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (email: string): Promise<void> => {
    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return { handleLogin, handleSignup, handleForgotPassword };
}
