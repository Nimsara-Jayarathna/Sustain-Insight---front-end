import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
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
    if (resendLoading) return; // Prevent submission while resending

    setError("");
    setLoading(true);
    setSuccess(false);
    setShowResend(false);

    try {
      await onSubmit(email, password);
      setSuccess(true);
      // Navigate to the dashboard after a short delay to show the success message
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password.";
      // Check for a specific error to show the "Resend Verification" option
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
    <div className="relative">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
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
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
            />
          </div>

          {/* Resend Verification Section */}
          {showResend && !resendSuccess && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm text-center shadow-sm">
              <p className="mb-2 font-medium">{error}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className="inline-flex items-center justify-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-1.5 rounded-full transition-all duration-200 disabled:opacity-60"
              >
                {resendLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm text-center shadow-sm">
              ✅ Verification email sent successfully!
            </div>
          )}

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading || success || resendLoading}
            className={`w-full flex items-center justify-center h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:shadow-inner disabled:translate-y-0.5`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* POLISHED "Create account" and "Forgot password" Links */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => onSwitch("signup")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
              disabled={loading || resendLoading}
            >
              Create one
            </button>
            <span className="border-l border-gray-300 h-5"></span> {/* Vertical divider */}
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
              disabled={loading || resendLoading}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

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
