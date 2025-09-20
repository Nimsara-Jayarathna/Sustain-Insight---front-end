import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profile changes saved! (Demo)");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-semibold text-center">Manage Profile & Preferences</h2>

          <div>
            <label htmlFor="profile-name" className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              id="profile-name"
              type="text"
              defaultValue="Nimsara"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Preferred Categories</label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Renewable Energy</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked /> Climate Policy</label>
              <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Green Tech</label>
            </div>
          </div>
          
           <div>
              <label htmlFor="tracked-keywords" className="mb-1 block text-sm font-medium">Tracked Keywords</label>
              <input
                id="tracked-keywords"
                type="text"
                placeholder="e.g., carbon capture, ESG"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}