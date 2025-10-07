// src/components/auth/ChangeEmailForm.tsx
import React, { useState } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import OtpInput from "../ui/OtpInput";
import {
  requestEmailChangeOtp,
  verifyCurrentEmailOtp,
  sendNewEmailOtp,
  confirmEmailChange,
} from "../../api/user";

// --- HELPER COMPONENTS ---

// Visual progress bar for the multi-step form
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Verify Current", "New Email", "Verify New", "Done"];
  const progress = Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full px-2 mb-6">
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute top-0 left-0 h-2 bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`transition-colors duration-300 ${
              index + 1 <= currentStep ? "font-semibold text-emerald-600" : ""
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function ChangeEmailForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
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
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCurrentOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyCurrentEmailOtp({ otp: currentOtp });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      setCurrentOtp(""); // <-- FIX: Clear OTP input on error
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
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP to new email.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmailOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
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
      setNewEmailOtp(""); // <-- FIX: Clear OTP input on error
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              For security, we'll send a verification code to your <b>current email address</b> to confirm your identity.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button onClick={onCancel} disabled={loading} className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">Cancel</button>
              <button onClick={handleRequestCurrentOtp} disabled={loading} className="w-full sm:w-auto flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {loading ? "Sending..." : "Send Code"}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyCurrentOtp} className="space-y-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
              <p className="text-xs text-gray-500 mt-1">A 6-digit code was sent to your current email.</p>
            </div>
            <OtpInput value={currentOtp} onChange={setCurrentOtp} disabled={loading} />
            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Back</button>
              <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {loading ? "Verifying..." : "Verify Identity"}
              </button>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSendNewEmailOtp} className="space-y-6">
            <div>
              <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">New Email Address</label>
              <input id="new-email" type="email" required autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={loading} placeholder="Enter your new email" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 disabled:opacity-50 transition-colors"/>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Back</button>
              <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </form>
        );
      case 4:
        return (
          <form onSubmit={handleConfirmEmailChange} className="space-y-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">Verify Your New Email</label>
              <p className="text-xs text-gray-500 mt-1">
                Enter the code sent to <b className="text-emerald-700">{newEmail}</b>
              </p>
            </div>
            <OtpInput value={newEmailOtp} onChange={setNewEmailOtp} disabled={loading} />
            <div className="flex items-center justify-between gap-3 pt-2">
              <button type="button" onClick={() => setStep(3)} className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Back</button>
              <button type="submit" disabled={loading || success} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {loading ? "Confirming..." : "Confirm & Change Email"}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto px-5 sm:px-8 py-6 sm:py-8 transition-all duration-300 ease-in-out transform animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Change Your Email Address
        </h3>
        <button onClick={onCancel} disabled={loading} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors disabled:opacity-50">
          ×
        </button>
      </div>

      <ProgressBar currentStep={step} />

      <div className="mt-4">
        {renderStepContent()}
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
