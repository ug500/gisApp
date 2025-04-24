// src/components/SidePanelLeft.js
import React, { useState, useEffect } from "react";
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

const SidePanelLeft = ({ logItems = [], landings = 0, aliens = 0, paused, setPaused, clearLog,muted,setMuted }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAllBanners, setShowAllBanners] = useState(false);
  const [bannerTimestamps, setBannerTimestamps] = useState({});

  useEffect(() => {
    const updated = { ...bannerTimestamps };

    logItems.forEach(item => {
      const [lng, lat] = item.coordinates || [];
      const name = getMunicipalityName(lng, lat);
      if (item.type === 'landing' && !updated[`landing-${name}`]) {
        updated[`landing-${name}`] = Date.now();
      }
      if (item.type === 'alien' && !updated[`invade-${name}`]) {
        updated[`invade-${name}`] = Date.now();
      }
    });

    setBannerTimestamps(updated);
  }, [logItems]);

  const isBannerNew = (key) => {
    const ts = bannerTimestamps[key];
    return ts && Date.now() - ts < 30000;
  };

  const handleSave = async () => {
    try {
      const now = new Date();
      const resAPI = await fetch("https://invasion-api.onrender.com/api/invasion");
      const dataAPI = await resAPI.json();
      const liveAliens = dataAPI.features.filter(f => f.properties?.type === 'alien');
      const activeAlienCodes = new Set(liveAliens.map(f => f.properties?.alienCode));
      const alienLandingMap = {};
      liveAliens.forEach(f => {
        alienLandingMap[f.properties?.alienCode] = f.properties?.landingId;
      });

      const allLandings = logItems.filter(item => item.type === 'landing' && item.coordinates);
      const allAliens = logItems.filter(item =>
        item.type === 'alien' &&
        item.coordinates &&
        activeAlienCodes.has(item.id)
      );

      if (allLandings.length === 0 || allAliens.length === 0) {
        alert("❌ לא ניתן לשמור - נדרשת לפחות נחיתה אחת ולפחות חייזר אחד חי.");
        return;
      }

      for (const landing of allLandings) {
        const landingIdFromAPI = dataAPI.features.find(f =>
          f.properties?.type === 'landing' &&
          f.geometry?.coordinates[0] === landing.coordinates[0] &&
          f.geometry?.coordinates[1] === landing.coordinates[1]
        )?.properties?.id;

        if (!landingIdFromAPI) continue;

        const landingAliens = allAliens.filter(a => alienLandingMap[a.id] === landingIdFromAPI);
        if (landingAliens.length === 0) continue;

        const [lng, lat] = landing.coordinates;
        const landingName = getMunicipalityName(lng, lat);

        const invadedMap = {};
        const alienPaths = landingAliens.map(entry => {
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
            path: [
              { coordinates: [lng, lat], enteredAt: now },
              { coordinates: [ax, ay], enteredAt: now }
            ]
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

        if (!res.ok) {
          const error = await res.json();
          console.error(error);
          alert(`❌ שגיאה בשמירה של ${landingName}`);
        } else {
          console.log(`✅ הפלישה של ${landingName} נשמרה למסד`);
        }
      }

      alert("✅ כל הפלישות נשמרו למסד");
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


  const landingGroups = logItems
    .filter(item => item.type === 'landing')
    .map(item => {
      const [lng, lat] = item.coordinates || [];
      return getMunicipalityName(lng, lat);
    })
    .filter((name, index, self) => self.indexOf(name) === index);

  const invadedGroups = logItems
    .filter(item => item.type === 'alien')
    .reduce((acc, curr) => {
      const [lng, lat] = curr.coordinates || [];
      const name = getMunicipalityName(lng, lat);
      if (!acc.find(e => e.name === name)) acc.push({ name });
      return acc;
    }, []);

  const recentInvadedNames = invadedGroups.slice(0, 3).map(e => e.name);

  const newInvadeBanners = invadedGroups.filter(e => isBannerNew(`invade-${e.name}`));
  const olderInvadeBanners = invadedGroups.filter(e => !isBannerNew(`invade-${e.name}`));

  const visibleBanners = showAllBanners
    ? [...newInvadeBanners, ...olderInvadeBanners]
    : [...newInvadeBanners, ...olderInvadeBanners.slice(0, 7 - newInvadeBanners.length)];

  return (
    <div className="side-panel-left">
     <div className="title-wrapper">
        <div className="divider" />
        <div className="log-title">INVADERS LOG</div>
        <div className="divider" />
</div>

      <div className="status-alert-wrapper">
  <div className="alert-lights horizontal">
    <div className={redClass} />
    <div className={orangeClass} />
    <div className={yellowClass} />
  </div>

  <div className="status-counts">
    <span className="count">{landings}</span>
    <span>🛸 : 👽</span>
    <span className="count">{aliens}</span>
  </div>

  <button className="mute-button" onClick={() => setMuted(prev => !prev)}>
    {muted ? '🔇' : '🔊'}
  </button>
</div>


      <div className="collapse-toggle-wrapper">
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▼' : '▲'}
        </button>
      </div>

      <div className="log-banners">
        {landingGroups.map(name => {
          const key = `landing-${name}`;
          return (
            <div key={key} className="log-alert-banner landed-glow">
              <div className="banner-left">
                <span className="log-icon-wrapper"><span className="ship-icon-inner">🛸</span></span>
                <span className="log-message">Landed in</span>{" "}
                <span className="hebrew-name">{name === 'Unknown Area' ? 'לא ידוע' : name}</span>

              </div>
              {isBannerNew(key) && <span className="new-badge flicker">NEW</span>}
            </div>
          );
        })}
        
       



        {visibleBanners.map(entry => {
          const key = `invade-${entry.name}`;
          const formatHebrewName = (name) => {
            return name?.trim() === 'Unknown Area' ? 'לא ידוע' : name;
         };
          return (
            <div key={key} className="log-alert-banner invaded-glow">
              <div className="banner-left">
                <span className="log-icon-wrapper"><span className="alien-icon-inner">👽</span></span>
                <span className="log-message">Aliens invade</span>{" "}
                <span className="hebrew-name">{formatHebrewName(entry.name)}</span>


              </div>
              {isBannerNew(key) && <span className="new-badge flicker">NEW</span>}
            </div>
          );
        })}

        {invadedGroups.length > 7 && (
          <div className="banners-toggle-wrapper">
            <button className="collapse-button" onClick={() => setShowAllBanners(!showAllBanners)}>
              {showAllBanners ? '▲ Hide Extra Banners' : `▼ Show All (${invadedGroups.length})`}
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="left-log-controls">
            {renderButton(paused ? 'Resume' : 'Pause', () => setPaused(!paused))}
            {renderButton('Clear', clearLog)}
            {renderButton('Save Log', handleSave)}
          </div>

          <div className="log-area">
            {logItems
              .filter(item => item.type === 'alien')
              .map((entry, index) => (
                <div key={`log-entry-${index}`} className="log-entry alien">
                  <span className="log-time">[{entry.time}]</span>{" "}
                  <span className="alien-icon"><span className="alien-icon-inner">👽</span></span>
                  <strong>{entry.id}</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: entry.location }} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SidePanelLeft;