import React, { useEffect, useState } from 'react';
import { Marker, Polygon, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

const historicalLandingIcon = L.divIcon({
  html: `<div style="font-size: 22px;">🛸</div>`,
  className: 'historical-landing-icon',
  iconSize: [30, 30],
});

const historicalAlienIcon = (code) =>
  L.divIcon({
    html: `<div style="font-size: 20px;">👽<span style="color:#000;font-weight:bold;font-size:12px;">${code}</span></div>`,
    className: 'historical-alien-icon',
    iconSize: [30, 30],
  });

export default function HistoricalInvasionLayer({ visible, municipalities }) {
  const [history, setHistory] = useState([]);
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    axios
      .get('http://localhost:5000/api/history')
      .then((res) => setHistory(res.data))
      .catch((err) =>
        console.error('❌ Failed to load historical invasions:', err)
      );
  }, [visible]);

  if (!visible || !Array.isArray(history) || !municipalities) return null;

  const findPolygonByName = (name) => {
    return municipalities.features.find((feature) => {
      const polyName =
        feature.properties?.MUN_HEB ||
        feature.properties?.MUN_ENG ||
        feature.properties?.name;
      return polyName === name;
    });
  };

  return (
    <>
      {history.map((inv, idx) => (
        <React.Fragment key={idx}>
          {/* 🛸 Landing Marker */}
          {inv.landing?.coordinates && (
            <Marker
              position={[
                inv.landing.coordinates[1],
                inv.landing.coordinates[0],
              ]}
              icon={historicalLandingIcon}
            />
          )}

          {/* 🔴 Invaded + Landing Polygons */}
          {municipalities.features.map((poly, i) => {
            const polyName =
              poly.properties?.MUN_HEB ||
              poly.properties?.MUN_ENG ||
              poly.properties?.name ||
              '';

            const isLanding =
              polyName.trim().toLowerCase() ===
              inv.landing.name.trim().toLowerCase();

            const isInvaded = inv.invadedPolygons?.some((ip) =>
              [ip.name].includes(polyName)
            );

            if (!isLanding && !isInvaded) return null;

            const coordinates = poly.geometry.coordinates;
            const isMultiPolygon = poly.geometry.type === 'MultiPolygon';

            return (
              <Polygon
                key={`poly-${idx}-${i}`}
                positions={
                  isMultiPolygon
                    ? coordinates.map((poly) =>
                        poly[0].map(([lng, lat]) => [lat, lng])
                      )
                    : coordinates[0].map(([lng, lat]) => [lat, lng])
                }
                pathOptions={{
                  color: isLanding ? '#5a0000' : 'orange',
                  fillColor: isLanding ? '#8B0000' : 'red',
                  fillOpacity: isLanding ? 0.6 : 0.3,
                  weight: 2,
                }}
              />
            );
          })}

          {/* 👣 Alien Paths and Icons */}
          {(inv.alienPaths || []).map((alien, i) => {
            const positions = alien.path.map((step) => [
              step.coordinates[1],
              step.coordinates[0],
            ]);
            const last = positions[positions.length - 1];
            alien.path.forEach((step, i) => {
                if (!step.coordinates || step.coordinates.length !== 2) {
                  console.warn(`❗ Alien ${alien.alienCode} step ${i} missing coordinates`, step);
                }
              });
              
            return (
              <React.Fragment key={`alien-${i}`}>
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color: 'blue',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '6, 6',
                  }}
                />
                <Marker
                  position={last}
                  icon={historicalAlienIcon(alien.alienCode || `A${i}`)}
                />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}
