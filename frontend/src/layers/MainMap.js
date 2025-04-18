import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MunicipalitiesLayer from './MunicipalitiesLayer';
import InvasionLayer from './InvasionLayer';
import LayerToggle from './LayerToggle';
import Navbar from '../components/Navbar';
import LogPanel from '../components/LogPanel';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../components/Navbar.css';
import '../components/LogPanel.css';

import localMunicipalities from '../municipalities.json';

const center = [31.5, 34.8];
const zoom = 8;

export default function MainMap() {
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showInvasion, setShowInvasion] = useState(true);
  const [showLog, setShowLog] = useState(false);

  const [municipalities, setMunicipalities] = useState(null);
  const [invasionData, setInvasionData] = useState([]);

  useEffect(() => {
    setMunicipalities(localMunicipalities);
  }, []);

  useEffect(() => {
    const loadInvasion = () => {
      axios
        .get('https://invasion-api.onrender.com/api/invasion')
        .then(res => setInvasionData(res.data.features))
        .catch(err => console.error('Failed to load invasion data', err));
    };

    loadInvasion();
    const interval = setInterval(loadInvasion, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <Navbar onToggleLog={() => setShowLog(!showLog)} />
      <LayerToggle
        showMunicipalities={showMunicipalities}
        setShowMunicipalities={setShowMunicipalities}
        showInvasion={showInvasion}
        setShowInvasion={setShowInvasion}
      />
      <LogPanel visible={showLog} data={invasionData} />
      
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showMunicipalities && municipalities && (
          <MunicipalitiesLayer data={municipalities} aliens={invasionData} />
        )}
        {showInvasion && invasionData.length > 0 && (
          <InvasionLayer data={invasionData} />
        )}
      </MapContainer>
    </div>
  );
}
