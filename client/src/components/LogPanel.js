import React from 'react';
import './LogPanel.css';

const LogPanel = ({ visible, data }) => {
  if (!visible) return null;

  const landings = data.filter(f => f.properties?.type === 'landing');
  const aliens = data.filter(f => f.properties?.type === 'alien');

  return (
    <div className="log-panel">
      <h3>📋 Invasion Log</h3>
      <div className="log-section">
      <h4>🛸 Landings:</h4>
{landings.map((l, idx) => (
  <div key={`l-${idx}`} className="log-entry">
    {l.properties.landingCode || '?'} – {l.properties.locationName || 'Unknown'}
  </div>
))}

        
      </div>
      <div className="log-section">
        <h4>👽 Aliens:</h4>
        {aliens.map((a, idx) => (
          <div key={`a-${idx}`} className="log-entry">
            {a.properties.alienCode || '?'} → {a.geometry.coordinates.join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogPanel;