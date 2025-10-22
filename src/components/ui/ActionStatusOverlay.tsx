import React, { useEffect } from "react";
import GradientSpinner from "./GradientSpinner";

type Status = "saving" | "success" | "error";

interface Props {
  status: Status;
  message: string;
  onClose: () => void;
}

const icons: Record<Status, React.ReactNode> = {
  saving: null,
  success: (
    <svg
      className="h-12 w-12 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-12 w-12 text-red-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0
           9 9 0 0118 0z"
      />
    </svg>
  ),
};

const ActionStatusOverlay: React.FC<Props> = ({ status, message, onClose }) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === "success") {
      timer = setTimeout(onClose, 1500);
    } else if (status === "error") {
      // Optional: auto-close error after a while if user doesn’t click
      timer = setTimeout(onClose, 3000);
    }
    return () => clearTimeout(timer);
  }, [status, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex w-64 scale-100 flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-all animate-fadeInUp dark:bg-slate-900">
        {status === "saving" ? <GradientSpinner className="h-10 w-10" /> : icons[status]}
        <p className="break-words text-base font-medium text-gray-700 dark:text-slate-200">
          {message}
        </p>

        {status === "error" && (
          <button
            onClick={onClose}
            className="mt-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionStatusOverlay;
