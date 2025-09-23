import React from "react";
import { apiFetch } from "../../utils/api";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }: { onSwitch: (v: "login" | "signup") => void }) {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (document.getElementById("login-email") as HTMLInputElement).value;
    const password = (document.getElementById("login-password") as HTMLInputElement).value;

    try {
      console.log("DEBUG → Sending login request with", { email, password });
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("DEBUG → Login response:", res);

      if (!res.token) {
        alert("Login failed: No token returned");
        return;
      }

      login(res.token, { name: res.user?.firstName || "User" });
      console.log("DEBUG → Token stored:", res.token);

      navigate("/dashboard"); // ✅ stays SPA, logs stay visible
    } catch (err) {
      console.error("DEBUG → Login failed:", err);
      alert("Login failed, check console for details");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome Back</h2>

      <div>
        <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
            focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-600">
        No account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          className="font-medium text-emerald-700 hover:underline"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
