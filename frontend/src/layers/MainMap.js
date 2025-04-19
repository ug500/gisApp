// 📁 src/layers/MainMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MunicipalitiesLayer from './MunicipalitiesLayer';
import InvasionLayer from './InvasionLayer';
import HistoricalInvasionLayer from './HistoricalInvasionLayer';
import LogPanel from '../components/LogPanel';
import localMunicipalities from '../data/municipalities.json';


const MainMap = () => {
  const [showMunicipalities, setShowMunicipalities] = useState(true);
  const [showInvasion, setShowInvasion] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [invasionData, setInvasionData] = useState([]);
  const [municipalities, setMunicipalities] = useState(localMunicipalities);

  useEffect(() => {
    const fetchInvasion = () => {
      fetch('https://invasion-api.onrender.com/api/invasion')
        .then(res => res.json())
        .then(data => setInvasionData(data.features || []))
        .catch(err => console.error('Error loading invasion data', err));
    };

    fetchInvasion();
    const interval = setInterval(fetchInvasion, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
  

      <LogPanel visible={showLog} data={invasionData} />

      <MapContainer center={[31.7683, 35.2137]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showMunicipalities && municipalities && (
          <MunicipalitiesLayer data={municipalities} aliens={invasionData} />
        )}
        {showInvasion && <InvasionLayer data={invasionData} />}
        {showHistory && <HistoricalInvasionLayer />}
      </MapContainer>
    </div>
  );
};

export default MainMap;
