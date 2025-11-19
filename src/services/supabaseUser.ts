import { supabase } from "../lib/supabaseClient";

const isRlsDenied = (error?: { code?: string; message?: string }) => {
  if (!error) return false;
  if (error.code === "42501" || error.code === "PGRST302") return true;
  return (error.message ?? "").toLowerCase().includes("row-level security");
};

export type UserProfilePayload = {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  categoryIds: string[];
  sourceIds: string[];
};

export type UserProfileResponse = {
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  preferredCategories: string[];
  preferredSources: string[];
};

export const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  const [{ data: profileRow, error: profileError }, { data: prefRow, error: prefError }] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("first_name,last_name,job_title")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_preferences")
      .select("category_ids,source_ids")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (profileError && profileError.code !== "PGRST116") throw profileError;
  if (prefError && prefError.code !== "PGRST116") throw prefError;

  return {
    firstName: profileRow?.first_name ?? "",
    lastName: profileRow?.last_name ?? "",
    jobTitle: profileRow?.job_title ?? null,
    preferredCategories: prefRow?.category_ids ?? [],
    preferredSources: prefRow?.source_ids ?? [],
  };
};

export const saveUserProfile = async (userId: string, payload: UserProfilePayload) => {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const profileUpsert = supabase.from("user_profiles").upsert(
    {
      user_id: userId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      job_title: payload.jobTitle ?? null,
    },
    { onConflict: "user_id" },
  );

  const rbacFullNameUpdate = supabase
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", userId);

  const preferenceUpsert = supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      category_ids: payload.categoryIds,
      source_ids: payload.sourceIds,
    },
    { onConflict: "user_id" },
  );

  const [{ error: profileError }, { error: preferenceError }, { error: fullNameError }] = await Promise.all([
    profileUpsert,
    preferenceUpsert,
    rbacFullNameUpdate,
  ]);
  if (profileError) throw profileError;
  if (preferenceError) throw preferenceError;
  if (fullNameError) {
    if (isRlsDenied(fullNameError)) {
      throw new Error("You are not allowed to update your Supabase profile name.");
    }
    throw fullNameError;
  }
};

