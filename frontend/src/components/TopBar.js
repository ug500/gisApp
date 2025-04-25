// 📁 src/components/TopBar.js
import React from "react";
import "./TopBar.css";

const TopBar = ({ currentUser, onLogout }) => {
  return (
    <div className="top-bar-wrapper">
      <div className="top-bar">
        <div className="user-info">
          <div className="status-indicator">
            <span className="dot" />
            <span className="active-label">ACTIVE</span>
          </div>
          <span className="user-greeting">
            Welcome, {currentUser?.firstName || 'User'}
          </span>
        </div>
        <div className="logout-container">
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="top-bar-strip" />
    </div>
  );
};

export default TopBar;