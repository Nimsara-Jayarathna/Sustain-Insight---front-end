import React from 'react';

// Define the shape of the user object, assuming it's not globally typed yet
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
  user: User | null;
  saving: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  firstName, setFirstName, lastName, setLastName,
  isEditingName, setIsEditingName, user, saving
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <button type="button" onClick={() => setIsEditingName(!isEditingName)} className="text-sm text-emerald-600 hover:underline">
            {isEditingName ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="flex gap-3">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditingName || saving} placeholder="First name" className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditingName || saving} placeholder="Last name" className="w-1/2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={user?.email || ''} readOnly className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg disabled:opacity-50" />
      </div>
    </div>
  );
};
