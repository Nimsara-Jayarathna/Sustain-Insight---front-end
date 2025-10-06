// src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api"; // Make sure this path is correct

export function useUserProfile(open: boolean) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [staticData, setStaticData] = useState<{ categories: any[], sources: any[] }>({ categories: [], sources: [] });
  
  // State for user-editable fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);

  // State for submission
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        setLoading(true);
        setFeedbackMessage(null);
        const [me, cats, srcs] = await Promise.all([
          apiFetch("/api/account/me"),
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        
        // Set initial state from fetched data
        setUser(me);
        setStaticData({ categories: cats, sources: srcs });
        setFirstName(me.firstName || "");
        setLastName(me.lastName || "");
        setSelectedCategories(me.preferredCategories?.map((c: any) => c.id) || []);
        setSelectedSources(me.preferredSources?.map((s: any) => s.id) || []);
      } catch (err) {
        console.error("DEBUG → Failed to fetch profile data:", err);
        setFeedbackMessage({ type: 'error', message: 'Could not load profile data.' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open]);
  
  // Handlers for user interaction
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

  const saveProfile = async () => {
    setSaving(true);
    setFeedbackMessage(null);
    try {
      await apiFetch("/api/account/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          categoryIds: selectedCategories,
          sourceIds: selectedSources,
        }),
      });
      setFeedbackMessage({ type: 'success', message: 'Profile updated successfully!' });
      return true;
    } catch (err: any) {
      console.error("DEBUG → Failed to save profile:", err);
      setFeedbackMessage({ type: 'error', message: err.message || 'Failed to update profile.' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    // Data and Status
    loading,
    saving,
    user,
    categories: staticData.categories,
    sources: staticData.sources,
    feedbackMessage,

    // Form State and Setters
    firstName, setFirstName,
    lastName, setLastName,
    selectedCategories,
    selectedSources,

    // Actions
    toggleCategory,
    toggleSource,
    saveProfile,
  };
}