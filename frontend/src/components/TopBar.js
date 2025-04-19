// src/components/TopBar.js
import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="active-indicator centered">
        <span className="dot"></span>
        <span className="label">ACTIVE</span>
      </div>
    </div>
  );
};

export default TopBar;
