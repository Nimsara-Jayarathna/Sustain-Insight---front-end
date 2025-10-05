// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";

export default function ForgotPasswordForm({
  onSubmit,
  onSwitch,
}: {
  onSubmit: (email: string) => Promise<void>;
  onSwitch: (v: "login" | "signup" | "forgot") => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(email);
      setSuccess(true);
      setLoading(false); // Add this line
      setTimeout(() => {
        onSwitch("login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Forgot Password</h2>
        <p className="text-sm text-gray-600">
          Enter your email address and we’ll send you a password reset link.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-sm text-center text-red-500 mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-emerald-700 disabled:opacity-60 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="font-medium text-emerald-700 hover:underline"
            disabled={loading}
          >
            Back to Login
          </button>
        </p>
      </form>

      {(loading || success || error) && (
        <AuthLoadingOverlay
          loading={loading}
          success={success}
          error={error}
          message={
            success
              ? "✅ Reset link sent! Check your inbox."
              : error
              ? error
              : "Sending reset link..."
          }
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
