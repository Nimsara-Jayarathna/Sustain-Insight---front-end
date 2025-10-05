import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import { apiFetch } from "../../utils/api";

export default function ResetPasswordForm({
  token,
  onSwitch,
}: {
  token: string;
  onSwitch: (v: "login" | "signup" | "forgot" | "reset") => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use apiFetch to ensure backendURL is prefixed automatically
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      // ✅ Success
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        onSwitch("login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Reset Password</h2>
        <p className="text-sm text-gray-600">
          Please enter your new password below. Your reset link is valid for a
          limited time.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm 
              focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Back to{" "}
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="font-medium text-emerald-700 hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </form>

      {/* Overlay feedback */}
      {(loading || success || error) && (
        <AuthLoadingOverlay
          loading={loading}
          success={success}
          error={error}
          message={
            success
              ? "✅ Password successfully updated!"
              : error
              ? error
              : "Resetting password..."
          }
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
