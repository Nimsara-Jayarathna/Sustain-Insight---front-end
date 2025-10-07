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
    <div className="relative">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Please enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="New Password"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              placeholder="Confirm New Password"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
            />
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full flex items-center justify-center h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:shadow-inner disabled:translate-y-0.5`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Resetting...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center text-sm text-gray-600 pt-2">
            <span>Remembered your password? </span>
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className="font-medium text-emerald-600 hover:underline"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>

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