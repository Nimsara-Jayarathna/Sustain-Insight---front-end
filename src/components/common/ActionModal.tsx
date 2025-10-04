import React, { useEffect, useState } from "react";

type ActionType = "bookmark" | "insight";
type ActionStatus = "success" | "error" | "loading";

type ActionModalProps = {
  action: ActionType; // "bookmark" or "insight"
  message: string;
  type: ActionStatus; // success | error | loading
  onClose?: () => void;
};

const ActionModal: React.FC<ActionModalProps> = ({ action, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close after 1.5s on success/error
  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // 🎨 Explicit color classes (works with Tailwind)
  const colorClasses =
    action === "bookmark"
      ? {
          bg: "bg-emerald-600/90 hover:bg-emerald-700",
          text: "text-emerald-600",
        }
      : {
          bg: "bg-indigo-600/90 hover:bg-indigo-700",
          text: "text-indigo-600",
        };

  return (
    <div
      className={`fixed inset-0 bg-white/40 backdrop-blur-lg flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white/90 rounded-2xl shadow-2xl p-6 w-80 text-center border border-white/40 backdrop-blur-md">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          {type === "loading" ? (
            <svg
              className={`animate-spin h-8 w-8 ${colorClasses.text}`}
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
                d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
              />
            </svg>
          ) : type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 ${colorClasses.text}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="text-gray-800 font-medium">{message}</p>

        {/* Close Button */}
        {type !== "loading" && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                if (onClose) onClose();
              }, 300);
            }}
            className={`mt-5 px-4 py-2 rounded-lg text-white font-semibold transition ${colorClasses.bg}`}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionModal;
