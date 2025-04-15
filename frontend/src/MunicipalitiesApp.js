import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import MunicipalitiesMap from './MunicipalitiesMap';

const center = [31.5, 34.8];
const initialZoom = 8;
const API_BASE = "https://invasion-api.onrender.com";

const alienIcon = (code) => L.divIcon({
  html: `<div style="font-size:24px;">👽<span style="color:black; font-weight:bold; font-size:14px;">${code}</span></div>`,
  className: 'alien-icon',
  iconSize: [30, 30]
});

const landingIcon = (label) => L.divIcon({
  html: `<div style="display:flex; flex-direction:column; align-items:center;">
    <div style="background:black;color:white;font-size:10px;padding:1px 4px;border-radius:4px;margin-bottom:2px;">${label}</div>
    <div style="font-size:28px;">🛸</div>
  </div>`,
  className: 'landing-icon',
  iconSize: [30, 42],
  iconAnchor: [15, 21],
  popupAnchor: [0, -30]
});

function ForceResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
}

const MunicipalitiesApp = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [invasionData, setInvasionData] = useState([]);
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showInvasion, setShowInvasion] = useState(true);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/municipalities");
        setMunicipalities(res.data);
      } catch (err) {
        console.error("Error fetching municipalities:", err);
      }
    };

    const fetchInvasion = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/invasion`);
        setInvasionData(res.data.features);
      } catch (err) {
        console.error("Error fetching invasion data:", err);
      }
    };

    fetchMunicipalities();
    fetchInvasion();
    const interval = setInterval(fetchInvasion, 2000);
    return () => clearInterval(interval);
  }, []);

  const landings = invasionData.filter(f => f.properties?.type === 'landing');
  const aliens = invasionData.filter(f => f.properties?.type === 'alien');

  return (
    <div className="App" style={{ height: '100vh', width: '100vw' }}>
      <header style={{ padding: '10px', background: 'black', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h2>gisApp – חייזרים ורשויות</h2>
        <div>
          <button onClick={() => setShowMunicipalities(!showMunicipalities)}>
            Municipalities {showMunicipalities ? '🔽' : '▶️'}
          </button>
          <button onClick={() => setShowInvasion(!showInvasion)} style={{ marginLeft: '10px' }}>
            INVASION {showInvasion ? '🛸' : '▶️'}
          </button>
        </div>
      </header>
      <main style={{ height: 'calc(100% - 50px)', width: '100%' }}>
        <MapContainer center={center} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
          <ForceResize />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {showMunicipalities && (
            <MunicipalitiesMap municipalities={municipalities} />
          )}

          {showInvasion && (
            <>
              {landings.map((l, idx) => (
                <Marker
                  key={`landing-${idx}`}
                  position={[l.geometry.coordinates[1], l.geometry.coordinates[0]]}
                  icon={landingIcon(l.properties.landingCode || '?')}
                />
              ))}
              {aliens.map((a, idx) => (
                <Marker
                  key={`alien-${idx}`}
                  position={[a.geometry.coordinates[1], a.geometry.coordinates[0]]}
                  icon={alienIcon(a.properties.alienCode || '?')}
                />
              ))}
            </>
          )}
        </MapContainer>
      </main>
    </div>
  );
};

export default MunicipalitiesApp;
