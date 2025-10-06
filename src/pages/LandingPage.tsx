import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import { useAuthContext } from "../context/AuthContext";

type LandingPageProps = {
  openForgotInitially?: boolean;
};

export default function LandingPage({ openForgotInitially = false }: LandingPageProps) {
  const { articles, isLoading } = useArticles();

  const { handleLogin, handleSignup, handleForgotPassword } = useAuthHandlers();
  const { logout } = useAuthContext();

  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setView("reset");
      setAuthOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (openForgotInitially || location.pathname === "/forgot-password") {
      logout();

      setView("forgot");
      setAuthOpen(true);
    }
  }, [openForgotInitially, location, logout]);

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

      {/* 🔹 Auth Modal handles login/signup/forgot/reset */}
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
