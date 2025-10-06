import React, { useEffect, useState } from "react";

type Props = {
  loading: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  onClose?: () => void;
};

const AuthLoadingOverlay: React.FC<Props> = ({ loading, success = false, error = "", message, onClose }) => {
  // --- All this internal logic is UNCHANGED ---
  const [visible, setVisible] = useState(loading || !!error);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (loading) {
      setVisible(true);
    }
  }, [loading, success, error, onClose]);

  if (!visible) return null;

  const displayMessage = message || (success ? "Success!" : error ? error : "Please wait...");

  const icon = success ? (
    <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : error ? (
    <svg className="h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : (
    <svg className="animate-spin h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
  );
  // --- End of unchanged logic ---

  // --- This JSX is REDESIGNED to match ActionStatusOverlay ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white px-6 py-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-64 text-center">
        {icon}
        <p className="text-base font-medium text-gray-700">{displayMessage}</p>
        {!!error && (
           <button
             onClick={() => { setVisible(false); onClose?.(); }}
             className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200"
           >
             Try Again
           </button>
        )}
      </div>
    </div>
  );
};

export default AuthLoadingOverlay;