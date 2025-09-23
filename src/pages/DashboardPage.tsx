import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ForYouView from "../components/dashboard/ForYouView";
import AllNewsView from "../components/dashboard/AllNewsView";
import BookmarksView from "../components/dashboard/BookmarksView";
import ProfileModal from "../components/dashboard/ProfileModal";
import DashboardNav from "../components/dashboard/DashboardNav";
import { useDashboardView } from "../hooks/useDashboardView";
import { useAuthContext } from "../context/AuthContext";  // ✅ use global auth
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { activeView, setActiveView } = useDashboardView();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuthContext();   // ✅ shared auth state
  const navigate = useNavigate();

  // 🚨 Warn if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("⚠️ DEBUG → User is not authenticated but accessed /dashboard");
      alert("You are not logged in. Redirecting to home...");
      //navigate("/"); // keep commented during dev
    }
  }, [isAuthenticated, navigate]);

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
        userName={user?.name || "User"}
        onProfileClick={() => setProfileModalOpen(true)}
      />
      <div className="container mx-auto px-4 py-4">
        <DashboardNav activeView={activeView} onChange={setActiveView} />
        <main>{renderActiveView()}</main>
      </div>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
