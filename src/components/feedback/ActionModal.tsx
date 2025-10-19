import React, { useEffect, useState } from "react";

type ActionType = "bookmark" | "insight";
type ActionStatus = "success" | "error" | "loading";

type ActionModalProps = {
  action: ActionType;
  message: string;
  type: ActionStatus;
  onClose?: () => void;
};

const ActionModal: React.FC<ActionModalProps> = ({ action, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== "loading") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // 🎨 Color logic centralized
  const colorClass =
    action === "bookmark" ? "text-emerald-600" :
    action === "insight" ? "text-indigo-600" :
    "text-gray-600";

  const loadingSpinner = (
    <svg className={`animate-spin h-10 w-10 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // ✅ Success icon now color-matched to action type
  const successIcon = (
    <svg className={`h-12 w-12 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const errorIcon = (
    <svg className="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-64 text-center">
        {/* Icon */}
        {type === "loading" ? loadingSpinner : type === "success" ? successIcon : errorIcon}

        {/* Message */}
        <p className="text-base font-medium text-gray-700">{message}</p>

        {/* Close button for error */}
        {type === "error" && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionModal;
