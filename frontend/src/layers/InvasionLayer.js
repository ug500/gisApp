import React, { useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// 👽 Alien icon with code
const alienIcon = (code) =>
  L.divIcon({
    html: `<div style="font-size:24px;">👽<span style="color:black; font-weight:bold; font-size:14px;">${code}</span></div>`,
    className: 'alien-icon',
    iconSize: [30, 30]
  });

// 🛸 Landing ship icon with code
const landingIcon = (label) =>
  L.divIcon({
    html: `<div style="display:flex; flex-direction:column; align-items:center;">
      <div style="background:black;color:white;font-size:10px;padding:1px 4px;border-radius:4px;margin-bottom:2px;">${label}</div>
      <div style="font-size:28px;">🛸</div>
    </div>`,
    className: 'landing-icon',
    iconSize: [30, 42],
    iconAnchor: [15, 21],
    popupAnchor: [0, -30]
  });

export default function InvasionLayer({ data }) {
  const map = useMap();
  const [isReady, setIsReady] = useState(false);

  // ✅ Wait for map to be ready before showing markers
  useEffect(() => {
    if (!map) return;

    const timer = setTimeout(() => {
      map.invalidateSize(); // Fix potential layout bugs
      setIsReady(true);
    }, 100); // Delay allows layout to stabilize

    return () => clearTimeout(timer);
  }, [map]);

  if (!isReady) return null;

  const landings = data.filter((f) => f.properties?.type === 'landing');
  const aliens = data.filter((f) => f.properties?.type === 'alien');

  return (
    <>
      {/* 🛸 Landing markers */}
      {landings.map((l, idx) => {
        const [lng, lat] = l.geometry?.coordinates || [];

        if (typeof lat !== 'number' || typeof lng !== 'number') return null;

        return (
          <Marker
            key={`landing-${idx}`}
            position={[lat, lng]}
            icon={landingIcon(l.properties.landingCode || '?')}
          />
        );
      })}

      {/* 👽 Alien markers */}
      {aliens.map((a, idx) => {
        const id = a.properties?.alienCode || `A-${idx}`;
        const [lng, lat] = a.geometry?.coordinates || [];

        if (
          typeof lat !== 'number' ||
          typeof lng !== 'number' ||
          lat < 20 || lat > 40 ||
          lng < 30 || lng > 40
        ) {
          console.warn(`⛔ Skipping alien ${id}: Out-of-bounds [lat: ${lat}, lng: ${lng}]`);
          return null;
        }

        const stableKey = `alien-${id}-${lat.toFixed(4)}-${lng.toFixed(4)}`;

        return (
          <Marker
            key={stableKey}
            position={[lat, lng]} // ✅ lat, lng order
            icon={alienIcon(id)}
          />
        );
      })}
    </>
  );
}
