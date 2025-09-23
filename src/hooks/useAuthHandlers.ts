import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export function useAuthHandlers() {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as any;
    const email = form["login-email"].value;
    const password = form["login-password"].value;

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
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
      localStorage.setItem("token", data.token);
      alert("Signup successful!");
      navigate("/dashboard");
    } catch {
      alert("Signup failed");
    }
  };

  return { handleLogin, handleSignup };
}
