// src/components/SidePanelLeft.js
import React from "react";
import "./SidePanelLeft.css";
import "../components/LogPanel.css";
import localMunicipalities from '../municipalities.json';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import axios from 'axios';

const getMunicipalityName = (lng, lat) => {
  const pt = point([lng, lat]);
  const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
  return match?.properties?.MUN_HEB || 'Unknown Area';
};

const SidePanelLeft = ({ logItems = [], landings = 0, aliens = 0, paused, setPaused, clearLog }) => {

  const handleSave = async () => {
    try {
      const now = new Date();
  
      const landingEntry = logItems.find((item) => item.type === 'landing' && item.coordinates);
      const alienEntries = logItems.filter((item) => item.type === 'alien' && item.coordinates);
  
      if (!landingEntry || alienEntries.length === 0) {
        alert("לא ניתן לשמור - נדרשת נחיתה ולפחות חייזר אחד.");
        return;
      }
  
      const [lng, lat] = landingEntry.coordinates;
      const landingName = getMunicipalityName(lng, lat);
  
      const invadedMap = {};
      const alienPaths = alienEntries.map((entry) => {
        const [ax, ay] = entry.coordinates;
        const polyName = getMunicipalityName(ax, ay);
  
        if (!invadedMap[polyName]) {
          invadedMap[polyName] = {
            name: polyName,
            polygonId: polyName,
            count: 0,
            invadedAt: now.toISOString()
          };
        }
        invadedMap[polyName].count++;
  
        return {
          alienCode: entry.id,
          path: [{
            coordinates: [lng, lat],
            enteredAt: now
          }, {
            coordinates: [ax, ay],
            enteredAt: now
          }]
        };
      });
  
      const payload = {
        landing: {
          polygonId: landingName,
          name: landingName,
          coordinates: [lng, lat],
          timestamp: now
        },
        invadedPolygons: Object.values(invadedMap),
        alienPaths
      };
  
      const res = await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (res.ok) {
        alert('✅ הפלישה נשמרה למסד');
      } else {
        const error = await res.json();
        console.error(error);
        alert('❌ שגיאה בשמירה למסד');
      }
    } catch (err) {
      console.error(err);
      alert('❌ שגיאה כללית בשמירה');
    }
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
        {logItems
          .filter(item => item.type === 'landing')
          .map((entry, index) => (
            <div key={`landing-${index}`} className="log-entry landing">
              <span className="log-time">[{entry.time}]</span>{" "}
              🛸 <strong>{entry.id}</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: entry.location }} />
            </div>
        ))}

        {logItems
          .filter(item => item.type !== 'landing')
          .map((entry, index) => (
            <div key={`entry-${index}`} className={`log-entry ${entry.type}`}>
              <span className="log-time">[{entry.time}]</span>{" "}
              {entry.type === "alien" ? "👽" : "❓"} <strong>{entry.id}</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: entry.location }} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanelLeft;