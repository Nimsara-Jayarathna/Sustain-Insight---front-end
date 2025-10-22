// src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

type SubmissionStatus = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
};

const INITIAL_STATUS: SubmissionStatus = { status: "idle", message: "" };

export function useUserProfile(open: boolean) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [staticData, setStaticData] = useState<{ categories: any[]; sources: any[] }>({
    categories: [],
    sources: [],
  });

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>(""); // ✅ 1. Add state for job title
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSources, setSelectedSources] = useState<number[]>([]);

  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>(INITIAL_STATUS);

  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        setLoading(true);
        setSubmissionStatus(INITIAL_STATUS);

        const [me, cats, srcs] = await Promise.all([
          apiFetch("/api/account/me"),
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);

        setUser(me);
        setStaticData({ categories: cats, sources: srcs });
        setFirstName(me.firstName || "");
        setLastName(me.lastName || "");
        setJobTitle(me.jobTitle || ""); // ✅ 2. Initialize job title from fetched data
        setSelectedCategories(
          me.preferredCategories?.map((c: any) => c.id) || []
        );
        setSelectedSources(me.preferredSources?.map((s: any) => s.id) || []);
      } catch {
        setSubmissionStatus({
          status: "error",
          message: "Could not load profile data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open]);

  const toggleCategory = (id: number) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const toggleSource = (id: number) =>
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const saveProfile = async () => {
    setSubmissionStatus({ status: "saving", message: "Saving changes..." });
    try {
      await apiFetch("/api/account/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          jobTitle, // ✅ 3. Include job title in the save payload
          categoryIds: selectedCategories,
          sourceIds: selectedSources,
        }),
      });
      setSubmissionStatus({ status: "success", message: "Profile updated!" });
      return true;
    } catch (err: any) {
      setSubmissionStatus({
        status: "error",
        message: err.message || "Failed to update profile.",
      });
      return false;
    }
  };

  const resetSubmissionStatus = () => setSubmissionStatus(INITIAL_STATUS);

  // ✅ 4. Return jobTitle and its setter from the hook
  return {
    loading,
    saving: submissionStatus.status === "saving",
    user,
    setUser,
    categories: staticData.categories,
    sources: staticData.sources,
    submissionStatus,
    resetSubmissionStatus,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    jobTitle,
    setJobTitle,
    selectedCategories,
    toggleCategory,
    selectedSources,
    toggleSource,
    saveProfile,
  };
}
