import { useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthModal({
  open,
  view,
  resetToken,
  onClose,
  onSwitch,
  onSubmitLogin,
  onSubmitSignup,
  onSubmitForgotPassword,
}: {
  open: boolean;
  view: "login" | "signup" | "forgot" | "reset";
  resetToken?: string | null;
  onClose: () => void;
  onSwitch: (v: "login" | "signup" | "forgot" | "reset") => void;
  onSubmitLogin: (email: string, password: string) => Promise<void>;
  onSubmitSignup: (data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    password: string;
  }) => Promise<void>;
  onSubmitForgotPassword?: (email: string) => Promise<void>;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 ease-in-out animate-slideUp">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>

        <div className="transition-all duration-300 ease-in-out">
          {view === "login" && <LoginForm onSubmit={onSubmitLogin} onSwitch={onSwitch} />}
          {view === "signup" && <SignupForm onSubmit={onSubmitSignup} onSwitch={onSwitch} />}
          {view === "forgot" && onSubmitForgotPassword && (
            <ForgotPasswordForm onSubmit={onSubmitForgotPassword} onSwitch={onSwitch} />
          )}
          {view === "reset" && resetToken && (
            <ResetPasswordForm token={resetToken} onSwitch={onSwitch} />
          )}
        </div>
      </div>
    </div>
  );
}
