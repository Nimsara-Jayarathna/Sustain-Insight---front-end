import React, { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);

  // 🔹 Load profile + preferences
  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        setLoading(true);
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
      alert("Profile updated successfully!");
      setIsEditingName(false);
      onClose();
    } catch (err) {
      console.error("DEBUG → Failed to save profile:", err);
      alert("Failed to update profile, check console.");
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
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={!isEditingName}
                  placeholder="First name"
                  className="w-1/2 rounded-xl border border-gray-300 px-3 py-2 text-sm 
                    focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditingName}
                  placeholder="Last name"
                  className="w-1/2 rounded-xl border border-gray-300 px-3 py-2 text-sm 
                    focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Categories
              </label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Sources
              </label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
                {sources.map((s) => (
                  <label key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(s.id)}
                      onChange={() => toggleSource(s.id)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
