import React from "react";
import "./BottomBar.css";

const BottomBar = () => {
  return (
    <div className="bottom-bar-wrapper">
      <div className="top-strip" /> {/* ✅ מחוץ ל־bottom-bar */}

      <div className="bottom-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by landing name or area..."
        />
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default BottomBar;
