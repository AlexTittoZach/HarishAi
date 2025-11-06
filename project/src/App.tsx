import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { SpotifyProvider } from './contexts/SpotifyContext';

// Pages
import ChatPage from './pages/ChatPage';
import MoodTracker from './pages/MoodTracker';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import WelcomePage from './pages/WelcomePage';

// Components
import Layout from './components/layout/Layout';

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setIsFirstVisit(false);
  };

  if (isFirstVisit) {
    return <WelcomePage onComplete={completeOnboarding} />;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <SpotifyProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </SpotifyProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;