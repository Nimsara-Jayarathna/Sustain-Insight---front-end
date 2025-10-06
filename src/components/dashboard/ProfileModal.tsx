import React, { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [_user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [saving, setSaving] = useState(false); // New state for saving
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null); // New state for feedback

  // 🔹 Load profile + preferences
  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        setLoading(true);
        setFeedbackMessage(null); // Clear feedback on open
        const [me, cats, srcs] = await Promise.all([
          apiFetch("/api/account/me"),
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setUser(me);
        setCategories(cats);
        setSources(srcs);

        // defaults
        setFirstName(me.firstName || "");
        setLastName(me.lastName || "");
        setSelectedCategories(me.preferredCategories?.map((c: any) => c.id) || []);
        setSelectedSources(me.preferredSources?.map((s: any) => s.id) || []);
      } catch (err) {
        console.error("DEBUG → Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open]);

  // 🔹 Toggle selections
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSource = (id: number) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // 🔹 Save preferences + name
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true); // Set saving to true
    setFeedbackMessage(null); // Clear previous feedback
    try {
      const res = await apiFetch("/api/account/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          categoryIds: selectedCategories,
          sourceIds: selectedSources,
        }),
      });

      console.log("DEBUG → Profile updated:", res);
      setFeedbackMessage({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditingName(false);
      // onClose(); // Don't close immediately, let user see feedback
    } catch (err: any) {
      console.error("DEBUG → Failed to save profile:", err);
      setFeedbackMessage({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false); // Set saving to false
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Manage Profile & Preferences
        </h2>

        {loading ? (
          <div className="text-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-emerald-600 mx-auto mb-3"
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
            <p className="text-sm text-gray-600">Loading profile data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {feedbackMessage && (
              <div className={`p-3 rounded-lg text-sm text-center ${
                feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {feedbackMessage.message}
              </div>
            )}

            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">Full Name</label>
                <button
                  type="button"
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  {isEditingName ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditingName || saving}
                  placeholder="First name"
                  className="w-1/2 rounded-xl border border-gray-300 px-3 py-2 text-sm 
                    focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditingName || saving}
                  placeholder="Last name"
                  className="w-1/2 rounded-xl border border-gray-300 px-3 py-2 text-sm 
                    focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Categories
              </label>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories.map((id) => {
                    const category = categories.find((c) => c.id === id);
                    return category ? (
                      <span
                        key={id}
                        className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => toggleCategory(id)}
                          disabled={saving}
                          className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              {categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      disabled={saving}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 
                        ${selectedCategories.includes(c.id)
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-sm font-medium truncate">{c.name}</span>
                      {selectedCategories.includes(c.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories available.</p>
              )}
            </div>

            {/* Sources */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Sources
              </label>
              {selectedSources.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSources.map((id) => {
                    const source = sources.find((s) => s.id === id);
                    return source ? (
                      <span
                        key={id}
                        className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
                      >
                        {source.name}
                        <button
                          type="button"
                          onClick={() => toggleSource(id)}
                          disabled={saving}
                          className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}              </div>

              {sources.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {sources.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSource(s.id)}
                      disabled={saving}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 
                        ${selectedSources.includes(s.id)
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-sm font-medium truncate">{s.name}</span>
                      {selectedSources.includes(s.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No sources available.</p>
              )}

            <button
              type="submit"
              disabled={saving} // Disable button when saving
              className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}