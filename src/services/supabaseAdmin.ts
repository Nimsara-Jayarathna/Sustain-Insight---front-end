import { supabase } from "../lib/supabaseClient";

export type AppSettingsRecord = {
  id: string | null;
  landing_article_count: number;
  feed_page_size: number;
  feed_recent_hours: number;
};

const getFunctionsUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }
  const parsed = new URL(supabaseUrl);
  const host = parsed.host.replace(".supabase.co", ".functions.supabase.co");
  return `${parsed.protocol}//${host}`;
};

const buildAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const fetchAppSettings = async (): Promise<AppSettingsRecord> => {
  const url = new URL("/app-settings", getFunctionsUrl());
  const headers = await buildAuthHeaders();
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load app settings");
  }
  return (await response.json()) as AppSettingsRecord;
};

export const saveAppSettings = async (
  values: AppSettingsRecord & { updatedBy?: string | null },
): Promise<AppSettingsRecord> => {
  const url = new URL("/app-settings", getFunctionsUrl());
  const headers = await buildAuthHeaders();
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to save app settings");
  }
  return (await response.json()) as AppSettingsRecord;
};
