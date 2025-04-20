import React, { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin, error }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onRegister(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="reg-firstName">First Name</label>
        <input type="text" id="reg-firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="reg-lastName">Last Name</label>
        <input type="text" id="reg-lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="reg-email">Email</label>
        <input type="email" id="reg-email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="reg-username">Username</label>
        <input type="text" id="reg-username" name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
      </div>
      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input type="password" id="reg-password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
      </div>
      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      <p className="switch-form">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Login here
        </button>
      </p>
    </form>
  );
}
