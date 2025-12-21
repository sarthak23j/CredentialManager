import React, { useState } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { login, register } from '../../api'; // Adjusted import path
import InputGroup from '../ui/InputGroup';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isRegistering) {
        const response = await register(username, password);
        setMessage(response.data.message);
        setIsRegistering(false);
      } else {
        const response = await login(username, password);
        if (response.data.success) {
          onLoginSuccess(response.data.username);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1><ShieldCheck size={40} color="#8b5cf6" /> Credential Manager</h1>
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup 
            icon={User} 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <InputGroup 
            icon={Lock} 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="primary-btn">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        {message && <p className="status-msg">{message}</p>}
        <button 
          className="secondary-btn" 
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Auth;