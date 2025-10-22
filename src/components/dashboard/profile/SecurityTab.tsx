import React, { useState } from "react";
import ChangePasswordForm from "../../auth/ChangePasswordForm";
import ActiveSessionsPanel from "./ActiveSessionsPanel";

interface SecurityTabProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ onSuccess, onCancel }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const openChangePassword = () => setShowChangePassword(true);

  const handlePasswordSuccess = () => {
    setShowChangePassword(false);
    onSuccess();
  };

  const handlePasswordCancel = () => {
    setShowChangePassword(false);
    onCancel();
  };

  return (
    <div className="space-y-6 text-gray-800 dark:text-slate-200">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Password</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
              Keep your credentials strong to prevent unauthorized access.
            </p>
        </div>
        <button
          type="button"
          onClick={openChangePassword}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto"
        >
          Change password
        </button>
      </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Best practices</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-300">
              Use at least 12 characters including numbers and symbols, and avoid reusing passwords from other sites.
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Last updated</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-300">
              If it has been a while since your last change, updating now helps keep your account safe.
            </p>
          </div>
        </div>
      </section>
      <ActiveSessionsPanel />

      {showChangePassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-colors dark:bg-slate-900">
            <button
              type="button"
              onClick={handlePasswordCancel}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:hover:bg-slate-800 dark:text-slate-300"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ChangePasswordForm
              onSuccess={handlePasswordSuccess}
              onCancel={handlePasswordCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};
