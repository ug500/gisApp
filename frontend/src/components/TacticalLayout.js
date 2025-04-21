// 📁 src/components/TacticalLayout.js
import React, { useState, useEffect, useRef } from "react";
import SidePanelLeft from "./SidePanelLeft";
import SidePanelRight from "./SidePanelRight";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import MainMap from "../layers/MainMap";
import localMunicipalities from "../municipalities.json";
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import "../App.css";
import "./TacticalLayout.css";

const getMunicipalityName = (lng, lat) => {
  const pt = point([lng, lat]);
  const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
  return match?.properties?.MUN_HEB || 'Unknown Area';
};

const TacticalLayout = () => {
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showLandings, setShowLandings] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showAliens, setShowAliens] = useState(true);
  const [showShelters, setShowShelters] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  const [log, setLog] = useState([]);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef();

  const [invasionData, setInvasionData] = useState([]);

  useEffect(() => {
    const loadInvasion = () => {
      fetch('https://invasion-api.onrender.com/api/invasion')
        .then((res) => res.json())
        .then((data) => setInvasionData(data.features || []))
        .catch((err) => console.error('Failed to load invasion data', err));
    };

    loadInvasion();
    const interval = setInterval(loadInvasion, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!invasionData || paused) return;

    const newEntries = invasionData.map((f) => {
      const type = f.properties?.type;
      const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
      const coords = f.geometry?.coordinates || [];
      const hebrew = getMunicipalityName(coords[0], coords[1]);

      const location = type === 'landing'
        ? f.properties?.locationName || 'Unknown'
        : `<span class="coordinates-highlight">${coords.join(', ')}</span> in <span class="hebrew-name">${hebrew}</span>`;

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
  }, [invasionData, paused]);

  const landingCount = invasionData.filter(f => f.properties?.type === 'landing').length;
  const alienCount = invasionData.filter(f => f.properties?.type === 'alien').length;

  return (
    <div className="tactical-layout">
      <TopBar />
      <div className="tactical-center">
        <SidePanelLeft logItems={log} landings={landingCount} aliens={alienCount} />
        <SidePanelRight
          showMunicipalities={showMunicipalities}
          setShowMunicipalities={setShowMunicipalities}
          showLandings={showLandings}
          setShowLandings={setShowLandings}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          showAliens={showAliens}
          setShowAliens={setShowAliens}
          showShelters={showShelters}
          setShowShelters={setShowShelters}
          showWeather={showWeather}
          setShowWeather={setShowWeather}
          nightMode={nightMode}
          setNightMode={setNightMode}
        />
        <div className="map-container">
          <MainMap
            showMunicipalities={showMunicipalities}
            showLandings={showLandings}
            showHistory={showHistory}
            showAliens={showAliens}
            showShelters={showShelters}
            showWeather={showWeather}
            nightMode={nightMode}
          />
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default TacticalLayout;
