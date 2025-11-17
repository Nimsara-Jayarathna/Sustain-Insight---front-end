import { supabase } from "../lib/supabaseClient";
import type { Category, Source } from "../types/content";

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
  const profileUpsert = supabase.from("user_profiles").upsert(
    {
      user_id: userId,
      first_name: payload.firstName,
      last_name: payload.lastName,
      job_title: payload.jobTitle ?? null,
    },
    { onConflict: "user_id" },
  );

  const preferenceUpsert = supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      category_ids: payload.categoryIds,
      source_ids: payload.sourceIds,
    },
    { onConflict: "user_id" },
  );

  const [{ error: profileError }, { error: preferenceError }] = await Promise.all([profileUpsert, preferenceUpsert]);
  if (profileError) throw profileError;
  if (preferenceError) throw preferenceError;
};

export const fetchSources = async (): Promise<Source[]> => {
  const { data, error } = await supabase.from("sources").select("id,name,slug").order("name");
  if (error) throw error;
  return (data ?? []).map((source) => ({
    id: String(source.id),
    name: source.name,
    slug: source.slug ?? null,
  }));
};

export type PreferenceOptions = {
  categories: Category[];
  sources: Source[];
};

export const fetchPreferenceOptions = async (): Promise<PreferenceOptions> => {
  const [categories, sources] = await Promise.all([
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("sources").select("id,name,slug").order("name"),
  ]);

  if (categories.error) throw categories.error;
  if (sources.error) throw sources.error;

  return {
    categories: (categories.data ?? []).map((category) => ({
      id: String(category.id),
      name: category.name,
      slug: category.slug ?? null,
    })),
    sources: (sources.data ?? []).map((source) => ({
      id: String(source.id),
      name: source.name,
      slug: source.slug ?? null,
    })),
  };
};
