import React from 'react';
import './AlienStatsLayer.css';

function AlienStatsLayer({ aliens = [], landings = [], invadedStats = [] }) {
  return (
    <div className="panel-right-layer">
      <h3>נתוני פלישות 👾</h3>
      <br />
      <ul className="alien-scroll-container">
        <li><strong>נחיתות:</strong> {landings.length}</li>
        <li><strong>מספר חייזרים כולל:</strong> {aliens.length}</li>
        {invadedStats.map(({ polygonName, count }) => (
          <li key={polygonName}>
            {polygonName}: {count} חייזרים
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlienStatsLayer;
