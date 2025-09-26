import { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ForYouView from "../components/dashboard/ForYouView";
import AllNewsView from "../components/dashboard/AllNewsView";
import BookmarksView from "../components/dashboard/BookmarksView";
import ProfileModal from "../components/dashboard/ProfileModal";
import DashboardNav from "../components/dashboard/DashboardNav";
import { useDashboardView } from "../hooks/useDashboardView";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function DashboardPage() {
  const { activeView, setActiveView } = useDashboardView();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Optional: public preferences (for future use)
  const [categories, setCategories] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated (development-friendly)
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("⚠️ DEBUG → User is not authenticated but accessed /dashboard");
      // navigate("/"); // Uncomment in production
    }
  }, [isAuthenticated, navigate]);

  // Fetch public categories & sources (optional)
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const [cats, srcs] = await Promise.all([
          apiFetch("/api/public/categories"),
          apiFetch("/api/public/sources"),
        ]);
        setCategories(cats);
        setSources(srcs);
      } catch (err) {
        console.error("DEBUG → Failed to fetch preferences:", err);
      } finally {
        setLoading(false);
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
      <DashboardHeader
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <div className="container mx-auto px-4 py-4">
        <DashboardNav activeView={activeView} onChange={setActiveView} />
        <main>{renderActiveView()}</main>
      </div>

      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}