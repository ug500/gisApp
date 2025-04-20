import React from 'react';
import './Navbar.css'; // Make sure this CSS file exists and is styled

// Accept user and onLogout props
export default function Navbar({ user, onLogout, onToggleLog }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Alien Invasion Map</div>
      <div className="navbar-controls">
        {user && (
          <span className="navbar-user-info">
            Welcome, {user.firstName || user.username}!
          </span>
        )}
        <button onClick={onToggleLog} className="navbar-button">
          Toggle Log
        </button>
        {user && (
          <button onClick={onLogout} className="navbar-button logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
