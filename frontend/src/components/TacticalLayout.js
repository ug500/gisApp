// src/components/TacticalLayout.js
import React, { useState, useEffect, useRef } from "react";
import SidePanelLeft from "./SidePanelLeft";
import SidePanelRight from "./SidePanelRight";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import MainMap from "../layers/MainMap";
import HistoricalPanel from "./HistoricalPanel";
import LayerToggle from "../layers/LayerToggle";
import NearbySheltersControl from "../layers/NearbySheltersControl";

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
  const [showNearbyShelters, setShowNearbyShelters] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [radius, setRadius] = useState(500);
  const [latestLandingCoords, setLatestLandingCoords] = useState(null);

  const [log, setLog] = useState([]);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef();

  const [invasionData, setInvasionData] = useState([]);
  const [visibleHistoricalIds, setVisibleHistoricalIds] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [nearbyShelters, setNearbyShelters] = useState([]);

  useEffect(() => {
    if (!showNearbyShelters || !latestLandingCoords) return;

    const [lat, lng] = latestLandingCoords;
    const url = `http://localhost:5000/api/shelters-nearby?lat=${lat}&lng=${lng}&radius=${radius}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNearbyShelters(data);
        } else {
          console.error('Unexpected response format:', data);
          setNearbyShelters([]);
        }
      })
      .catch(err => {
        console.error('Error fetching nearby shelters:', err);
        setNearbyShelters([]);
      });
  }, [showNearbyShelters, latestLandingCoords, radius]);

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
    const latestLanding = [...invasionData]
      .reverse()
      .find(f => f.properties?.type === 'landing');

    if (latestLanding?.geometry?.coordinates) {
      setLatestLandingCoords([
        latestLanding.geometry.coordinates[1],
        latestLanding.geometry.coordinates[0],
      ]);
    }
  }, [invasionData]);

  useEffect(() => {
    if (!invasionData || paused) return;

    const activeKeys = new Set(
      invasionData.map((f) => {
        const type = f.properties?.type;
        const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
        const coords = f.geometry?.coordinates || [];
        const hebrew = getMunicipalityName(coords[0], coords[1]);
        const location = type === 'landing'
          ? f.properties?.locationName || 'Unknown'
          : `<span class="coordinates-highlight">${coords.join(', ')}</span> in <span class="hebrew-name">${hebrew}</span>`;
        return id + location + type;
      })
    );

    const newEntries = invasionData.map((f) => {
      const type = f.properties?.type;
      const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
      const coords = f.geometry?.coordinates || [];
      const hebrew = getMunicipalityName(coords[0], coords[1]);

      const location = type === 'landing'
        ? f.properties?.locationName || 'Unknown'
        : `<span class="coordinates-highlight">${coords.join(', ')}</span> in <span class="hebrew-name">${hebrew}</span>`;

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        id: id || '?',
        location,
        type,
        time: timestamp,
        coordinates: coords
      };
    });

    setLog((prev) => {
      const deduped = [...prev, ...newEntries].filter((entry, i, arr) => {
        const key = entry.id + entry.location + entry.type;
        return arr.findIndex(e => e.id + e.location + e.type === key) === i;
      }).filter(entry => {
        const key = entry.id + entry.location + entry.type;
        return activeKeys.has(key);
      });

      return deduped.slice(-100);
    });
  }, [invasionData, paused]);

  useEffect(() => {
    if (showHistory) {
      fetch('http://localhost:5000/api/history')
        .then(res => res.json())
        .then(data => {
          setHistoryData(data || []);
          setVisibleHistoricalIds([]);
        })
        .catch(err => console.error('Error loading history:', err));
    }
  }, [showHistory]);

  const handleToggleHistorical = (id, isVisible) => {
    setVisibleHistoricalIds(prev =>
      isVisible ? [...prev, id] : prev.filter(x => x !== id)
    );
  };

  const landingCount = invasionData.filter(f => f.properties?.type === 'landing').length;
  const alienCount = invasionData.filter(f => f.properties?.type === 'alien').length;

  return (
    <div className="tactical-layout">
      <TopBar />
      <div className="tactical-center">
        <SidePanelLeft
          logItems={log}
          landings={landingCount}
          aliens={alienCount}
          paused={paused}
          setPaused={setPaused}
          clearLog={() => setLog([])}
        />

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
            showNearbyShelters={showNearbyShelters}
            showWeather={showWeather}
            nightMode={nightMode}
            visibleHistoricalIds={visibleHistoricalIds}
            radius={radius}
            setRadius={setRadius}
            latestLandingCoords={latestLandingCoords}
          />
        </div>
      </div>

      {showNearbyShelters && (
        <NearbySheltersControl
          radius={radius}
          setRadius={setRadius}
          landingCoords={latestLandingCoords}
          shelters={nearbyShelters}
        />
      )}

      {showHistory && (
        <HistoricalPanel
          historyData={historyData}
          visibleIds={visibleHistoricalIds}
          onToggle={handleToggleHistorical}
        />
      )}

      <BottomBar logItems={log} />

      <LayerToggle
        onToggleMunicipalities={() => setShowMunicipalities(!showMunicipalities)}
        onToggleLandings={() => setShowLandings(!showLandings)}
        onToggleHistory={() => {
          setShowHistory(prev => {
            if (!prev) setShowNearbyShelters(false);
            return !prev;
          });
        }}
        onToggleAliens={() => setShowAliens(!showAliens)}
        onToggleShelters={() => setShowShelters(!showShelters)}
        onToggleNearbyShelters={() => {
          setShowNearbyShelters(prev => {
            if (!prev) setShowHistory(false);
            return !prev;
          });
        }}
        onToggleWeather={() => setShowWeather(!showWeather)}
        onToggleNightMode={() => setNightMode(!nightMode)}
        showMunicipalities={showMunicipalities}
        showLandings={showLandings}
        showHistory={showHistory}
        showAliens={showAliens}
        showShelters={showShelters}
        showNearbyShelters={showNearbyShelters}
        showWeather={showWeather}
        nightMode={nightMode}
      />
    </div>
  );
};

export default TacticalLayout;
