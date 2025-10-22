import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import GradientSpinner from "../ui/GradientSpinner";
import { useAuthHandlers } from "../../hooks/useAuthHandlers";

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
  const [showResend, setShowResend] = useState(false);

  // Separate states for the resend verification functionality
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds

  const navigate = useNavigate();
  const { handleResendVerification } = useAuthHandlers();

  // Effect to manage the cooldown timer countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 🚫 Prevent multiple rapid submissions
  if (loading || resendLoading) return;

  setError("");
  setSuccess(false);
  setShowResend(false);
  setLoading(true);

  try {
    // 🔐 Attempt login
    await onSubmit(email.trim(), password);

    // ✅ Show success and navigate smoothly
    setSuccess(true);
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
      setLoading(false);
    }, 800); // Slightly shorter delay for smoother UX
  } catch (err: any) {
    const msg = err?.message || "Invalid email or password.";

    // 📩 Handle unverified email case
    if (err.code === "EMAIL_NOT_VERIFIED" || msg.includes("not been verified")) {
      setShowResend(true);
      setError("Your email is not verified. Please verify to continue.");
    } else {
      setError(msg);
    }

    setLoading(false);
  }
};


  const handleResend = async () => {
    if (cooldown > 0) return; // Block if still in cooldown
    try {
      setResendLoading(true);
      setError(""); // Clear previous errors
      await handleResendVerification(email);
      setResendSuccess(true);
      setCooldown(60); // Set a 60-second cooldown
      // Hide the success message after 2.5 seconds
      setTimeout(() => setResendSuccess(false), 2500);
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          Sign in to continue curating your sustainability intelligence feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input with Icon */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || resendLoading}
              placeholder="Email address"
              className="w-full rounded-lg border border-gray-300 bg-white/80 pl-10 pr-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Password Input with Icon */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || resendLoading}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 bg-white/80 pl-10 pr-3 py-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Resend Verification Section */}
          {showResend && !resendSuccess && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800 shadow-sm dark:border-amber-400/50 dark:bg-amber-500/10 dark:text-amber-200">
              <p className="mb-2 font-medium">{error}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-60 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
              >
                {resendLoading ? (
                  <>
                    <GradientSpinner className="h-4 w-4" strokeWidth={2} />
                    <span>Sending...</span>
                  </>
                ) : cooldown > 0 ? (
                  `Try again in ${cooldown}s`
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-800 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
              ✅ Verification email sent successfully!
            </div>
          )}

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading || success || resendLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <GradientSpinner className="-ml-1 mr-3 h-5 w-5" strokeWidth={2.5} />
                <span>Signing In...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* POLISHED "Create account" and "Forgot password" Links */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => onSwitch("signup")}
              className="font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
              disabled={loading || resendLoading}
            >
              Create one
            </button>
            <span className="h-5 border-l border-gray-300 dark:border-slate-700"></span>
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
              disabled={loading || resendLoading}
            >
              Forgot password?
            </button>
          </div>
      </form>

      {/* Unified overlay for SUCCESS or general ERRORS */}
      {(success || (error && !showResend)) && (
        <AuthLoadingOverlay
          loading={false}
          success={success}
          error={error}
          message={success ? "Authenticated!" : error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
