// src/components/auth/ChangeEmailForm.tsx
import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import {
  requestEmailChangeOtp,
  verifyCurrentEmailOtp,
  sendNewEmailOtp,
  confirmEmailChange,
} from "../../api/user";

export default function ChangeEmailForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<
    "sendCurrentOtp" | "verifyCurrentOtp" | "enterNewEmail" | "verifyNewOtp"
  >("sendCurrentOtp");
  const [currentOtp, setCurrentOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailOtp, setNewEmailOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRequestCurrentOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await requestEmailChangeOtp();
      setStep("verifyCurrentOtp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCurrentOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyCurrentEmailOtp({ otp: currentOtp });
      setStep("enterNewEmail");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendNewEmailOtp({ newEmail });
      setStep("verifyNewOtp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP to new email.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await confirmEmailChange({ newEmail, otp: newEmailOtp });
      if (res.token) {
        localStorage.setItem("token", res.token);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.email = res.email;
        localStorage.setItem("user", JSON.stringify(user));
      }
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err.message || "Invalid OTP or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md 
                 mx-auto px-5 sm:px-8 py-6 sm:py-8 transition-all duration-300 
                 ease-in-out transform animate-fadeIn"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Change Email
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Content Steps */}
      <div className="space-y-6">
        {/* STEP 1 */}
        {step === "sendCurrentOtp" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              We’ll send a verification code to your <b>current email</b>.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCurrentOtp}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === "verifyCurrentOtp" && (
          <form onSubmit={handleVerifyCurrentOtp} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">
              Enter OTP sent to your current email
            </label>
            <input
              type="text"
              required
              autoFocus
              value={currentOtp}
              onChange={(e) => setCurrentOtp(e.target.value)}
              disabled={loading}
              placeholder="Enter 6-digit OTP"
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 disabled:opacity-50"
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep("sendCurrentOtp")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === "enterNewEmail" && (
          <form onSubmit={handleSendNewEmailOtp} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">
              New Email Address
            </label>
            <input
              type="email"
              required
              autoFocus
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter new email"
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 disabled:opacity-50"
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep("verifyCurrentOtp")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4 */}
        {step === "verifyNewOtp" && (
          <form onSubmit={handleConfirmEmailChange} className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">
              Verify New Email
            </label>
            <p className="text-xs text-gray-500">
              Enter the code sent to <b className="text-emerald-700">{newEmail}</b>
            </p>
            <input
              type="text"
              required
              autoFocus
              value={newEmailOtp}
              onChange={(e) => setNewEmailOtp(e.target.value)}
              disabled={loading}
              placeholder="Enter 6-digit OTP"
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 disabled:opacity-50"
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep("enterNewEmail")}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Confirm Change"}
              </button>
            </div>
          </form>
        )}
      </div>

      {(error || loading || success) && (
        <AuthLoadingOverlay
          loading={loading && !success}
          success={success}
          error={error}
          message={success ? "Email changed successfully!" : error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
}
