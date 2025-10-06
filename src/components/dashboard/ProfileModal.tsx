// src/components/dashboard/ProfileModal.tsx
import React, { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile"; // Import the new hook

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  const {
    loading, saving, user, categories, sources, feedbackMessage,
    firstName, setFirstName,
    lastName, setLastName,
    selectedCategories, toggleCategory,
    selectedSources, toggleSource,
    saveProfile,
  } = useUserProfile(open);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await saveProfile();
    if (success) {
      setIsEditingName(false);
    }
  };

  if (!open) return null;

  // The JSX remains almost identical, but it's much cleaner now
  // as it gets all its props and handlers from the useUserProfile hook.
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex flex-col w-full h-full max-h-[680px] bg-white shadow-xl rounded-2xl sm:h-auto sm:w-full sm:max-w-lg">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Profile & Preferences
            </h2>
            <button
              aria-label="Close"
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
          <div className="flex-grow p-6 overflow-y-auto">
            {loading ? (
              <div className="text-center py-10">
                <svg className="w-8 h-8 mx-auto mb-3 text-emerald-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-600">Loading profile data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {feedbackMessage && (
                  <div className={`p-3 rounded-lg text-sm text-center ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedbackMessage.message}
                  </div>
                )}
                
                <div className="p-1 mx-auto bg-gray-100 rounded-full flex items-center w-full">
                  <button type="button" onClick={() => setActiveTab('profile')} className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === 'profile' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                    Profile
                  </button>
                  <button type="button" onClick={() => setActiveTab('preferences')} className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === 'preferences' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200/50'}`}>
                    Preferences
                  </button>
                </div>

                {activeTab === 'profile' && (
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
                      <input type="email" value={user?.email || ''} readOnly className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Preferred Categories</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {categories.map((c) => (
                          <button key={c.id} type="button" onClick={() => toggleCategory(c.id)} disabled={saving} className={`flex items-center justify-between px-3 py-2 text-left border rounded-lg transition-all duration-200 ${selectedCategories.includes(c.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-50`}>
                            <span className="text-sm font-medium truncate">{c.name}</span>
                            {selectedCategories.includes(c.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Preferred Sources</label>
                      <div className="grid grid-cols-2 gap-3">
                        {sources.map((s) => (
                           <button key={s.id} type="button" onClick={() => toggleSource(s.id)} disabled={saving} className={`flex items-center justify-between px-3 py-2 text-left border rounded-lg transition-all duration-200 ${selectedSources.includes(s.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-50`}>
                            <span className="text-sm font-medium truncate">{s.name}</span>
                            {selectedSources.includes(s.id) && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center flex-shrink-0 gap-3 p-4 bg-white border-t border-gray-200">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className={`flex items-center justify-center w-32 h-10 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:shadow-inner disabled:translate-y-0.5`}>
              {saving ? (
                <>
                  <svg className="w-5 h-5 -ml-1 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}