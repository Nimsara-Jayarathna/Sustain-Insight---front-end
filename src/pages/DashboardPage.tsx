import React, { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ForYouView from "../components/dashboard/ForYouView";
import AllNewsView from "../components/dashboard/AllNewsView";
import BookmarksView from "../components/dashboard/BookmarksView";
import ProfileModal from "../components/dashboard/ProfileModal";
import DashboardNav from "../components/dashboard/DashboardNav";
import { useDashboardView } from "../hooks/useDashboardView";

export default function DashboardPage() {
  const { activeView, setActiveView } = useDashboardView();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

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
        userName="User"
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
