import React, { useEffect, useState } from 'react';
import { Marker,Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const shelterIcon = L.icon({
  iconUrl: '/images/bomb_shelter_icon.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

export default function ShelterLayer({ visible }) {
  const [shelters, setShelters] = useState([]);
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    fetch('http://localhost:5000/api/shelters')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch shelters from API');
        return res.json();
      })
      .then(data => {
        console.log('Shelters fetched:', data); // ✅ DEBUG LOG
        if (Array.isArray(data)) {
          setShelters(data);
        } else {
          console.error('Unexpected shelter data format:', data);
        }
      })
      .catch(err => console.error('Failed to load shelters:', err));
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* ✅ HARD-CODED MARKER FOR VISIBILITY CHECK */}
   {/*   <Marker position={[32.0853, 34.7818]} icon={shelterIcon} />*/}

      {shelters.map((feature, idx) => {
        if (!feature.geometry?.coordinates) {
          console.warn(`Skipping invalid feature at index ${idx}`, feature);
          return null;
        }

        const coords = feature.geometry.coordinates; // [lng, lat]

        if (!Array.isArray(coords) || coords.length !== 2) {
          console.warn(`Invalid coordinates at index ${idx}:`, coords);
          return null;
        }

        return (
            <Marker
            key={`shelter-${idx}`}
            position={[coords[1], coords[0]]}
            icon={shelterIcon}
          >
            <Popup>
              <div style={{ fontSize: '14px', textAlign: 'right' }} dir="rtl">
                <strong>סוג המקלט:</strong><br />
                {feature.properties?.t_sug || 'לא ידוע'}
              </div>
            </Popup>
          </Marker>
          
        );
      })}
    </>
  );
}