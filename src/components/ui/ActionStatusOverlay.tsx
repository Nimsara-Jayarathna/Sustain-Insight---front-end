import React, { useEffect } from "react";

type Status = "saving" | "success" | "error";

interface Props {
  status: Status;
  message: string;
  onClose: () => void;
}

const icons: Record<Status, React.ReactNode> = {
  saving: (
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
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
          c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ),
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-64 text-center transition-all transform scale-100 animate-fadeInUp">
        {icons[status]}
        <p className="text-base font-medium text-gray-700 break-words">
          {message}
        </p>

        {status === "error" && (
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionStatusOverlay;
