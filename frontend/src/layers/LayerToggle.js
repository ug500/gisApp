// src/layers/LayerToggle.js
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
  onToggleBlinking,
  onToggleAlienStats, // ✅ new toggle for external AlienStatsLayer
  stopBlinking,
  showMunicipalities,
  showLandings,
  showHistory,
  showAliens,
  showShelters,
  showNearbyShelters,
  showWeather,
  nightMode,
  showAlienStatsLayer

}) {
  const getClass = (isActive) => `layer-button${isActive ? ' active' : ''}`;

  const handleAlienInfoToggle = () => {
    onToggleAliens();
    onToggleAlienStats();
  };

  return (
    <div className="layer-controls-wrapper">
      <div className="layer-controls">
        <button onClick={onToggleMunicipalities} className={getClass(showMunicipalities)}>🛰️</button>
        <button onClick={onToggleLandings} className={getClass(showLandings)}>👽</button>
        <button onClick={onToggleShelters} className={getClass(showShelters)}>🛡️</button>
        <button onClick={onToggleNearbyShelters} className={getClass(showNearbyShelters)}>📍</button>
        <button onClick={onToggleHistory} className={getClass(showHistory)}>⏱️</button>
        <button onClick={handleAlienInfoToggle} className={getClass(showAlienStatsLayer)}>👾</button>


        <button onClick={onToggleWeather} className={getClass(showWeather)}>🌦️</button>
        <button onClick={onToggleNightMode} className={getClass(nightMode)}>🌙</button>
        <button onClick={onToggleBlinking} className={getClass(stopBlinking)}>
          {stopBlinking ? '▶️' : '⏸️'}
        </button>
      </div>
    </div>
  );
}

export default LayerToggle;
