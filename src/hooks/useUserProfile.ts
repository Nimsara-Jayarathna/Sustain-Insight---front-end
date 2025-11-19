import { useEffect, useState } from "react";
import type { Category, Source } from "../types/content";
import { fetchPreferenceCatalog, fetchUserPreferences, updateUserPreferences } from "../services/api/preferences";
import { useAuth } from "./useAuth";

type SubmissionStatus = {
  status: "idle" | "saving" | "success" | "error";
  message: string;
};

const INITIAL_STATUS: SubmissionStatus = { status: "idle", message: "" };

export function useUserProfile(open: boolean) {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(INITIAL_STATUS);

  useEffect(() => {
    if (!open || !user?.id) return;
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setSubmissionStatus(INITIAL_STATUS);
        const [profile, options] = await Promise.all([fetchUserPreferences(), fetchPreferenceCatalog()]);
        if (!active) return;
        setCategories(options.categories);
        setSources(options.sources);
        setFirstName(profile.firstName ?? "");
        setLastName(profile.lastName ?? "");
        setJobTitle(profile.jobTitle ?? "");
        setSelectedCategories(profile.categoryIds.map(String));
        setSelectedSources(profile.sourceIds.map(String));
      } catch (err: any) {
        if (!active) return;
        setSubmissionStatus({ status: "error", message: err.message ?? "Unable to load profile" });
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [open, user?.id]);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const toggleSource = (id: string) =>
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const saveProfileHandler = async () => {
    if (!user?.id) return false;
    setSubmissionStatus({ status: "saving", message: "Saving changes..." });
    try {
      await updateUserPreferences({
        firstName,
        lastName,
        jobTitle,
        categoryIds: selectedCategories,
        sourceIds: selectedSources,
      });
      await refreshProfile?.();
      setSubmissionStatus({ status: "success", message: "Profile updated" });
      return true;
    } catch (err: any) {
      setSubmissionStatus({
        status: "error",
        message: err.message ?? "Unable to save profile",
      });
      return false;
    }
  };

  const resetSubmissionStatus = () => setSubmissionStatus(INITIAL_STATUS);

  return {
    loading,
    saving: submissionStatus.status === "saving",
    categories,
    sources,
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
    saveProfile: saveProfileHandler,
  };
}
