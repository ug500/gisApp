// src/components/SidePanelLeft.js
import React from "react";
import "./SidePanelLeft.css";

const SidePanelLeft = ({ logItems = [] }) => {
  return (
    <div className="side-panel-left">
      <div className="alert-lights">
        <div className="light yellow" />
        <div className="light orange" />
        <div className="light red" />
      </div>

      <div className="divider" />
      <div className="log-title">INVADERS LOG</div>
      <div className="divider" />

      <div className="log-area">
        {logItems.length === 0 ? (
          <div className="log-line">No recent activity.</div>
        ) : (
          logItems.map((line, index) => (
            <div key={index} className="log-line">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidePanelLeft;
