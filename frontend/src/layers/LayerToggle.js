import React from 'react';
import './LayerToggle.css';

function LayerToggle({
  onToggleMunicipalities,
  onToggleLandings,
  onToggleHistory,
  onToggleAliens,
  onToggleShelters,
  onToggleNearbyShelters,
  onToggleWeather,
  onToggleNightMode,
  showMunicipalities,
  showLandings,
  showHistory,
  showAliens,
  showShelters,
  showNearbyShelters,
  showWeather,
  nightMode
}) {
  const getClass = (isActive) =>
    `layer-button${isActive ? ' active' : ''}`;

  return (
<div className="layer-controls">
  <button onClick={onToggleMunicipalities} className={getClass(showMunicipalities)}>🛰️</button>
  <button onClick={onToggleLandings} className={getClass(showLandings)}>👽</button>
  <button onClick={onToggleShelters} className={getClass(showShelters)}>🛡️</button> {/* shelters */}
  <button onClick={onToggleNearbyShelters} className={getClass(showNearbyShelters)}>📍</button> {/* nearby */}
  <button onClick={onToggleHistory} className={getClass(showHistory)}>⏱️</button>
  <button onClick={onToggleAliens} className={getClass(showAliens)}>👾</button>     {/* aliens */}
  
  <button onClick={onToggleWeather} className={getClass(showWeather)}>🌦️</button>
  <button onClick={onToggleNightMode} className={getClass(nightMode)}>🌙</button>
</div>

  );
}

export default LayerToggle;
