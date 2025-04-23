// src/layers/MainMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MunicipalitiesLayer from './MunicipalitiesLayer';
import InvasionLayer from './InvasionLayer';
import HistoricalInvasionLayer from './HistoricalInvasionLayer';
import ShelterLayer from './ShelterLayer';
import NearbySheltersLayer from './NearbySheltersLayer';

import localMunicipalities from '../municipalities.json';
import axios from 'axios';

const center = [32.08, 34.78];
const zoom = 13;

export default function MainMap({
  showMunicipalities,
  showLandings,
  showHistory,
  showAliens,
  showShelters,
  showNearbyShelters,
  nightMode,
  visibleHistoricalIds,
  radius,
  latestLandingCoords
}) {
  const [municipalities, setMunicipalities] = useState(null);
  const [invasionData, setInvasionData] = useState([]);

  useEffect(() => {
    setMunicipalities(localMunicipalities);
  }, []);

  useEffect(() => {
    const loadInvasion = () => {
      axios
        .get('https://invasion-api.onrender.com/api/invasion')
        .then(res => {
          const newFeatures = res.data.features;
          if (JSON.stringify(newFeatures) !== JSON.stringify(invasionData)) {
            setInvasionData(newFeatures);
          }
        })
        .catch(err => console.error('Failed to load invasion data', err));
    };

    loadInvasion();
    const interval = setInterval(loadInvasion, 1000);
    return () => clearInterval(interval);
  }, [invasionData]);

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
          visibleIds={visibleHistoricalIds}
        />
      )}

      {showShelters && <ShelterLayer visible={true} />}

      {showNearbyShelters && latestLandingCoords && (
        <>
          <Circle
            center={latestLandingCoords}
            radius={radius}
            pathOptions={{ color: 'yellow', fillOpacity: 0.2 }}
          />
          <NearbySheltersLayer
            landingCoords={latestLandingCoords}
            radius={radius}
          />
        </>
      )}
    </MapContainer>
  );
}
