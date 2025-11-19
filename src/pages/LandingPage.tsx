import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";

type LandingPageProps = {
  openForgotInitially?: boolean;
};

export default function LandingPage({ openForgotInitially = false }: LandingPageProps) {
  const { landingArticleCount, feedRecentHours, initialize: initializeSettings } = useSettings();
  const recentWindow = useMemo(() => {
    if (!feedRecentHours) return undefined;
    const cutoff = Date.now() - feedRecentHours * 3600 * 1000;
    return new Date(cutoff).toISOString();
  }, [feedRecentHours]);
  const latestPageSize = landingArticleCount || 8;
  const { articles, loading: isLoading } = useArticles({
    latest: true,
    pageSize: latestPageSize,
    dateFrom: recentWindow,
  });
  const { handleLogin, handleSignup, handleForgotPassword } = useAuthHandlers();
  const { logout, isAuthenticated, initialize, role } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initialize?.();
    initializeSettings?.();
  }, [initialize, initializeSettings]);

  // 🔐 Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isAuthenticated || !role) return;
    navigate(role === "admin" ? "/admin" : "/dashboard");
  }, [isAuthenticated, role, navigate]);

  // 🔑 Forgot password direct link
  useEffect(() => {
    if (openForgotInitially || location.pathname === "/forgot-password") {
      logout(); // ensure logged-out state
      setView("forgot");
      setAuthOpen(true);
    }
  }, [openForgotInitially, location, logout]);

  // 🔄 Supabase recovery link support (?type=recovery)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
    const type = params.get("type") || hashParams.get("type");
    if (type === "recovery") {
      setView("reset");
      setAuthOpen(true);
    }
  }, [location]);

  // 🔘 Open modal utility
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
      <LatestNewsSection
        articles={articles}
        isLoading={isLoading}
        disablePopup
        onRequireAuth={() => openModal("signup")}
      />

      {/* 🔹 Auth Modal */}
      <AuthModal
        open={authOpen}
        view={view}
        onClose={() => setAuthOpen(false)}
        onSwitch={(v) => {
          setView(v);
          if (!authOpen) setAuthOpen(true);
        }}
        onSubmitLogin={handleLogin}
        onSubmitSignup={handleSignup}
        onSubmitForgotPassword={handleForgotPassword}
      />

      {/* 🔹 Verification Overlays */}
    </LayoutWrapper>
  );
}
