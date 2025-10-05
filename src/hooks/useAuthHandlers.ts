import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export function useAuthHandlers() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  // 🔹 LOGIN HANDLER
  const handleLogin = async (email: string, password: string): Promise<void> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Login failed. Please try again.");
    }

    const loginData = await response.json();

    const userResponse = await fetch("/api/account/me", {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to load user profile.");
    }

    const userData = await userResponse.json();

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
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Signup failed. Please try again.");
    }

    const signupData = await response.json();

    login(signupData.token, {
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  const handleForgotPassword = async (email: string): Promise<void> => {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to send reset link.");
  }
};


  return { handleLogin, handleSignup, handleForgotPassword};
}
