import { supabase } from "../../lib/supabaseClient";
import type { UserRole } from "../../stores/authStore";

export type CurrentUserResponse = {
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole | null;
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

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  const url = new URL("/user", getFunctionsUrl());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.error ?? "Unable to fetch user profile";
    const error = new Error(message);
    (error as any).status = response.status;
    throw error;
  }

  return (await response.json()) as CurrentUserResponse;
}
