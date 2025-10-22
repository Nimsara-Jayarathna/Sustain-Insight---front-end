import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import GradientSpinner from "../ui/GradientSpinner";
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
  const PASSWORD_LIMIT = 20;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      setSuccess(true);
      setLoading(false);
      // The overlay will show "Password successfully updated!" and auto-close.
      // After it closes, we switch to the login view. Total delay ~2 seconds.
      setTimeout(() => {
        onSwitch("login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
          Choose a new password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          Create a secure password to regain access to your Sustain Insight dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Input with Icon */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, PASSWORD_LIMIT))}
              disabled={loading}
              placeholder="New Password"
              maxLength={PASSWORD_LIMIT}
              className="w-full rounded-lg border border-gray-300 bg-white/80 pl-10 pr-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Confirm Password Input with Icon */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.slice(0, PASSWORD_LIMIT))}
              disabled={loading}
              placeholder="Confirm New Password"
              maxLength={PASSWORD_LIMIT}
              className="w-full rounded-lg border border-gray-300 bg-white/80 pl-10 pr-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading || success}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <GradientSpinner className="-ml-1 mr-3 h-5 w-5" strokeWidth={2.5} />
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back to Login Link */}
          <div className="pt-2 text-center text-sm text-gray-600 dark:text-slate-300">
            <span>Remembered your password? </span>
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
      </form>

      {/* Unified overlay for SUCCESS or ERROR (post-submit) */}
      {(success || error) && (
        <AuthLoadingOverlay
          loading={false} // Loading is handled by the button
          success={success}
          error={error}
          message={success ? "Password updated successfully!" : error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
