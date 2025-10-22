import React, { useEffect, useState } from "react";
import GradientSpinner from "./GradientSpinner";

type Props = {
  loading: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  onClose?: () => void;
};

const AuthLoadingOverlay: React.FC<Props> = ({ loading, success = false, error = "", message, onClose }) => {
  // --- THE FIX IS HERE ---
  // The initial state now correctly checks for `success` as well.
  const [visible, setVisible] = useState(loading || success || !!error);

  useEffect(() => {
    // This effect ensures the overlay becomes visible if props change,
    // and sets a timer to close on success or error.
    if (loading || success || !!error) {
      setVisible(true);
    }

    if (success || !!error) {
      const timer = setTimeout(() => {
        setVisible(false);
        // Add a small delay for the fade-out animation before calling onClose
        setTimeout(() => onClose?.(), 300);
      }, 1500); // Display for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [loading, success, error, onClose]);

  const displayMessage = message || (success ? "Success!" : error ? error : "Please wait...");

  const icon = success ? (
    <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : error ? (
    <svg className="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : (
    <GradientSpinner />
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex w-64 flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center shadow-lg transition-colors dark:bg-slate-900">
        {icon}
        <p className="text-base font-medium text-gray-700 dark:text-slate-200">{displayMessage}</p>
        {!!error && (
           <button
             onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300); }}
             className="mt-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
           >
             Try Again
           </button>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingOverlay;
