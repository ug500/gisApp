// src/components/SidePanelLeft.js
import React from "react";
import "./SidePanelLeft.css";
import "../components/LogPanel.css";

const SidePanelLeft = ({ logItems = [], landings = 0, aliens = 0, paused, setPaused, clearLog }) => {

  const handleSave = () => {
    const text = logItems.map(item => `[${item.time}] ${item.id}: ${item.location}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'log.txt';
    link.click();
  };

  const yellowClass = landings >= 1 ? "light yellow blinking" : "light yellow";
  const orangeClass = landings >= 2 ? "light orange blinking" : "light orange";
  const redClass = landings >= 3 ? "light red blinking" : "light red";

  const renderButton = (label, onClick) => (
    <button onClick={onClick}>
      <span className="transition" />
      <span className="gradient" />
      <span className="label">{label}</span>
    </button>
  );

  return (
    <div className="side-panel-left">
      <div className="status-alert-wrapper">
        <div className="status-counts">
          <span className="count">{landings}</span>
          <span>🛸 : 👽</span>
          <span className="count">{aliens}</span>
        </div>
        <div className="alert-lights">
          <div className={redClass} />
          <div className={orangeClass} />
          <div className={yellowClass} />
        </div>
      </div>

      <div className="divider" />
      <div className="log-title">INVADERS LOG</div>
      <div className="divider" />

      <div className="left-log-controls">
        {renderButton(paused ? 'Resume' : 'Pause', () => setPaused(!paused))}
        {renderButton('Clear', clearLog)}
        {renderButton('Save Log', handleSave)}
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
