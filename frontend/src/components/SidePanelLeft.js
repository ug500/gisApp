// src/components/SidePanelLeft.js
import React from "react";
import "./SidePanelLeft.css";
import "../components/LogPanel.css";

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
          <div className="log-entry">No recent activity.</div>
        ) : (
          logItems.map((entry, index) => (
            <div key={index} className={`log-entry ${entry.type}`}>
              <span className="log-time">[{entry.time}]</span>{" "}
              {entry.type === "landing" ? "🛸" : "👽"} <strong>{entry.id}</strong>{" "}
              <span
                dangerouslySetInnerHTML={{ __html: entry.location }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidePanelLeft;