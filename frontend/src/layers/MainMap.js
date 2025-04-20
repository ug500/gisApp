import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MunicipalitiesLayer from './MunicipalitiesLayer';
import InvasionLayer from './InvasionLayer';
import HistoricalInvasionLayer from './HistoricalInvasionLayer';
import localMunicipalities from '../municipalities.json';

const center = [31.5, 34.8];
const zoom = 8;

export default function MainMap({
  showMunicipalities,
  showLandings,
  showHistory,
}) {
  const [municipalities, setMunicipalities] = useState(null);
  const [invasionData, setInvasionData] = useState([]);

  useEffect(() => {
    setMunicipalities(localMunicipalities);
  }, []);

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

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {showMunicipalities && municipalities && (
        <MunicipalitiesLayer
          data={municipalities}
          aliens={showLandings ? invasionData : []}
        />
      )}

      {showLandings && invasionData.length > 0 && (
        <InvasionLayer data={invasionData} />
      )}

      {showHistory && municipalities && (
        <HistoricalInvasionLayer
          visible={true}
          municipalities={municipalities}
        />
      )}
    </MapContainer>
  );
}
