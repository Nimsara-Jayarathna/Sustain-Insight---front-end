//import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
//import DashboardPage from './pages/DashboardPage';

function App() {
  // In a real app, you would have logic to redirect logged-in users
  // from the landing page to the dashboard.
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/*<Route path="/dashboard" element={<DashboardPage />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
