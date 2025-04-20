import React, { useState, useEffect } from 'react';
import MainMap from './layers/MainMap'; // Adjust path if needed
import AuthModal from './components/auth/AuthModal'; // Adjust path
import authService from './services/authService'; // Adjust path
import './App.css'; // Optional: for global styles

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To prevent flicker on load

  // Check for existing token/user on initial mount
  useEffect(() => {
    const storedToken = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (storedToken && storedUser) {
      // TODO: Optionally verify token with backend here for added security
      setToken(storedToken);
      setCurrentUser(storedUser);
    }
    setIsLoading(false); // Finished initial check
  }, []);

  const handleAuthSuccess = (user, receivedToken) => {
    setCurrentUser(user);
    setToken(receivedToken);
    // Local storage is handled by authService, no need to set it here
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
  };

  if (isLoading) {
    // Optional: Render a loading spinner or blank screen during initial check
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {!currentUser ? (
        // Show Auth Modal if not logged in
        <AuthModal onAuthSuccess={handleAuthSuccess} />
      ) : (
        // Show Main Map application if logged in
        // Pass the logout handler and user info to MainMap/Navbar
        <MainMap currentUser={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
