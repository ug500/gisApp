// src/layers/NearbySheltersControl.js
import React from 'react';
import './NearbySheltersControl.css';

const NearbySheltersControl = ({ radius, setRadius, landingCoords, shelters }) => {
  if (!landingCoords) return null;

  return (
    <div className="nearby-shelters-panel">
      <div className="nearby-shelters-title">מקלטים קרובים לנק' נחיתה</div>

      <label>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
        />
        <span style={{ marginLeft: '10px' }}>{radius} meters</span>
      </label>

      <hr style={{ borderColor: '#444', margin: '10px 0' }} />

      <div className="nearby-shelters-list">
        {shelters?.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center' }}>No shelters found nearby.</p>
        ) : (
          shelters.map((shelter, i) => (
            <div key={i} className="shelter-item">
              🛡️ <strong>{shelter.properties?.t_sug || 'Unknown'}</strong><br />
              📍 <span>{shelter.distance?.toFixed(0)} meters away</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NearbySheltersControl;
