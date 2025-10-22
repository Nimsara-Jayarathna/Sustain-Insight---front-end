// src/components/dashboard/ProfileModal.tsx
import React, { useEffect, useState } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import ActionStatusOverlay from "../ui/ActionStatusOverlay";
import { ProfileTab } from "./profile/ProfileTab";
import { PreferencesTab } from "./profile/PreferencesTab";
import { SecurityTab } from "./profile/SecurityTab";
import ChangeEmailForm from "../auth/ChangeEmailForm";
import GradientSpinner from "../ui/GradientSpinner";

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

  useEffect(() => {
    if (!open && !showChangeEmail) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, showChangeEmail]);

  // --- RENDER LOGIC ---
  if (!open && !showChangeEmail) return null;

  const tabBaseStyle =
    "flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200";

  return (
    <>
      {/* --- Profile Modal --- */}
      {open && !showChangeEmail && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/70 p-4 backdrop-blur">
          <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-colors dark:bg-slate-950 sm:h-auto sm:max-h-[90vh]">
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-600/95 to-cyan-500/95 px-6 py-5 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Profile &amp; Preferences</h2>
                  <p className="mt-1 max-w-xl text-sm text-white/80">
                    Update your profile details, interests, and security settings. These preferences power your personalised feed.
                  </p>
                </div>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-white/15 text-white transition hover:bg-white/25"
                >
                  ×
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="flex min-h-0 flex-grow flex-col">
              <div className="flex-grow overflow-y-auto px-6 py-6 sm:px-8">
                {loading ? (
                  <div className="py-10 text-center">
                    <GradientSpinner className="mx-auto mb-3 h-10 w-10" />
                    <p className="text-sm text-gray-600 dark:text-slate-300">Loading...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="mx-auto w-full rounded-full border border-gray-200 bg-white/85 p-1 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]">
                      <div className="grid grid-cols-3 gap-1">
                        {["profile", "preferences", "security"].map((key) => {
                          const isActive = activeTab === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setActiveTab(key as typeof activeTab)}
                              className={`${tabBaseStyle} ${
                                isActive
                                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md"
                                  : "text-gray-600 hover:bg-gray-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80"
                              }`}
                            >
                              {key === "profile"
                                ? "Profile"
                                : key === "preferences"
                                  ? "Preferences"
                                  : "Security"}
                            </button>
                          );
                        })}
                      </div>
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
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-gray-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col items-center justify-end gap-3 px-6 py-4 sm:flex-row sm:px-8">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={saving}
                      className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
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
