import { useAuth } from "./useAuth";

export function useAuthHandlers() {
  const {
    loginWithPassword,
    signUp,
    sendPasswordReset,
    resendEmailVerification,
  } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    await loginWithPassword(email, password);
  };

  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    password: string;
  }) => {
    await signUp(data);
  };

  const handleForgotPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  const handleResendVerification = async (email: string) => {
    await resendEmailVerification(email);
  };

  return {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResendVerification,
  };
}
