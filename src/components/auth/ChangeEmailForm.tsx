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
                <div className="text-center space-y-2">
                    <h4 className="font-semibold text-gray-800">Verify Your Identity</h4>
                    <p className="text-sm text-gray-600">For security, we'll send a one-time code to your <b>current email address</b>.</p>
                </div>
            )}
            {step === 2 && (
                <div className="text-center space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Enter Verification Code</h4>
                        <p className="text-sm text-gray-500">A 6-digit code was sent to your current email.</p>
                    </div>
                    <OtpInput value={currentOtp} onChange={setCurrentOtp} disabled={loading} />
                    <button type="button" onClick={handleResendCurrentOtp} disabled={loading || cooldownCurrent > 0} className="text-sm text-emerald-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition">
                        {cooldownCurrent > 0 ? `Resend available in ${cooldownCurrent}s` : "Didn't get a code? Resend"}
                    </button>
                </div>
            )}
            {/* ✅ --- REVISED STEP 3 DESIGN --- */}
            {step === 3 && (
                <div className="text-center space-y-4 w-full">
                    <div>
                        <h4 className="font-semibold text-gray-800">What's Your New Email?</h4>
                        <p className="text-sm text-gray-500">We'll send a code here to confirm it's yours.</p>
                    </div>
                    <input id="new-email" type="email" required autoFocus value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={loading} placeholder="example@company.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 disabled:opacity-50 transition-colors"/>
                </div>
            )}
            {step === 4 && (
                <div className="text-center space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Verify Your New Email</h4>
                        <p className="text-sm text-gray-500">
                            Enter the code we sent to <b className="text-emerald-700">{newEmail}</b>
                        </p>
                    </div>
                    <OtpInput value={newEmailOtp} onChange={setNewEmailOtp} disabled={loading} />
                    <button type="button" onClick={handleResendNewEmailOtp} disabled={loading || cooldownNew > 0} className="text-sm text-emerald-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition">
                        {cooldownNew > 0 ? `Resend available in ${cooldownNew}s` : "Didn't get a code? Resend"}
                    </button>
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto px-6 py-8 flex flex-col transition-all duration-300 ease-in-out transform animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Change Email Address</h3>
        <button onClick={onCancel} disabled={loading} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors disabled:opacity-50">×</button>
      </div>

      <ProgressBar currentStep={step} />

      {/* Content Area */}
      <form onSubmit={handlePrimaryAction} className="flex-grow flex flex-col">
        <div className="flex-grow min-h-[120px] flex items-center justify-center">
            {renderStepContent()}
        </div>
        
        {/* Unified Action Footer */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
          {step === 1 ? (
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
              Cancel
            </button>
          ) : (
             <button type="button" onClick={handleBack} disabled={loading} className="px-5 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors">
              Back
            </button>
          )}

          <button type="submit" disabled={loading || success} className="flex-grow sm:flex-grow-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md">
            {loading ? primaryButtonLoadingText : primaryButtonText}
          </button>
        </div>
      </form>

      {/* Overlay */}
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