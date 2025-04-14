import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const createEmojiIcon = (emoji, label, isLanding = false) =>
  L.divIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        ${
          isLanding
            ? `<div style="
                background-color: black;
                color: white;
                padding: 1px 4px;
                border-radius: 4px;
                font-size: 10px;
                margin-bottom: 2px;
                white-space: nowrap;
              ">${label}</div>`
            : ''
        }
        <div style="font-size: 24px;">${emoji}</div>
        ${
          !isLanding
            ? `<div style="
                background-color: transparent;
                color: black;
                padding: 1px 4px;
                font-size: 12px;
                margin-top: -6px;
                white-space: nowrap;
              ">${label}</div>`
            : ''
        }
      </div>
    `,
    className: 'emoji-icon',
    iconSize: [30, 42],
    iconAnchor: [15, 21],
    popupAnchor: [0, -30],
  });




const ResourceMap = () => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('http://localhost:9000/api/invasion') // או '/api/invasion' אם יש proxy
        .then((res) => setFeatures(res.data.features || []))
        .catch((err) => console.error('Failed to fetch data:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[31.6, 34.77]}
      zoom={11}
      style={{ height: '800px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {features.map((feature, idx) => {
        const { type, locationName, landingCode, alienCode } = feature.properties;
        const coords = feature.geometry.coordinates;
        const position = [coords[1], coords[0]];

        if (type === 'landing') {
          return (
            <Marker
              key={`landing-${idx}`}
              position={position}
              icon={createEmojiIcon('🛸', `${locationName} (${landingCode})`, true)}
            >
              <Popup>
                <b>Landing</b><br />
                {locationName} - {landingCode}
              </Popup>
            </Marker>
          );
        }

        if (type === 'alien') {
          return (
            <Marker
              key={`alien-${idx}`}
              position={position}
              icon={createEmojiIcon('👽', alienCode)}
            >
              <Popup>
                <b>Alien</b><br />
                Code: {alienCode}
              </Popup>
            </Marker>
          );
        }

        return null;
      })}
    </MapContainer>
  );
};

export default ResourceMap;
