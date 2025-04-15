import React from 'react';
import { Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

const alienIcon = (code) => L.divIcon({
  html: `<div style=\"font-size:24px;\">👽<span style=\"color:black; font-weight:bold; font-size:14px;\">${code}</span></div>`,
  className: 'alien-icon',
  iconSize: [30, 30]
});

const landingIcon = (label) => L.divIcon({
  html: `<div style=\"display:flex; flex-direction:column; align-items:center;\">
    <div style=\"background:black;color:white;font-size:10px;padding:1px 4px;border-radius:4px;margin-bottom:2px;\">${label}</div>
    <div style=\"font-size:28px;\">🛸</div>
  </div>`,
  className: 'landing-icon',
  iconSize: [30, 42],
  iconAnchor: [15, 21],
  popupAnchor: [0, -30]
});

export default function InvasionLayer({ data }) {
  const landings = data.filter(f => f.properties?.type === 'landing');
  const aliens = data.filter(f => f.properties?.type === 'alien');

  return (
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
  );
}

