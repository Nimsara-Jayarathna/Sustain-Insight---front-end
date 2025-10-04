import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import Footer from "../components/layout/Footer";
import ForYouView from "../components/dashboard/ForYouView";
import AllNewsView from "../components/dashboard/AllNewsView";
import BookmarksView from "../components/dashboard/BookmarksView";
import ProfileModal from "../components/dashboard/ProfileModal";
import DashboardNav from "../components/dashboard/DashboardNav";
import { useDashboardView } from "../hooks/useDashboardView";
import { useAuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";

export default function DashboardPage() {
  const { activeView, setActiveView } = useDashboardView();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Public preferences (kept for future use, prefixed with _ to avoid TS unused warning)
  const [_categories, _setCategories] = useState<any[]>([]);
  const [_sources, _setSources] = useState<any[]>([]);
  const [_loading, _setLoading] = useState(true);

  // Enforce authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // redirect unauthenticated users to home
    }
  }, [isAuthenticated, navigate]);

  // Fetch public categories & sources for future use
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        _setCategories(cats);
        _setSources(srcs);
      } catch (err) {
        console.error("DEBUG → Failed to fetch preferences:", err);
      } finally {
        _setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case "all-news":
        return <AllNewsView />;
      case "bookmarks":
        return <BookmarksView />;
      case "for-you":
      default:
        return <ForYouView />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <AppHeader
        variant="dashboard"
        onProfileClick={() => setProfileModalOpen(true)}
      />

      <div className="container mx-auto px-4 py-4">
        <DashboardNav activeView={activeView} onChange={setActiveView} />
        <main>{renderActiveView()}</main>
      </div>

      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />    <Footer/>

    </div>
  );
}
