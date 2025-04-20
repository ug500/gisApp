import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MunicipalitiesLayer from './MunicipalitiesLayer';
import InvasionLayer from './InvasionLayer';
import LayerToggle from './LayerToggle';
import Navbar from '../components/Navbar'; // Correct path
import LogPanel from '../components/LogPanel'; // Correct path
import HistoricalInvasionLayer from './HistoricalInvasionLayer';

import 'leaflet/dist/leaflet.css';
import axios from 'axios';
// Removed Navbar.css and LogPanel.css imports here, assuming they are imported within their components
// import '../components/Navbar.css';
// import '../components/LogPanel.css';

// Keep local municipalities for now, or switch to API fetch later
import localMunicipalities from '../municipalities.json'; // Correct path relative to MainMap.js

const center = [31.5, 34.8];
const zoom = 8;

// Accept currentUser and onLogout props
export default function MainMap({ currentUser, onLogout }) {
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showInvasion, setShowInvasion] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Added state for history toggle

  const [municipalities, setMunicipalities] = useState(null);
  const [invasionData, setInvasionData] = useState([]);

  // Load Municipalities (keep local for now)
  useEffect(() => {
    // TODO: Consider fetching from /api/municipalities if needed
    setMunicipalities(localMunicipalities);
  }, []);

  // Load Real-time Invasion Data
  useEffect(() => {
    const loadInvasion = () => {
      axios
        .get('https://invasion-api.onrender.com/api/invasion')
        .then(res => {
            // Ensure features exist and is an array
            const features = res.data?.features;
            if (Array.isArray(features)) {
                setInvasionData(features);
            } else {
                console.warn("Received invasion data is not in the expected format:", res.data);
                setInvasionData([]); // Set to empty array if format is wrong
            }
        })
        .catch(err => console.error('❌ Failed to load invasion data', err));
    };

    loadInvasion(); // Initial load
    const interval = setInterval(loadInvasion, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // --- Minor Cleanup in Rendering Logic ---
  // Removed duplicate <InvasionLayer />
  // Ensured HistoricalInvasionLayer uses the showHistory state for visibility

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Pass user info and logout handler to Navbar */}
      <Navbar
        user={currentUser}
        onLogout={onLogout}
        onToggleLog={() => setShowLog(!showLog)}
      />
      <div style={{ position: 'relative', flexGrow: 1 }}> {/* Container for map and overlays */}
        <LayerToggle
          showMunicipalities={showMunicipalities}
          setShowMunicipalities={setShowMunicipalities}
          showInvasion={showInvasion}
          setShowInvasion={setShowInvasion}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />

        <LogPanel visible={showLog} data={invasionData} />

        <MapContainer
          center={center}
          zoom={zoom}
          zoomControl={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }} // Ensure map is behind overlays if needed
        >
          <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Municipalities Layer */}
          {showMunicipalities && municipalities && (
            <MunicipalitiesLayer
              data={municipalities}
              // Only pass active invasion data if the layer is visible
              aliens={showInvasion ? invasionData : []}
            />
          )}

          {/* Current Invasion Layer */}
          {showInvasion && invasionData.length > 0 && (
            <InvasionLayer data={invasionData} />
          )}

          {/* Historical Invasion Layer */}
          {/* Pass the 'showHistory' state to the 'visible' prop */}
          {municipalities && (
             <HistoricalInvasionLayer
                visible={showHistory}
                municipalities={municipalities}
             />
          )}

        </MapContainer>
      </div>
    </div>
  );
}
