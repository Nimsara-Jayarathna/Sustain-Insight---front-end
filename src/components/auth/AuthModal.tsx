import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModal({
  open,
  view,
  onClose,
  onSwitch,
  onSubmitLogin,
  onSubmitSignup,
}: {
  open: boolean;
  view: "login" | "signup";
  onClose: () => void;
  onSwitch: (v: "login" | "signup") => void;
  onSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmitSignup: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>
        {view === "login" ? (
          <LoginForm onSubmit={onSubmitLogin} onSwitch={onSwitch} />
        ) : (
          <SignupForm onSubmit={onSubmitSignup} onSwitch={onSwitch} />
        )}
      </div>
    </div>
  );
}
