import React, { useEffect, useRef, useState } from 'react';
import './LogPanel.css';
import localMunicipalities from '../municipalities.json';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

const getMunicipalityName = (lng, lat) => {
  const pt = point([lng, lat]);
  const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
  return match?.properties?.MUN_HEB || 'Unknown Area';
};

const LogPanel = ({ visible, data }) => {
  const [log, setLog] = useState([]);
  const [paused, setPaused] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [landingNames, setLandingNames] = useState([]);
  const [invadedNames, setInvadedNames] = useState([]);
  const panelRef = useRef();

  useEffect(() => {
    if (!data || paused) return;

    const landings = data.filter(f => f.properties?.type === 'landing');
    const aliens = data.filter(f => f.properties?.type === 'alien');

    const currentLandingPolygons = landings.map(f => getMunicipalityName(f.geometry.coordinates[0], f.geometry.coordinates[1]));
    const currentInvadedPolygons = aliens
      .map(f => getMunicipalityName(f.geometry.coordinates[0], f.geometry.coordinates[1]))
      .filter(name => !currentLandingPolygons.includes(name));

    setLandingNames([...new Set(currentLandingPolygons)]);
    setInvadedNames([...new Set(currentInvadedPolygons)]);

    const newEntries = data.map((f) => {
      const type = f.properties?.type;
      const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
      const coords = f.geometry?.coordinates || [];
      const hebrew = getMunicipalityName(coords[0], coords[1]);

      const location = type === 'landing'
        ? f.properties?.locationName || 'Unknown'
        : `${coords.join(', ')} in <span class=\"hebrew-name\">${hebrew}</span>`;

      const timestamp = new Date().toLocaleTimeString();
      return {
        id: id || '?',
        location,
        type,
        time: timestamp
      };
    });

    setLog((prev) => {
      const combined = [...prev, ...newEntries];
      const seen = new Set();
      const deduped = combined.filter((entry) => {
        const key = entry.id + entry.location + entry.type;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return deduped.slice(-100);
    });
  }, [data, paused]);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [log]);

  if (!visible) return null;

  return (
    <div className={`log-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="log-header">
        <h3>📋 Invasion Log</h3>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▼ Expand' : '▲ Collapse'}
        </button>
      </div>

    {/* 🔴 Glowing banners */}
{(landingNames.length > 0 || invadedNames.length > 0) && (
  <div className="log-landing-static">
    {landingNames.map((name, idx) => (
      <div className="log-landing-banner fuzzy-glow" key={`landing-banner-${idx}`}>
        <span className="ship-icon"><span className="ship-icon-inner">🛸</span></span>
        Landed in <span className="hebrew-name">{name}</span>
      </div>
    ))}
    {invadedNames.map((name, idx) => (
      <div className="log-landing-banner fuzzy-glow" key={`invade-banner-${idx}`}>
        <span className="alien-icon"><span className="alien-icon-inner">👽</span></span>
        Aliens invade <span className="hebrew-name">{name}</span>
      </div>
    ))}
  </div>
)}


      {!collapsed && (
        <>
          <div className="log-controls">
            <button onClick={() => setPaused(!paused)}>{paused ? '▶️ Resume' : '⏸️ Pause'}</button>
            <button onClick={() => setLog([])}>🗑️ Clear</button>
          </div>
          <div className="log-content" ref={panelRef}>
            {log.map((entry, idx) => (
              <div
                key={`log-entry-${idx}`}
                className={`log-entry ${entry.type}`}
              >
                <span className="log-time">[{entry.time}]</span>{' '}
                {entry.type === 'landing' ? '🛸' : '👽'} <strong>{entry.id}</strong> → <span dangerouslySetInnerHTML={{ __html: entry.location }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LogPanel;
