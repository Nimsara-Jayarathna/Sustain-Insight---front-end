import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/layout/LayoutWrapper";
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

  // Public preferences (for future personalization)
  const [_categories, _setCategories] = useState<any[]>([]);
  const [_sources, _setSources] = useState<any[]>([]);
  const [_loading, _setLoading] = useState(true);



  // Fetch public categories & sources
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
    <LayoutWrapper
      variant="dashboard"
      onProfileClick={() => setProfileModalOpen(true)}
    >
      <div className="container mx-auto px-4 py-4">
        <DashboardNav activeView={activeView} onChange={setActiveView} />
        <main className="mt-4">{renderActiveView()}</main>
      </div>

      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </LayoutWrapper>
  );
}
