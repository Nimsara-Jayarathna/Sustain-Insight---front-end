import { supabase } from "../../../lib/supabaseClient";
import type { UserRole } from "../../../stores/authStore";

export type AdminProfile = {
  id: string;
  full_name: string | null;
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

const buildHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export async function fetchAdminProfiles(): Promise<AdminProfile[]> {
  const url = new URL("/admin-roles", getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load profiles");
  }
  const payload = await response.json();
  return payload.data as AdminProfile[];
}

export async function updateAdminProfileRole(userId: string, role: UserRole): Promise<void> {
  const url = new URL("/admin-roles", getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify({ userId, role }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to update role");
  }
}
