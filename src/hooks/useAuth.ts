import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const {
    user,
    profile,
    session,
    loading,
    role,
    rlsUnauthorized,
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
  } = useAuthContext();

  const resolvedRole = role ?? profile?.role ?? null;

  return {
    user,
    profile,
    role: resolvedRole,
    isAdmin: resolvedRole === "admin",
    session,
    loading,
    isAuthenticated: !!session && !!user,
    rbacUnauthorized: rlsUnauthorized,
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
