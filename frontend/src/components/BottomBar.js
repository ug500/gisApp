// 📁 src/components/BottomBar.js

import React from "react";
import "./BottomBar.css";

const BottomBar = ({ landings = 0, aliens = 0 }) => {
  return (
    <div className="bottom-bar">
      <div className="status-counts">
        <span>🛸 {landings}</span>
        <span>👽 {aliens}</span>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search by landing name or area..."
      />
    </div>
  );
};

export default BottomBar;
