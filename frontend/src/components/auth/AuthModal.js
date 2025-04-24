import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import authService from '../../services/authService'; // Adjust path if needed
import './AuthModal.css'; // We'll create this CSS file next

export default function AuthModal({ onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    setError(''); // Clear previous errors
    try {
      const data = await authService.login(credentials);
      onAuthSuccess(data.user, data.token); // Notify parent component
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (userData) => {
    setError(''); // Clear previous errors
    try {
      const data = await authService.register(userData);
       onAuthSuccess(data.user, data.token); // Notify parent component
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal-content">
        {isLoginView ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => { setIsLoginView(false); setError(''); }}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => { setIsLoginView(true); setError(''); }}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
