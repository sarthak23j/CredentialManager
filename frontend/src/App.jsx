import React, { useState } from 'react';
import Auth from './components/Auth/Auth';
import Dashboard from './pages/Dashboard';
import './components/ui/Toast.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    showToast(`Welcome back, ${username}!`);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsLoggedIn(false);
    showToast("Logged out successfully");
  };

  return (
    <div className="app-root">
      {isLoggedIn ? (
        <Dashboard user={currentUser} onLogout={handleLogout} showToast={showToast} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      )}

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;