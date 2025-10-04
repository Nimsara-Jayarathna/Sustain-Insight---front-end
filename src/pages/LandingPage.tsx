import { useState } from "react";
import AppHeader from "../components/layout/AppHeader";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

export default function LandingPage() {
  const { articles } = useArticles();
  const { handleLogin, handleSignup } = useAuthHandlers();
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AppHeader
        variant="landing"
        onLogin={() => {
          setView("login");
          setAuthOpen(true);
        }}
        onSignup={() => {
          setView("signup");
          setAuthOpen(true);
        }}
      />
      <HeroSection
        onSignup={() => {
          setView("signup");
          setAuthOpen(true);
        }}
      />
      <FeaturesSection />
      <LatestNewsSection
        articles={articles}
        disablePopup={true}
        showBookmark={false}
      />
      <Footer />
      <AuthModal
        open={authOpen}
        view={view}
        onClose={() => setAuthOpen(false)}
        onSwitch={setView}
        onSubmitLogin={handleLogin}
        onSubmitSignup={handleSignup}
      />
    </div>
  );
}
