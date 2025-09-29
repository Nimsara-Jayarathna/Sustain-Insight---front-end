import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LatestNewsSection from "../components/landing/LatestNewsSection";
import AuthModal from "../components/auth/AuthModal";
import { useArticles } from "../hooks/useArticles";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

export default function LandingPage() {
  const { articles } = useArticles(5);
  const { handleLogin, handleSignup } = useAuthHandlers();
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header
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
      <LatestNewsSection articles={articles} />
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
