// src/components/SidePanelLeft.js
import React, { useState } from "react";
import "./SidePanelLeft.css";
import "../components/LogPanel.css";

const SidePanelLeft = ({ logItems = [], landings = 0, aliens = 0 }) => {
  const [paused, setPaused] = useState(false);

  const handleSave = () => {
    const text = logItems.map(item => `[${item.time}] ${item.id}: ${item.location}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'log.txt';
    link.click();
  };

  const handleClear = () => {
    console.clear(); // פעולה דמיונית, ניתן להחליף ב־setLog([])
  };

  return (
    <div className="side-panel-left">
      <div className="status-alert-wrapper">
        <div className="status-counts">
          <span className="count">{landings}</span>
          <span>🛸 : 👽</span>
          <span className="count">{aliens}</span>
        </div>
        <div className="alert-lights">
          <div className="light yellow" />
          <div className="light orange" />
          <div className="light red" />
        </div>
      </div>

      <div className="divider" />
      <div className="log-title">INVADERS LOG</div>
      <div className="divider" />

      <div className="log-controls">
        <button onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={handleClear}>Clear</button>
        <button className="save-button" onClick={handleSave}>Save Log</button>
      </div>

      <div className="log-area">
        {logItems.length === 0 ? (
          <div className="log-entry">No recent activity.</div>
        ) : (
          logItems.map((entry, index) => (
            <React.Fragment key={index}>
              {entry.type === 'landing' && (
                <div className="log-landing-banner">
                  🚨 Landing Detected: <strong>{entry.id}</strong> — <span dangerouslySetInnerHTML={{ __html: entry.location }} />
                </div>
              )}
              <div className={`log-entry ${entry.type}`}>
                <span className="log-time">[{entry.time}]</span>{" "}
                <span style={{ fontSize: "18px", marginRight: "4px" }}>
                  {entry.type === "landing" ? "🛸" : "👽"}
                </span>{" "}
                <strong>{entry.id}</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: entry.location }} />
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default SidePanelLeft;
