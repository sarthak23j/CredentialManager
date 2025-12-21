import React, { useState } from 'react';
import Auth from './components/Auth/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-root">
      {isLoggedIn ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;