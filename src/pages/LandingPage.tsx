import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

export default function LandingPage() {
  const { articles } = useArticles();
  const { handleLogin, handleSignup, handleForgotPassword } = useAuthHandlers();

  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // ✅ Detect ?token=xyz for password reset links
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setView("reset");
      setAuthOpen(true);
    }
  }, [searchParams]);

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
      <LatestNewsSection articles={articles} disablePopup showBookmark={false} />

      {/* ✅ Auth modal for login/signup/forgot/reset */}
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
    </LayoutWrapper>
  );
}
