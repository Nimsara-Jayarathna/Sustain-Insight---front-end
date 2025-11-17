import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const {
    user,
    profile,
    session,
    loading,
    sessionExpired,
    loginWithPassword,
    loginWithGoogle,
    loginWithFacebook,
    loginWithLinkedIn,
    signUp,
    logout,
    resendEmailVerification,
    sendPasswordReset,
    refreshProfile,
    initialize,
    setSessionExpired,
  } = useAuthStore();

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!session && !!user,
    sessionExpired,
    loginWithPassword,
    loginWithGoogle,
    loginWithFacebook,
    loginWithLinkedIn,
    signUp,
    logout,
    resendEmailVerification,
    sendPasswordReset,
    refreshProfile,
    initialize,
    setSessionExpired,
  };
};
