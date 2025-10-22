// src/components/dashboard/profile/ProfileTab.tsx
import React from "react";

interface User {
  email?: string;
}

interface ProfileTabProps {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (isEditing: boolean) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  isEditingJobTitle: boolean;
  setIsEditingJobTitle: (isEditing: boolean) => void;
  user: User | null;
  saving: boolean;
  onChangeEmailRequest: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isEditingName,
  setIsEditingName,
  jobTitle,
  setJobTitle,
  isEditingJobTitle,
  setIsEditingJobTitle,
  user,
  saving,
  onChangeEmailRequest,
}) => {
  return (
    <div className="relative space-y-6 text-gray-800 dark:text-slate-200">
      {/* --- Full Name --- */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Full Name
          </label>
          <button
            type="button"
            onClick={() => setIsEditingName(!isEditingName)}
            className="text-sm text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            {isEditingName ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!isEditingName || saving}
            placeholder="First name"
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditingName || saving}
            placeholder="Last name"
            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* --- Job Title --- */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Job Title
          </label>
          <button
            type="button"
            onClick={() => setIsEditingJobTitle(!isEditingJobTitle)}
            className="text-sm text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            {isEditingJobTitle ? "Cancel" : "Edit"}
          </button>
        </div>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          disabled={!isEditingJobTitle || saving}
          placeholder="Your job title"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {/* --- Email Section --- */}
      <div>
        <div className="mb-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Email
          </label>
          <button
            type="button"
            onClick={onChangeEmailRequest}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:border-emerald-400 dark:hover:bg-emerald-500/20 sm:text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Update email
          </button>
        </div>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>
    </div>
  );
};
