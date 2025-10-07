import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import AuthLoadingOverlay from "../components/ui/AuthLoadingOverlay";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import { useAuthContext } from "../context/AuthContext";

type LandingPageProps = {
  openForgotInitially?: boolean;
};

export default function LandingPage({ openForgotInitially = false }: LandingPageProps) {
  const { articles, isLoading } = useArticles();
  const {
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleVerifyEmail,
  } = useAuthHandlers();
  const { logout } = useAuthContext();

  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Handle verify-email?token=...
  // ✅ Handle verify-email?token=... (one-time only)
// useEffect(() => {
//   const token = new URLSearchParams(window.location.search).get("token");
//   if (window.location.pathname === "/verify-email" && token) {
//     // prevent multiple requests for the same token
//     if (verifying || verifySuccess || verifyError) return;

//     const verifyOnce = async () => {
//       try {
//         setVerifying(true);
//         await handleVerifyEmail(token);
//         setVerifySuccess(true);
//         setVerifyError(null);
//         setTimeout(() => {
//           setVerifying(false);
//           setVerifySuccess(false);
//           setAuthOpen(true);
//           setView("login");
//         }, 1800);
//       } catch (err: any) {
//         setVerifyError(err?.message || "Verification failed. Please try again.");
//         setTimeout(() => {
//           setVerifying(false);
//           setAuthOpen(true);
//           setView("login");
//         }, 1800);
//       }
//     };

//     verifyOnce();
//   }
//   // ✅ Empty dependency array ensures it runs once when component mounts
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

  useEffect(() => {
  const token = new URLSearchParams(window.location.search).get("token");
  if (window.location.pathname === "/verify-email" && token) {
    // prevent multiple requests for same token
    if (verifying || verifySuccess || verifyError) return;

    const verifyOnce = async () => {
      try {
        setVerifying(true);
        await handleVerifyEmail(token);
        setVerifySuccess(true);
        setVerifyError(null);

        setTimeout(() => {
          // ✅ Reset all verification states at once
          setVerifying(false);
          setVerifySuccess(false);
          setVerifyError(null);
          setAuthOpen(true);
          setView("login");
        }, 1800);
      } catch (err: any) {
        setVerifyError(err?.message || "Verification failed. Please try again.");
        setVerifySuccess(false);
        setVerifying(false);

        setTimeout(() => {
          // ✅ Reset all verification states at once
          setVerifying(false);
          setVerifySuccess(false);
          setVerifyError(null);
          setAuthOpen(true);
          setView("login");
        }, 1800);
      }
    };

    verifyOnce();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // Forgot password direct open
  useEffect(() => {
    if (openForgotInitially || location.pathname === "/forgot-password") {
      logout();
      setView("forgot");
      setAuthOpen(true);
    }
  }, [openForgotInitially, location, logout]);

  // Reset password modal
  useEffect(() => {
    const token = searchParams.get("token");
    if (location.pathname === "/reset-password" && token) {
      setResetToken(token);
      setView("reset");
      setAuthOpen(true);
    }
  }, [searchParams, location]);

  const openModal = (v: "login" | "signup" | "forgot") => {
    setView(v);
    setAuthOpen(true);
  };

  return (
    <LayoutWrapper
      variant="landing"
      onLogin={() => openModal("login")}
      onSignup={() => openModal("signup")}
    >
      <HeroSection onSignup={() => openModal("signup")} />
      <FeaturesSection />
      <LatestNewsSection articles={articles} isLoading={isLoading} disablePopup />

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        view={view}
        resetToken={resetToken}
        onClose={() => setAuthOpen(false)}
        onSwitch={(v) => {
          setView(v);
          if (!authOpen) setAuthOpen(true);
        }}
        onSubmitLogin={handleLogin}
        onSubmitSignup={handleSignup}
        onSubmitForgotPassword={handleForgotPassword}
      />

      {/* Verification Overlay */}
      {verifying && (
        <AuthLoadingOverlay
          loading
          message="Verifying your email..."
        />
      )}
      {verifySuccess && (
        <AuthLoadingOverlay
          loading={false}
          success
          message="Email verified! You can now log in."
        />
      )}
      {verifyError && (
        <AuthLoadingOverlay
          loading={false}
          error={verifyError}
          message={verifyError}
          onClose={() => setVerifyError(null)}
        />
      )}
    </LayoutWrapper>
  );
}
