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

  // 🔹 Separate resend states
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0); // cooldown timer (seconds)

  const navigate = useNavigate();
  const { handleResendVerification } = useAuthHandlers();

  // ⏱ cooldown countdown logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resendLoading) return;

    setError("");
    setLoading(true);
    setShowResend(false);

    try {
      await onSubmit(email, password);
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password.";
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
    if (cooldown > 0) return; // block during cooldown
    try {
      setResendLoading(true);
      await handleResendVerification(email);
      setError("");
      setResendSuccess(true);
      setCooldown(60); // block resend for 60s
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || resendLoading}
            className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 
                       outline-none disabled:opacity-50 transition"
          />

          {/* Password Input */}
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || resendLoading}
            className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 
                       outline-none disabled:opacity-50 transition"
          />

          {/* Resend Verification Section */}
          {showResend && !resendSuccess && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 
                            p-4 rounded-lg text-sm text-center shadow-sm animate-fadeIn">
              <p className="mb-2 font-medium">Your email is not verified.</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className="inline-flex items-center justify-center gap-2 font-semibold 
                           text-emerald-700 hover:text-emerald-800 bg-emerald-50 
                           hover:bg-emerald-100 px-4 py-1.5 rounded-full 
                           transition-all duration-200 disabled:opacity-60"
              >
                {resendLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-emerald-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                           5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
                           5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  <>Try again in {cooldown}s</>
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 
                            p-3 rounded-lg text-sm text-center shadow-sm animate-fadeIn">
              ✅ Verification email sent successfully!
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || resendLoading}
            className="w-full h-11 bg-emerald-600 text-white font-medium rounded-lg 
                       shadow-sm hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          {/* Create Account / Forgot Password Links */}
          <div
            className="pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center 
                       text-sm text-gray-700 gap-3 sm:gap-6 border-t border-gray-200 mt-6"
          >
            <div className="text-center sm:text-left">
              <p className="mb-1 text-gray-600">New here?</p>
              <button
                type="button"
                onClick={() => onSwitch("signup")}
                className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 
                           text-emerald-700 font-semibold rounded-full 
                           shadow-sm transition-all duration-200"
                disabled={loading || resendLoading}
              >
                Create an Account
              </button>
            </div>

            <div className="text-center sm:text-right">
              <p className="mb-1 text-gray-600">Forgot your credentials?</p>
              <button
                type="button"
                onClick={() => onSwitch("forgot")}
                className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 
                           text-gray-700 font-semibold rounded-full 
                           shadow-sm transition-all duration-200"
                disabled={loading || resendLoading}
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Unified overlay for login success or error */}
      {(success || error) && (
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
