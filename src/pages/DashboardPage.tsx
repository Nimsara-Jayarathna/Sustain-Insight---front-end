import { useState } from "react";
import LayoutWrapper from "../components/layout/LayoutWrapper";
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
        return <BookmarksView onNavigate={setActiveView} />;
      case "for-you":
      default:
        // --- THE FIX IS HERE: Pass both required props to ForYouView ---
        return (
          <ForYouView
            onNavigate={setActiveView}
            onManagePreferences={() => setProfileModalOpen(true)}
          />
        );
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