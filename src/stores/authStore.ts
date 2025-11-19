import { create } from "zustand";
import type { PostgrestError, Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export type UserRole = "admin" | "user";

type UserProfileRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
};

type RbacProfileRow = {
  id: string;
  full_name: string | null;
  role: UserRole | null;
};

export type Profile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole | null;
  jobTitle?: string | null;
};

type SignUpPayload = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  password: string;
};

export type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  hasBootstrapped: boolean;
  sessionExpired: boolean;
  rlsUnauthorized: boolean;
  initialize: () => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
  resendEmailVerification: (email: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setSessionExpired: (value: boolean) => void;
};

const getProfileFallback = (
  user: User | null,
  row?: UserProfileRow | null,
  rbac?: RbacProfileRow | null,
): Profile | null => {
  if (!user && !row) return null;
  const metadataFullName = ((user?.user_metadata?.full_name as string | undefined) ?? "").trim();
  const [defaultFirst = "", ...rest] = metadataFullName.split(" ");
  const defaultLast = rest.join(" ");
  const fallbackFirst =
    row?.first_name ??
    (user?.user_metadata?.first_name as string | undefined) ??
    defaultFirst ??
    user?.email?.split("@")[0] ??
    "";
  const fallbackLast =
    row?.last_name ??
    (user?.user_metadata?.last_name as string | undefined) ??
    defaultLast ??
    "";
  const computedFullName = (rbac?.full_name ?? `${fallbackFirst} ${fallbackLast}`.trim()).trim();

  return {
    id: row?.user_id ?? user?.id ?? "",
    userId: row?.user_id ?? user?.id ?? "",
    firstName: fallbackFirst,
    lastName: fallbackLast,
    fullName: computedFullName || fallbackFirst || fallbackLast,
    role: (rbac?.role as UserRole | null) ?? null,
    jobTitle:
      row?.job_title ??
      (user?.user_metadata?.title as string | undefined) ??
      null,
  };
};

const fetchProfileRow = async (userId: string): Promise<UserProfileRow | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id,first_name,last_name,job_title")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116" && error.code !== "PGRST103") {
    throw error;
  }

  return data;
};

const isRlsDenied = (error?: PostgrestError | null) => {
  if (!error) return false;
  if (error.code === "42501" || error.code === "PGRST302") return true;
  const combined = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();
  return combined.includes("row-level security") || combined.includes("permission denied");
};

const fetchRbacProfileRow = async (
  userId: string,
): Promise<{ row: RbacProfileRow | null; unauthorized: boolean }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,role")
    .eq("id", userId)
    .maybeSingle();

  if (!error) {
    return { row: data, unauthorized: false };
  }

  if (error.code === "PGRST116") {
    return { row: null, unauthorized: false };
  }

  if (isRlsDenied(error)) {
    return { row: null, unauthorized: true };
  }

  throw error;
};

const hydrateProfile = async (
  user: User | null,
): Promise<{ profile: Profile | null; unauthorized: boolean }> => {
  if (!user) return { profile: null, unauthorized: false };
  const [profileRow, rbacResult] = await Promise.all([
    fetchProfileRow(user.id).catch(() => null),
    fetchRbacProfileRow(user.id),
  ]);
  return {
    profile: getProfileFallback(user, profileRow, rbacResult.row),
    unauthorized: rbacResult.unauthorized,
  };
};

let authSubscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  hasBootstrapped: false,
  sessionExpired: false,
  rlsUnauthorized: false,
  initialize: async () => {
    if (get().hasBootstrapped) return;
    set({ loading: true });
    const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.auth.getUser(),
    ]);

    if (sessionError) console.error(sessionError);
    if (userError) console.error(userError);

    const user = userData.user ?? sessionData.session?.user ?? null;
    const { profile, unauthorized } = await hydrateProfile(user);

    set({
      session: sessionData.session ?? null,
      user,
      profile,
      role: profile?.role ?? null,
      loading: false,
      hasBootstrapped: true,
      sessionExpired: false,
      rlsUnauthorized: unauthorized,
    });

    if (!authSubscription) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        const { profile: profileData, unauthorized: unauthorizedProfile } = await hydrateProfile(currentUser);
        set({
          session: session ?? null,
          user: currentUser,
          profile: profileData,
          role: profileData?.role ?? null,
          loading: false,
          sessionExpired: event === "TOKEN_REFRESHED" ? false : get().sessionExpired,
          rlsUnauthorized: unauthorizedProfile,
        });
        if (event === "SIGNED_OUT") {
          set({ sessionExpired: false, role: null, rlsUnauthorized: false });
        }
      });
      authSubscription = data.subscription;
    }
  },
  loginWithPassword: async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const { profile, unauthorized } = await hydrateProfile(data.user);
      set({
        profile,
        role: profile?.role ?? null,
        sessionExpired: false,
        rlsUnauthorized: unauthorized,
      });
    }
  },
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  },
  loginWithFacebook: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  },
  loginWithLinkedIn: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  },
  signUp: async ({ firstName, lastName, title, email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
          title,
        },
      },
    });
    if (error) throw error;
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) throw error;
    set({ session: null, user: null, profile: null, role: null, sessionExpired: false, rlsUnauthorized: false });
  },
  resendEmailVerification: async (email: string) => {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) throw error;
  },
  sendPasswordReset: async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  },
  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { profile, unauthorized } = await hydrateProfile(user);
    set({ profile, role: profile?.role ?? null, rlsUnauthorized: unauthorized });
  },
  setSessionExpired: (value: boolean) => set({ sessionExpired: value }),
}));
