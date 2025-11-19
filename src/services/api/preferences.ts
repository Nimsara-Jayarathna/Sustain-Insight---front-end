import { supabase } from "../../lib/supabaseClient";

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

export type PreferenceCatalogResponse = {
  categories: { id: string; name: string; slug: string | null }[];
  sources: { id: string; name: string; slug: string | null }[];
};

export type UserPreferencesResponse = {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  categoryIds: string[];
  sourceIds: string[];
};

export type UpdatePreferencesPayload = {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  categoryIds?: string[];
  sourceIds?: string[];
};

export async function fetchPreferenceCatalog(): Promise<PreferenceCatalogResponse> {
  const url = new URL("/preferences-catalog", getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load preference catalog");
  }
  return (await response.json()) as PreferenceCatalogResponse;
}

export async function fetchUserPreferences(): Promise<UserPreferencesResponse> {
  const url = new URL("/preferences-user", getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to load your preferences");
  }
  return (await response.json()) as UserPreferencesResponse;
}

export async function updateUserPreferences(payload: UpdatePreferencesPayload): Promise<void> {
  const url = new URL("/preferences-update", getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error ?? "Unable to update preferences");
  }
}

type CatalogItem = { id: string; name: string; slug: string | null };

const requestWithAuth = async (
  path: string,
  init: RequestInit & { method: string },
): Promise<Response> => {
  const url = new URL(path, getFunctionsUrl());
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      ...(headers ?? {}),
      ...(init.headers ?? {}),
    },
  });
  return response;
};

export async function createCatalogCategory(name: string): Promise<CatalogItem> {
  const response = await requestWithAuth("/preferences-category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to create category");
  }
  return (await response.json()) as CatalogItem;
}

export async function deleteCatalogCategory(categoryId: string): Promise<void> {
  const url = new URL("/preferences-category", getFunctionsUrl());
  url.searchParams.set("id", categoryId);
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: headers ?? undefined,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to delete category");
  }
}

export async function createCatalogSource(name: string): Promise<CatalogItem> {
  const response = await requestWithAuth("/preferences-source", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to create source");
  }
  return (await response.json()) as CatalogItem;
}

export async function deleteCatalogSource(sourceId: string): Promise<void> {
  const url = new URL("/preferences-source", getFunctionsUrl());
  url.searchParams.set("id", sourceId);
  const headers = await buildHeaders();
  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: headers ?? undefined,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Unable to delete source");
  }
}
