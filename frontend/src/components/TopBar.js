// 📁 src/components/TopBar.js
import React from "react";
import "./TopBar.css";

const TopBar = () => {
  return (
    <div className="top-bar-wrapper">
      <div className="top-bar">
        <span className="dot" /> ACTIVE
      </div>
      <div className="top-bar-strip" />
    </div>
  );
};

export default TopBar;
