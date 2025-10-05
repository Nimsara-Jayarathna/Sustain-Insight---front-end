import React, { useEffect, useState } from "react";

type Props = {
  loading: boolean;
  success?: boolean;
  error?: string; // optional error text
  message?: string;
  onClose?: () => void; // optional close callback
};

const AuthLoadingOverlay: React.FC<Props> = ({
  loading,
  success = false,
  error = "",
  message,
  onClose,
}) => {
  const [visible, setVisible] = useState(loading || !!error);

  // Auto-close after short delay for success or error
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    } else if (loading) {
      setVisible(true);
    }
  }, [loading, success, error, onClose]);

  if (!visible) return null;

  const displayMessage =
    message ||
    (success
      ? "Authenticated! Redirecting..."
      : error
      ? error
      : "Authenticating...");

  const icon = success ? (
    // ✅ success tick
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-emerald-600 animate-scaleIn"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : error ? (
    // ❌ error cross
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-red-600 animate-scaleIn"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    // 🔄 spinner
    <svg
      className="animate-spin h-10 w-10 text-emerald-600"
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4 min-w-[280px] transition-all duration-300`}
      >
        {/* Close button (only visible for success/error) */}
        {(success || error) && (
          <button
            aria-label="Close"
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        )}

        {icon}

        <p
          className={`text-base font-medium text-center ${
            success
              ? "text-emerald-600"
              : error
              ? "text-red-600"
              : "text-gray-700"
          }`}
        >
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default AuthLoadingOverlay;
