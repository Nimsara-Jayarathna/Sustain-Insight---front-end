// src/components/dashboard/ProfileModal.tsx
import React, { useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import ActionStatusOverlay from "../ui/ActionStatusOverlay";
import { ProfileTab } from "./profile/ProfileTab";
import { PreferencesTab } from "./profile/PreferencesTab";
import { SecurityTab } from "./profile/SecurityTab";
import ChangeEmailForm from "../auth/ChangeEmailForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  // --- STATE MANAGEMENT ---
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingJobTitle, setIsEditingJobTitle] = useState(false); // ✅ State for job title editing
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "security"
  >("profile");
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  // --- CUSTOM HOOK FOR USER DATA ---
  const {
    loading,
    saving,
    user,
    setUser,
    categories,
    sources,
    submissionStatus,
    resetSubmissionStatus,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    jobTitle, // ✅ Get jobTitle state from hook
    setJobTitle, // ✅ Get jobTitle setter from hook
    selectedCategories,
    toggleCategory,
    selectedSources,
    toggleSource,
    saveProfile,
  } = useUserProfile(open);

  // --- EVENT HANDLERS ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await saveProfile();
    if (success) {
      setIsEditingName(false);
      setIsEditingJobTitle(false); // ✅ Reset editing state on success
    }
  };

  const handleOverlayClose = () => {
    if (submissionStatus.status === "success") onClose();
    resetSubmissionStatus();
  };

  // --- RENDER LOGIC ---
  if (!open && !showChangeEmail) return null;

  const tabBaseStyle =
    "flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200";
  const activeTabStyle = "bg-white text-emerald-600 shadow-sm";
  const inactiveTabStyle = "text-gray-600 hover:bg-gray-200/50";

  return (
    <>
      {/* --- Profile Modal --- */}
      {open && !showChangeEmail && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex flex-col w-full h-full max-h-[680px] bg-white shadow-xl rounded-2xl sm:max-w-lg overflow-hidden">
            {/* Header */}
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

            {/* Body */}
            <div className="flex flex-col flex-grow min-h-0">
              <div className="flex-grow p-6 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-10">
                    <svg
                      className="w-8 h-8 mx-auto mb-3 text-emerald-600 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="p-1 mx-auto bg-gray-100 rounded-full flex items-center w-full">
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className={`${tabBaseStyle} ${
                          activeTab === "profile"
                            ? activeTabStyle
                            : inactiveTabStyle
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("preferences")}
                        className={`${tabBaseStyle} ${
                          activeTab === "preferences"
                            ? activeTabStyle
                            : inactiveTabStyle
                        }`}
                      >
                        Preferences
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("security")}
                        className={`${tabBaseStyle} ${
                          activeTab === "security"
                            ? activeTabStyle
                            : inactiveTabStyle
                        }`}
                      >
                        Security
                      </button>
                    </div>

                    {/* Active Tab */}
                    {activeTab === "profile" && (
                      <ProfileTab
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        isEditingName={isEditingName}
                        setIsEditingName={setIsEditingName}
                        jobTitle={jobTitle} // ✅ Pass jobTitle prop
                        setJobTitle={setJobTitle} // ✅ Pass setter prop
                        isEditingJobTitle={isEditingJobTitle} // ✅ Pass editing state prop
                        setIsEditingJobTitle={setIsEditingJobTitle} // ✅ Pass editing setter prop
                        user={user}
                        saving={saving}
                        onChangeEmailRequest={() => {
                          setShowChangeEmail(true);
                        }}
                      />
                    )}
                    {activeTab === "preferences" && (
                      <PreferencesTab
                        categories={categories}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        sources={sources}
                        selectedSources={selectedSources}
                        toggleSource={toggleSource}
                        saving={saving}
                      />
                    )}
                    {activeTab === "security" && (
                      <SecurityTab
                        onSuccess={onClose}
                        onCancel={() => setActiveTab("profile")}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {activeTab !== "security" && !loading && (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-center flex-shrink-0 gap-3 p-4 bg-white border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center w-32 h-10 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Change Email Modal --- */}
      {showChangeEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <ChangeEmailForm
            onSuccess={() => {
              setShowChangeEmail(false);
              setUser((prev: any) => ({
                ...prev,
                email: JSON.parse(localStorage.getItem("user") || "{}").email,
              }));
              setTimeout(onClose, 100);
              setTimeout(() => window.dispatchEvent(new Event("reopenProfileModal")), 200);
            }}
            onCancel={() => {
              setShowChangeEmail(false);
              setTimeout(onClose, 100);
              setTimeout(() => window.dispatchEvent(new Event("reopenProfileModal")), 200);
            }}
          />
        </div>
      )}

      {/* --- Status Overlay --- */}
      {submissionStatus.status !== "idle" && (
        <ActionStatusOverlay
          status={submissionStatus.status}
          message={submissionStatus.message}
          onClose={handleOverlayClose}
        />
      )}
    </>
  );
}