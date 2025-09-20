import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ForYouView from '../components/dashboard/ForYouView';
import AllNewsView from '../components/dashboard/AllNewsView';
import BookmarksView from '../components/dashboard/BookmarksView';
import ProfileModal from '../components/dashboard/ProfileModal';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState('for-you'); // 'for-you', 'all-news', 'bookmarks'
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  // Helper to render the correct view based on state
  const renderActiveView = () => {
    switch (activeView) {
      case 'all-news':
        return <AllNewsView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'for-you':
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
        {/* Tab Navigation */}
        <nav className="bg-white rounded-lg shadow-sm mb-6">
          <button 
            onClick={() => setActiveView('for-you')}
            className={`px-4 py-3 font-semibold text-sm ${activeView === 'for-you' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            For You
          </button>
          <button 
            onClick={() => setActiveView('all-news')}
            className={`px-4 py-3 font-semibold text-sm ${activeView === 'all-news' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            All News
          </button>
          <button 
            onClick={() => setActiveView('bookmarks')}
            className={`px-4 py-3 font-semibold text-sm ${activeView === 'bookmarks' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          >
            Bookmarks
          </button>
        </nav>

        {/* Content Area */}
        <main>
          {renderActiveView()}
        </main>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </div>
  );
};

export default DashboardPage;