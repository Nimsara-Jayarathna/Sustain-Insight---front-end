import React, { useEffect, useState } from "react";
import GradientSpinner from "../ui/GradientSpinner";

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex w-64 flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-colors dark:bg-slate-900">
        {/* Icon */}
        {type === "loading" ? <GradientSpinner /> : type === "success" ? successIcon : errorIcon}

        {/* Message */}
        <p className="text-base font-medium text-gray-700 dark:text-slate-200">{message}</p>

        {/* Close button for error */}
        {type === "error" && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="mt-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionModal;
