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
  const NAME_LIMIT = 15;
  const JOB_TITLE_LIMIT = 20;

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

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value.slice(0, NAME_LIMIT))}
            disabled={!isEditingName || saving}
            placeholder="First name"
            maxLength={NAME_LIMIT}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-1/2"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value.slice(0, NAME_LIMIT))}
            disabled={!isEditingName || saving}
            placeholder="Last name"
            maxLength={NAME_LIMIT}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-1/2"
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
          onChange={(e) => setJobTitle(e.target.value.slice(0, JOB_TITLE_LIMIT))}
          disabled={!isEditingJobTitle || saving}
          placeholder="Your job title"
          maxLength={JOB_TITLE_LIMIT}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {/* --- Email Section --- */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Email
          </label>
          <button
            type="button"
            onClick={onChangeEmailRequest}
            className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            Update
          </button>
        </div>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>
    </div>
  );
};
