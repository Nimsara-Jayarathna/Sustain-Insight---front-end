import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { fetchCurrentUser } from "../services/api/user";

export type UserRole = "admin" | "user";

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

type ApiProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole | null;
};

const buildProfile = (user: User | null, api?: ApiProfile | null): Profile | null => {
  if (!user || !api) return null;
  return {
    id: user.id,
    userId: user.id,
    firstName: api.firstName,
    lastName: api.lastName,
    fullName: api.fullName,
    role: api.role ?? null,
    jobTitle: null,
  };
};

const fetchProfile = async (
  user: User | null,
): Promise<{ profile: Profile | null; unauthorized: boolean }> => {
  if (!user) return { profile: null, unauthorized: false };
  try {
    const apiProfile = await fetchCurrentUser();
    return { profile: buildProfile(user, apiProfile), unauthorized: false };
  } catch (err: any) {
    if (err?.status === 401) {
      return { profile: null, unauthorized: true };
    }
    console.error(err);
    throw err;
  }
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
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) console.error(sessionError);

    const session = sessionData.session ?? null;
    const user = session?.user ?? null;
    let profile: Profile | null = null;
    let unauthorized = false;
    if (user) {
      try {
        const result = await fetchProfile(user);
        profile = result.profile;
        unauthorized = result.unauthorized;
      } catch (err) {
        console.error(err);
      }
    }

    set({
      session,
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
        try {
          const { profile: profileData, unauthorized: unauthorizedProfile } = await fetchProfile(currentUser);
          set({
            session: session ?? null,
            user: currentUser,
            profile: profileData,
            role: profileData?.role ?? null,
            loading: false,
            sessionExpired: event === "TOKEN_REFRESHED" ? false : get().sessionExpired,
            rlsUnauthorized: unauthorizedProfile,
          });
        } catch (err) {
          console.error(err);
          set({
            session: session ?? null,
            user: currentUser,
            profile: null,
            role: null,
            loading: false,
          });
        }
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
      try {
        const { profile, unauthorized } = await fetchProfile(data.user);
        set({
          profile,
          role: profile?.role ?? null,
          sessionExpired: false,
          rlsUnauthorized: unauthorized,
        });
      } catch (err) {
        console.error(err);
      }
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
    try {
      const { profile, unauthorized } = await fetchProfile(user);
      set({ profile, role: profile?.role ?? null, rlsUnauthorized: unauthorized });
    } catch (err) {
      console.error(err);
    }
  },
  setSessionExpired: (value: boolean) => set({ sessionExpired: value }),
}));
