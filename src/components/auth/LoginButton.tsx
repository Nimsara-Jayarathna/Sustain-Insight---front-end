// import React from "react";
import { useAuth } from "../../hooks/useAuth";

type Provider = "google" | "facebook" | "linkedin";

const providerLabels: Record<Provider, string> = {
  google: "Continue with Google",
  facebook: "Continue with Facebook",
  linkedin: "Continue with LinkedIn",
};

export default function LoginButton({ provider }: { provider: Provider }) {
  const {
    loginWithGoogle,
    loginWithFacebook,
    loginWithLinkedIn,
  } = useAuth();

  const handleClick = () => {
    switch (provider) {
      case "google":
        return loginWithGoogle();
      case "facebook":
        return loginWithFacebook();
      case "linkedin":
        return loginWithLinkedIn();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {providerLabels[provider]}
    </button>
  );
}
