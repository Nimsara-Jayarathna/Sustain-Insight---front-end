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
    <div className="space-y-6 relative">
      {/* --- Full Name --- */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <button
            type="button"
            onClick={() => setIsEditingName(!isEditingName)}
            className="text-sm text-emerald-600 hover:underline"
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
            className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditingName || saving}
            placeholder="Last name"
            className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          />
        </div>
      </div>

      {/* --- Job Title --- */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <button
            type="button"
            onClick={() => setIsEditingJobTitle(!isEditingJobTitle)}
            className="text-sm text-emerald-600 hover:underline"
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
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        />
      </div>

      {/* --- Email Section --- */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <button
            type="button"
            onClick={onChangeEmailRequest}
            className="text-sm text-emerald-600 hover:underline"
          >
            Change
          </button>
        </div>
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
        />
      </div>
    </div>
  );
};