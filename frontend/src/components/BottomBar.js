import React from "react";
import "./BottomBar.css";

const BottomBar = ({ landings = 0, aliens = 0 }) => {
  return (
    <div className="bottom-bar-wrapper">
      <div className="top-strip" /> {/* ✅ מחוץ ל־bottom-bar */}

      <div className="bottom-bar">
        <div className="status-counts">
          <span className="count">{landings}</span>
          <span>🛸 : 👽</span>
          <span className="count">{aliens}</span>
        </div>

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
