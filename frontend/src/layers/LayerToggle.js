import React from 'react';
import './LayerToggle.css';

export default function LayerToggle({
  showMunicipalities,
  setShowMunicipalities,
  showInvasion,
  setShowInvasion
}) {
  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'white', padding: '10px', borderRadius: '6px', boxShadow: '0 0 8px rgba(0,0,0,0.2)' }}>
      <label>
        <input
          type="checkbox"
          checked={showMunicipalities}
          onChange={() => setShowMunicipalities(!showMunicipalities)}
        />
        רשויות מקומיות
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={showInvasion}
          onChange={() => setShowInvasion(!showInvasion)}
        />
        פלישת חייזרים
      </label>
    </div>
  );
}
