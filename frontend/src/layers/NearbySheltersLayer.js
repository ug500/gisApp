import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';


const glowingShelterIcon = L.icon({
    iconUrl: '/images/bomb_shelter_icon_glow_bright_36x36.png',
    iconSize: [40, 40],
    iconAnchor: [18, 30], // half width, full height (bottom center)
  });
  

export default function NearbySheltersLayer({ landingCoords, radius }) {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    if (!landingCoords || !radius) return;

    const [lat, lng] = landingCoords;
    const url = `http://localhost:5000/api/shelters-nearby?lat=${lat}&lng=${lng}&radius=${radius}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setShelters(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(err => console.error('Error fetching nearby shelters:', err));
  }, [landingCoords, radius]);

  return (
    <>
      {shelters.map((feature, idx) => {
        const coords = feature.geometry?.coordinates;
        if (!coords || coords.length !== 2) return null;

        const [lng, lat] = coords;

        return (
            <Marker
            key={`near-shelter-${idx}`}
            position={[lat, lng]}
            icon={glowingShelterIcon}
            zIndexOffset={1000}
          >
            <Popup>
  <div style={{ fontSize: '14px', textAlign: 'right' }} dir="rtl">

  <strong>סוג המקלט:</strong><br />
  {feature.properties?.t_sug || 'לא ידוע'}
   <br></br>
    <strong>מרחק מהנחיתה:</strong><br />
    {feature.distance?.toFixed(0)} מטרים
   
   
  </div>
</Popup>
          </Marker>
        );
      })}
    </>
  );
}