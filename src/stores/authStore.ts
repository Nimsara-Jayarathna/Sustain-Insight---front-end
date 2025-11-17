import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

type ProfileRow = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
};

export type Profile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
};

type SignUpPayload = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  password: string;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  hasBootstrapped: boolean;
  sessionExpired: boolean;
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

const getProfileFallback = (user: User | null, row?: ProfileRow | null): Profile | null => {
  if (!user && !row) return null;
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const [defaultFirst = "", ...rest] = fullName.split(" ");
  const defaultLast = rest.join(" ");
  return {
    id: row?.id ?? user?.id ?? "",
    userId: row?.user_id ?? user?.id ?? "",
    firstName:
      row?.first_name ??
      (user?.user_metadata?.first_name as string | undefined) ??
      defaultFirst ??
      user?.email?.split("@")[0] ??
      "",
    lastName:
      row?.last_name ??
      (user?.user_metadata?.last_name as string | undefined) ??
      defaultLast ??
      "",
    jobTitle:
      row?.job_title ??
      (user?.user_metadata?.title as string | undefined) ??
      null,
  };
};

const fetchProfileRow = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id,user_id,first_name,last_name,job_title")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116" && error.code !== "PGRST103") {
    throw error;
  }

  return data;
};

let authSubscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  hasBootstrapped: false,
  sessionExpired: false,
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
    const profileRow = user ? await fetchProfileRow(user.id).catch(() => null) : null;
    const profile = getProfileFallback(user, profileRow);

    set({
      session: sessionData.session ?? null,
      user,
      profile,
      loading: false,
      hasBootstrapped: true,
      sessionExpired: false,
    });

    if (!authSubscription) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user ?? null;
        const profileData = currentUser ? await fetchProfileRow(currentUser.id).catch(() => null) : null;
        set({
          session: session ?? null,
          user: currentUser,
          profile: getProfileFallback(currentUser, profileData),
          loading: false,
          sessionExpired: event === "TOKEN_REFRESHED" ? false : get().sessionExpired,
        });
        if (event === "SIGNED_OUT") {
          set({ sessionExpired: false });
        }
      });
      authSubscription = data.subscription;
    }
  },
  loginWithPassword: async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const profileRow = await fetchProfileRow(data.user.id).catch(() => null);
      set({ profile: getProfileFallback(data.user, profileRow), sessionExpired: false });
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
    set({ session: null, user: null, profile: null, sessionExpired: false });
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
    const profileRow = await fetchProfileRow(user.id).catch(() => null);
    set({ profile: getProfileFallback(user, profileRow) });
  },
  setSessionExpired: (value: boolean) => set({ sessionExpired: value }),
}));
