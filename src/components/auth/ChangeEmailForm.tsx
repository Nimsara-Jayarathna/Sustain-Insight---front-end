import React, { useState, useEffect } from "react";
import AuthLoadingOverlay from "../ui/AuthLoadingOverlay";
import OtpInput from "../ui/OtpInput";
import {
  requestEmailChangeOtp,
  verifyCurrentEmailOtp,
  sendNewEmailOtp,
  confirmEmailChange,
} from "../../api/user";

// --- HELPER COMPONENTS (Unchanged) ---
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
  const [cooldownCurrent, setCooldownCurrent] = useState(0);
  const [cooldownNew, setCooldownNew] = useState(0);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);

  // Cooldown timers (unchanged)
  useEffect(() => {
    const timers: ReturnType<typeof setInterval>[] = [];
    if (cooldownCurrent > 0)
      timers.push(setInterval(() => setCooldownCurrent((v) => v - 1), 1000));
    if (cooldownNew > 0)
      timers.push(setInterval(() => setCooldownNew((v) => v - 1), 1000));
    return () => timers.forEach(clearInterval);
  }, [cooldownCurrent, cooldownNew]);

  // Handlers for API calls (logic is unchanged)
  const handleRequestCurrentOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await requestEmailChangeOtp();
      setCooldownCurrent(60);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCurrentOtp = async () => {
    if (cooldownCurrent > 0) return;
    setLoading(true);
    setError("");
    try {
      await requestEmailChangeOtp();
      setCooldownCurrent(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCurrentOtp = async () => {
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
      setError(err.message || "Invalid OTP.");
      setCurrentOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewEmailOtp = async () => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await sendNewEmailOtp({ newEmail });
      setCooldownNew(60);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP to new email.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendNewEmailOtp = async () => {
    if (cooldownNew > 0) return;
    setLoading(true);
    setError("");
    try {
      await sendNewEmailOtp({ newEmail });
      setCooldownNew(60);
    } catch (err: any)      {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailChange = async () => {
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
      setNewEmailOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryAction = (e: React.FormEvent) => {
    e.preventDefault();
    switch (step) {
      case 1: handleRequestCurrentOtp(); break;
      case 2: handleVerifyCurrentOtp(); break;
      case 3: handleSendNewEmailOtp(); break;
      case 4: handleConfirmEmailChange(); break;
    }
  };
  
  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
        setStep(step > 1 ? step - 1 : 1);
        setIsAnimating(false);
    }, 150);
  }

  const primaryButtonText = {
    1: "Send Verification Code",
    2: "Verify & Continue",
    3: "Send Verification Code",
    4: "Confirm & Change Email",
  }[step];
  
  const primaryButtonLoadingText = {
    1: "Sending...",
    2: "Verifying...",
    3: "Sending...",
    4: "Confirming...",
  }[step];

  const renderStepContent = () => {
    const animationClass = isAnimating ? 'animate-fadeOut' : 'animate-fadeIn';

    return (
        <div key={step} className={`space-y-4 ${animationClass}`}>
            {step === 1 && (
                <div className="space-y-2 text-center">
                    <h4 className="font-semibold text-gray-800 dark:text-slate-100">Verify Your Identity</h4>
                    <p className="text-sm text-gray-600 dark:text-slate-300">For security, we'll send a one-time code to your <b>current email address</b>.</p>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-4 text-center">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-slate-100">Enter Verification Code</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-300">A 6-digit code was sent to your current email.</p>
                    </div>
                    <OtpInput value={currentOtp} onChange={setCurrentOtp} disabled={loading} />
                    <button type="button" onClick={handleResendCurrentOtp} disabled={loading || cooldownCurrent > 0} className="text-sm font-medium text-emerald-600 transition hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:text-emerald-200">
                        {cooldownCurrent > 0 ? `Resend available in ${cooldownCurrent}s` : "Didn't get a code? Resend"}
                    </button>
                </div>
            )}
            {/* ✅ --- REVISED STEP 3 DESIGN --- */}
            {step === 3 && (
                <div className="w-full space-y-4 text-center">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-slate-100">What's Your New Email?</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-300">We'll send a code here to confirm it's yours.</p>
                    </div>
                    <input id="new-email" type="email" required autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={loading} placeholder="example@company.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"/>
                </div>
            )}
            {step === 4 && (
                <div className="space-y-4 text-center">
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-slate-100">Verify Your New Email</h4>
                        <p className="text-sm text-gray-500 dark:text-slate-300">
                            Enter the code we sent to <b className="text-emerald-700 dark:text-emerald-300">{newEmail}</b>
                        </p>
                    </div>
                    <OtpInput value={newEmailOtp} onChange={setNewEmailOtp} disabled={loading} />
                    <button type="button" onClick={handleResendNewEmailOtp} disabled={loading || cooldownNew > 0} className="text-sm font-medium text-emerald-600 transition hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:text-emerald-200">
                        {cooldownNew > 0 ? `Resend available in ${cooldownNew}s` : "Didn't get a code? Resend"}
                    </button>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="mx-auto flex w-full max-w-lg animate-fadeIn flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-colors dark:bg-slate-950">
      <header className="bg-gradient-to-r from-emerald-600/95 to-cyan-500/95 px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Change Email Address</h3>
            <p className="mt-1 text-sm text-white/80">
              We’ll guide you through verifying your current email, adding a new one, and finishing up securely.
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-9 w-9 rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-50"
          >
            ×
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 px-6 py-6 sm:px-8">
        <ProgressBar currentStep={step} />

        {/* Content Area */}
        <form onSubmit={handlePrimaryAction} className="flex flex-col gap-6">
          <div className="min-h-[140px]">
            {renderStepContent()}
          </div>

          <div className="flex flex-col items-center justify-end gap-3 border-t border-gray-200 pt-4 transition-colors dark:border-slate-800 sm:flex-row">
            {step === 1 ? (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 sm:w-auto"
            >
              {loading ? primaryButtonLoadingText : primaryButtonText}
            </button>
          </div>
        </form>
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
