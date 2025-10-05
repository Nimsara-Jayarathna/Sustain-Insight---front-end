import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";

export default function LoginForm({
  onSubmit,
  onSwitch,
}: {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitch: (v: "login" | "signup" | "forgot") => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      await onSubmit(email, password);

      // ✅ show “Authenticated!” popup briefly before redirect
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
      setLoading(false);
      // auto-hide error popup after 2s
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Welcome Back</h2>

        {/* Email */}
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm
              focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100
              disabled:opacity-50"
          />
        </div>

        {/* Error message below form */}
        {error && (
          <p className="text-sm text-center text-red-500 mt-1">{error}</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-black disabled:opacity-60 transition"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Switch to signup / forgot password */}
        <p className="text-center text-sm text-gray-600">
          No account?{" "}
          <button
            type="button"
            onClick={() => onSwitch("signup")}
            className="font-medium text-emerald-700 hover:underline"
            disabled={loading}
          >
            Create one
          </button>
        </p>
        <p className="text-center text-sm mt-1">
          <button
            type="button"
            onClick={() => onSwitch("forgot")}
            className="font-medium text-emerald-700 hover:underline"
            disabled={loading}
          >
            Forgot password?
          </button>
        </p>
      </form>

      {/* 🔹 Unified overlay for authenticating / success / error */}
      {(loading || success || error) && (
        <AuthLoadingOverlay
          loading={loading}
          success={success}
          error={error}
          message={
            success
              ? "✅ Authenticated! Redirecting..."
              : error
              ? error
              : "Authenticating..."
          }
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
