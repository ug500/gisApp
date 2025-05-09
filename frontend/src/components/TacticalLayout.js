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
import AlienStatsLayer from '../layers/AlienStatsLayer';
import Night from '../layers/Night';
import localMunicipalities from "../municipalities.json";
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

import "../App.css";
import "./TacticalLayout.css";



const supportedMunicipalities = [
  'תלאביביפו', 'בניברק', 'רמתגן', 'גבעתיים', 'רמתהשרון', 'חולון', 'בתים'
];

const normalize = name => name?.replace(/[\s־–-]+/g, '').trim();

function getInvadedStats(aliens) {
  const map = {};
  aliens.forEach(alien => {
    const coords = alien.geometry?.coordinates;
    if (!coords || coords.length !== 2) return;
    const pt = point(coords);
    const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
    const polygonName = match?.properties?.MUN_HEB || 'ללא שם';
    map[polygonName] = (map[polygonName] || 0) + 1;
  });
  return Object.entries(map).map(([polygonName, count]) => ({ polygonName, count }));
}

const TacticalLayout = ({ currentUser, onLogout }) => {
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
  const [stopBlinking, setStopBlinking] = useState(false);
  const [showAlienStatsLayer, setShowAlienStatsLayer] = useState(false);
  const [userClosedNearbyShelters, setUserClosedNearbyShelters] = useState(false);
  const [lastLandingCode, setLastLandingCode] = useState(null);
  const [log, setLog] = useState([]);
  const [paused, setPaused] = useState(false);
  
  const mapRef = useRef();

  const [invasionData, setInvasionData] = useState([]);
  const [visibleHistoricalIds, setVisibleHistoricalIds] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  
  const [muted, setMuted] = useState(false);
  const [landingAudioReady, setLandingAudioReady] = useState(false);
  const landingAudioRef = useRef(null);
  const [selectedLandingInfo, setSelectedLandingInfo] = useState(null);
  const [submitId, setSubmitId] = useState(0); 


  
    useEffect(() => {
      if (typeof Audio !== "undefined") {
        const audio = new Audio('/sounds/alien-warning.mp3');
        audio.volume = 0.7;
        audio.addEventListener("canplaythrough", () => {
          setLandingAudioReady(true);
        });
        audio.load();
        landingAudioRef.current = audio;
      }
    }, []);
  
    useEffect(() => {
      if (landingAudioRef.current) {
        landingAudioRef.current.muted = muted;
        if (muted) {
          landingAudioRef.current.pause();
        }
        // Remove auto-play logic here! 
      }
    }, [muted]);
    
  
    const playLandingSound = () => {
      if (muted || !landingAudioReady || !landingAudioRef.current) return;
    
      landingAudioRef.current.currentTime = 0;
      landingAudioRef.current.play().catch(err => {
        console.warn("Audio play failed:", err);
      });
    
      // Stop the alarm after exactly 5 seconds
      setTimeout(() => {
        if (landingAudioRef.current && !muted) {
          landingAudioRef.current.pause();
          landingAudioRef.current.currentTime = 0; // Reset to start
        }
      }, 6500); // 6500 milliseconds = 6.5 seconds
    };
    
  
  
    
  


 
  useEffect(() => {
    if (!showNearbyShelters || !latestLandingCoords) return;
    const [lat, lng] = latestLandingCoords;
    fetch(`http://localhost:5000/api/shelters-nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then(res => res.json())
      .then(data => setNearbyShelters(Array.isArray(data) ? data : []))
      .catch(() => setNearbyShelters([]));
  }, [showNearbyShelters, latestLandingCoords, radius]);

  useEffect(() => {
    const loadInvasion = () => {
      fetch('https://invasion-api.onrender.com/api/invasion')
        .then(res => res.json())
        .then(data => setInvasionData(data.features || []))
        .catch(err => console.error('Failed to load invasion data', err));
    };
    loadInvasion();
    const interval = setInterval(loadInvasion, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const latestLanding = [...invasionData].reverse().find(f => f.properties?.type === 'landing');
    if (!latestLanding?.geometry?.coordinates) return;
    const [lng, lat] = latestLanding.geometry.coordinates;

    const getMunicipalityName = (lng, lat) => {
      const pt = point([lng, lat]);
      const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
      return match?.properties?.MUN_HEB || 'לא ידוע';
    };

    const landingCode = latestLanding?.properties?.landingCode;
    const latestMunicipality = getMunicipalityName(lng, lat);
    const latestIsSupported = supportedMunicipalities.includes(normalize(latestMunicipality));
    const allSupportedLandings = invasionData.filter(f => {
      if (f.properties?.type !== 'landing') return false;
      const [lng, lat] = f.geometry?.coordinates || [];
      const name = getMunicipalityName(lng, lat);
      return supportedMunicipalities.includes(normalize(name));
    });

    if (landingCode && landingCode !== lastLandingCode) {
      playLandingSound();
      setLastLandingCode(landingCode);
      if (latestIsSupported) {
        setLatestLandingCoords([lat, lng]);
        if (!userClosedNearbyShelters) setShowNearbyShelters(true);
      } else if (allSupportedLandings.length > 0) {
        const lastSupported = allSupportedLandings.at(-1);
        const [lng2, lat2] = lastSupported.geometry.coordinates;
        setLatestLandingCoords([lat2, lng2]);
      } else {
        setLatestLandingCoords(null);
        setShowNearbyShelters(false);
      }
    }
  }, [invasionData, lastLandingCode, userClosedNearbyShelters]);
  
  
  
  useEffect(() => {
    if (!invasionData || paused) return;

    const getMunicipalityName = (lng, lat) => {
      const pt = point([lng, lat]);
      const match = localMunicipalities.features.find(f => booleanPointInPolygon(pt, f));
      return match?.properties?.MUN_HEB || 'Unknown Area';
    };

    const activeKeys = new Set(invasionData.map(f => {
      const type = f.properties?.type;
      const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
      const coords = f.geometry?.coordinates || [];
      const hebrew = getMunicipalityName(coords[0], coords[1]);
      const location = type === 'landing'
        ? f.properties?.locationName || 'Unknown'
        : `<span class="coordinates-highlight">${coords.join(', ')}</span> ב-<span class="hebrew-name">${hebrew}</span>`;
      return id + location + type;
    }));

    const newEntries = invasionData.map(f => {
      const type = f.properties?.type;
      const id = type === 'landing' ? f.properties?.landingCode : f.properties?.alienCode;
      const coords = f.geometry?.coordinates || [];
      const hebrew = getMunicipalityName(coords[0], coords[1]);
      const location = type === 'landing'
        ? f.properties?.locationName || 'Unknown'
        : `<span class="coordinates-highlight">${coords.join(', ')}</span> ב-<span class="hebrew-name">${hebrew}</span>`;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { id, location, type, time: timestamp, coordinates: coords };
    });

    setLog(prev => {
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

  const aliens = invasionData.filter(f => f.properties?.type === 'alien');
  const landings = invasionData.filter(f => f.properties?.type === 'landing');
  
  return (
    <div className="tactical-layout">
      <TopBar currentUser={currentUser} onLogout={onLogout} />
      <div className="tactical-center">
        <SidePanelLeft
          logItems={log}
          landings={landings.length}
          aliens={aliens.length}
          paused={paused}
          setPaused={setPaused}
          clearLog={() => setLog([])}
          muted={muted}
          setMuted={setMuted}
        />
        <Night active={nightMode} />
  
       
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
        {showAlienStatsLayer && (
          <AlienStatsLayer
            aliens={aliens}
            landings={landings}
            invadedStats={getInvadedStats(aliens)}
          />
        )}

        
        <div className="map-container"  style={{ height: "100vh", width: "100%" }}>
          
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
  stopBlinking={stopBlinking}
  
  // ✅ Add this new prop to receive the mapRef
  
   selectedLandingInfo={selectedLandingInfo}
   
   mapRef={mapRef}
   submitId={submitId} 
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
          onToggle={id => setVisibleHistoricalIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
          )}
        />
      )}
       <BottomBar
        logItems={log}
        onLandingSelected={(landingInfo) => {
          console.log("TacticalLayout received landingInfo:", landingInfo);
          setSelectedLandingInfo(landingInfo);
          setSubmitId(prev => prev + 1); // ✅ Increment trigger
        }}
      />






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
          const supportedLandingExists = invasionData.some(f => {
            if (f.properties?.type !== 'landing') return false;
            const [lng, lat] = f.geometry?.coordinates || [];
            const name = point([lng, lat]);
            const match = localMunicipalities.features.find(f => booleanPointInPolygon(name, f));
            const norm = match?.properties?.MUN_HEB?.replace(/[\s־–-]+/g, '').trim();
            return ['תלאביביפו', 'בניברק', 'רמתגן','חולון','בתים','גבעתיים','רמתהשרון'].includes(norm);
          });
        
          if (!supportedLandingExists) {
            // Still let the panel open but show warning inside
            setLatestLandingCoords(null);
          }
        
          setUserClosedNearbyShelters(true);
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
        onToggleBlinking={() => setStopBlinking(prev => !prev)}
        stopBlinking={stopBlinking}
        onToggleAlienStats={() => setShowAlienStatsLayer(prev => !prev)}
        showAlienStatsLayer={showAlienStatsLayer}
      />
    </div>
  );
};

export default TacticalLayout;