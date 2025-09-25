import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { useAuthContext } from "../context/AuthContext";

export function useAuthHandlers() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as any;
    const email = form["login-email"].value;
    const password = form["login-password"].value;

    try {
      const loginData = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const userData = await apiFetch("/api/account/me", {
        headers: { Authorization: `Bearer ${loginData.token}` },
      });

      login(loginData.token, userData);
      alert("Login successful!");
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as any;
    const body = {
      firstName: form["signup-first-name"].value,
      lastName: form["signup-last-name"].value,
      jobTitle: form["signup-title"].value,
      email: form["signup-email"].value,
      password: form["signup-password"].value,
    };

    try {
      const data = await apiFetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      login(data.token, {
        firstName: body.firstName,
        lastName: body.lastName,
      });
      alert("Signup successful!");
      navigate("/dashboard");
    } catch {
      alert("Signup failed");
    }
  };

  return { handleLogin, handleSignup };
}
