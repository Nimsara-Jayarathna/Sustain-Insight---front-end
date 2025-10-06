import React, { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import ActionStatusOverlay from "../ui/ActionStatusOverlay";

// Import the new sub-components
import { ProfileTab } from "./profile/ProfileTab";
import { PreferencesTab } from "./profile/PreferencesTab";
import { SecurityTab } from "./profile/SecurityTab";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');

  const {
    loading, saving, user, categories, sources,
    submissionStatus, resetSubmissionStatus,
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

  const handleOverlayClose = () => {
    if (submissionStatus.status === 'success') {
      onClose();
    }
    resetSubmissionStatus();
  };

  if (!open) return null;

  const tabBaseStyle = "flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200";
  const activeTabStyle = "bg-white text-emerald-600 shadow-sm";
  const inactiveTabStyle = "text-gray-600 hover:bg-gray-200/50";

  return (
    <>
      <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="flex flex-col w-full h-full max-h-[680px] bg-white shadow-xl rounded-2xl sm:h-auto sm:w-full sm:max-w-lg overflow-hidden">
          {/* MODAL HEADER */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Profile & Preferences</h2>
              <button aria-label="Close" onClick={onClose} className="inline-flex items-center justify-center w-8 h-8 text-gray-500 rounded-full hover:bg-gray-100">×</button>
            </div>
          </div>

          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex-grow p-6 overflow-y-auto">
              {loading ? (
                <div className="text-center py-10"> {/* Loading Spinner */}
                  <svg className="w-8 h-8 mx-auto mb-3 text-emerald-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-gray-600">Loading...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* TAB NAVIGATION */}
                  <div className="p-1 mx-auto bg-gray-100 rounded-full flex items-center w-full">
                    <button type="button" onClick={() => setActiveTab('profile')} className={`${tabBaseStyle} ${activeTab === 'profile' ? activeTabStyle : inactiveTabStyle}`}>Profile</button>
                    <button type="button" onClick={() => setActiveTab('preferences')} className={`${tabBaseStyle} ${activeTab === 'preferences' ? activeTabStyle : inactiveTabStyle}`}>Preferences</button>
                    <button type="button" onClick={() => setActiveTab('security')} className={`${tabBaseStyle} ${activeTab === 'security' ? activeTabStyle : inactiveTabStyle}`}>Security</button>
                  </div>

                  {/* RENDER ACTIVE TAB COMPONENT */}
                  {activeTab === 'profile' && (
                    <ProfileTab
                      firstName={firstName} setFirstName={setFirstName}
                      lastName={lastName} setLastName={setLastName}
                      isEditingName={isEditingName} setIsEditingName={setIsEditingName}
                      user={user} saving={saving}
                    />
                  )}
                  {activeTab === 'preferences' && (
                    <PreferencesTab
                      categories={categories} selectedCategories={selectedCategories} toggleCategory={toggleCategory}
                      sources={sources} selectedSources={selectedSources} toggleSource={toggleSource}
                      saving={saving}
                    />
                  )}
                  {activeTab === 'security' && (
                    <SecurityTab
                      onSuccess={onClose}
                      onCancel={() => setActiveTab('profile')}
                    />
                  )}
                </div>
              )}
            </div>
            
            {/* CONDITIONAL FOOTER */}
            {activeTab !== 'security' && !loading && (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center flex-shrink-0 gap-3 p-4 bg-white border-t border-gray-200">
                    <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={saving} className={`flex items-center justify-center w-32 h-10 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 ease-in-out hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-700 disabled:shadow-inner disabled:translate-y-0.5`}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {submissionStatus.status !== 'idle' && (
        <ActionStatusOverlay
          status={submissionStatus.status}
          message={submissionStatus.message}
          onClose={handleOverlayClose}
        />
      )}
    </>
  );
}
