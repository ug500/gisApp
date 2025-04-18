import React from 'react';
import './LayerToggle.css'; // Make sure this file has the .layer-controls CSS

export default function LayerToggle({
  showMunicipalities,
  setShowMunicipalities,
  showInvasion,
  setShowInvasion,
  showHistory,
  setShowHistory
}) {
  return (
    <div className="layer-controls">
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
      <br />
      <label>
        <input
          type="checkbox"
          checked={showHistory}
          onChange={() => setShowHistory(!showHistory)}
        />
        פלישות היסטוריות
      </label>
    </div>
  );
}
