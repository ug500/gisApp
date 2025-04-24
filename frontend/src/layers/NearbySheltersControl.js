// src/layers/NearbySheltersControl.js
import React from 'react';
import './NearbySheltersControl.css';

const NearbySheltersControl = ({ radius, setRadius, landingCoords, shelters }) => {
  return (
    <div className="nearby-shelters-panel">
      <div className="nearby-shelters-title">מקלטים קרובים לנק' נחיתה</div>

      <label className={!landingCoords ? 'disabled' : ''}>
        <input
          type="range"
          min={100}
          max={2000}
          step={50}
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          disabled={!landingCoords}
        />
        <span className="radius-value">{radius} meters</span>
      </label>

      <hr style={{ borderColor: '#444', margin: '10px 0' }} />

      {!landingCoords && (
        <div className="shelter-warning">
        🛡️ חיפוש מקלטים זמין רק עבור: תל־אביב-יפו, בני ברק, רמת גן, גבעתיים, רמת השרון, חולון, בת ים.
      </div>
      
      )}

      <div className="nearby-shelters-list">
        {landingCoords && shelters?.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
            No shelters found nearby.
          </p>
        ) : (
          landingCoords &&
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
