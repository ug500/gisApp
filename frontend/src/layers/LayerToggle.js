import React from 'react';

function LayerToggle({
  onToggleLandings,
  onToggleAliens,
  onToggleShelters,
  onToggleWeather,
  onToggleNightMode,
}) {
  const buttonStyle = {
    fontSize: '24px',
    padding: '10px',
    marginBottom: '8px',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', right: 10, top: 50, zIndex: 1000 }}>
      <button onClick={onToggleLandings} style={buttonStyle}>🛸</button>
      <button onClick={onToggleAliens} style={buttonStyle}>👽</button>
      <button onClick={onToggleShelters} style={buttonStyle}>🛖</button>
      <button onClick={onToggleWeather} style={buttonStyle}>🌦</button>
      <button style={buttonStyle}>🔲</button> {/* שמור לעתיד */}
      <button onClick={onToggleNightMode} style={buttonStyle}>🌙</button>
    </div>
  );
}

export default LayerToggle;
