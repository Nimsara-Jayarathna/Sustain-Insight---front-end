import React, { useState, useEffect } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";

const RESEND_COOLDOWN = 120; // 2 minutes
const COOLDOWN_KEY = "forgotPasswordCooldown";

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
  const [cooldown, setCooldown] = useState(0);

  // Restore cooldown from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY);
    if (saved) {
      const remaining = Math.floor((+saved - Date.now()) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return; // prevent spamming
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await onSubmit(email);
      setSuccess(true);
      setLoading(false);

      // set cooldown in localStorage
      const nextAllowed = Date.now() + RESEND_COOLDOWN * 1000;
      localStorage.setItem(COOLDOWN_KEY, nextAllowed.toString());
      setCooldown(RESEND_COOLDOWN);

      // Let the overlay's auto-close timer handle the delay before switching.
      setTimeout(() => {
        onSwitch("login");
      }, 2000);
    } catch (err: any) {
      const msg = err.message || "Failed to send reset link. Please try again.";
      setError(msg);
      setLoading(false);

      // if backend returned rate-limit, start cooldown
      if (msg.toLowerCase().includes("wait")) {
        const nextAllowed = Date.now() + RESEND_COOLDOWN * 1000;
        localStorage.setItem(COOLDOWN_KEY, nextAllowed.toString());
        setCooldown(RESEND_COOLDOWN);
      }
    }
  };

  return (
    <div className="relative">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          No problem. Enter your email below and we'll send you a link to reset it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success || cooldown > 0}
            className={`w-full flex items-center justify-center h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:shadow-inner disabled:translate-y-0.5`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              "Send Reset Link"
            )}
          </button>

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

      {(success || error) && (
        <AuthLoadingOverlay
          loading={false}
          success={success}
          error={error}
          message={success ? "Reset link sent! Check your inbox." : error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
