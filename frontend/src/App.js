import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import polyline from 'polyline';
import L from 'leaflet';
import kfarSabaPolygon from './kfar-saba.json';
import raananaPolygon from './raanana.json'; // Import the Raanana polygon data
import './App.css'; // Import CSS for styling
import warningSound from './alien-warning.mp3'; // Import the sound file (adjust path as needed)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const center = [31.5, 34.8];
const initialZoom = 10; // Initial zoom level
const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://invasion-api.onrender.com";

const ClickHandler = ({ setLanding }) => {
  useMapEvents({ click: (e) => setLanding(e.latlng) });
  return null;
};

const alienIcon = (number) => L.divIcon({ html: `<div style="font-size:24px;">👽<span style="color:black; font-weight:bold; font-size:14px;">${number}</span></div>`, className: 'alien-icon', iconSize: [30, 30] });
const landingIcon = L.divIcon({ html: '<div style="font-size:28px;">🛸</div>', className: 'landing-icon', iconSize: [30, 30] });

function isPointInPolygon(point, polygon) {
  let x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0],
      yi = polygon[i][1];
    let xj = polygon[j][0],
      yj = polygon[j][1];
    let intersect = ((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const WarningCard = ({ message }) => (
  <div className="warning-card">
    <div dangerouslySetInnerHTML={{ __html: `⚠️ ${message}` }} />
  </div>
);

export default function App() {
  const [landing, setLanding] = useState(null);
  const [aliens, setAliens] = useState([]);
  const [warnings, setWarnings] = useState([]); // State for warnings
  const mapRef = useRef(null);
  const kfarSabaPolygonLayer = useRef(null); // Ref for Kfar Saba polygon
  const raananaPolygonLayer = useRef(null); // New ref for Raanana polygon
  const lastWarningTimes = useRef({}); // Use useRef for persistent warning times
  const warningSoundRef = useRef(new Audio(warningSound)); // Create an audio element
  const [kfarSabaBlinking, setKfarSabaBlinking] = useState(false);
  const [raananaBlinking, setRaananaBlinking] = useState(false);
  const [kfarSabaIsInvaded, setKfarSabaIsInvaded] = useState(false);
  const [raananaIsInvaded, setRaananaIsInvaded] = useState(false);
  const initialBoundsSet = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const blinkIntervalRef = useRef(null); // Ref to hold the interval ID
  const hasZoomedOut = useRef(false); // Ref to track if initial zoom out has occurred

  useEffect(() => {
    warningSoundRef.current.muted = isMuted;
    warningSoundRef.current.volume = volume;
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getRoute = async (from, to) => {
    const res = await axios.get(`${API_BASE}/api/route?fromLat=${from[0]}&fromLng=${from[1]}&toLat=${to[0]}&toLng=${to[1]}`);
    return polyline.decode(res.data.routes[0].geometry).map(coord => [coord[0], coord[1]]);
  };

  useEffect(() => {
    if (!landing) return;

    const createAliens = async () => {
      const directions = [0, 45, 90, 135, 180, 225, 270, 315];
      const alienPromises = directions.map(async (angle) => {
        const rad = angle * (Math.PI / 180);
        const target = [landing.lat + 0.05 * Math.cos(rad), landing.lng + 0.05 * Math.sin(rad)];
        const route = await getRoute([landing.lat, landing.lng], target);
        return { route, positionIdx: 0 };
      });

      const aliensCreated = await Promise.all(alienPromises);
      setAliens(aliensCreated);
    };

    createAliens();
  }, [landing]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updateAliens = async () => {
        const updated = await Promise.all(
          aliens.map(async (alien, idx) => {
            let newIdx = alien.positionIdx + 1;
            if (newIdx >= alien.route.length) {
              const currentPos = alien.route[alien.route.length - 1];
              let newRoute = await getRoute(currentPos, [currentPos[0] + (Math.random() - 0.5) / 10, currentPos[1] + (Math.random() - 0.5) / 10]);
              if (!newRoute || newRoute.length < 2) {
                newRoute = alien.route.slice().reverse();
              }
              return { route: newRoute, positionIdx: 0 };
            }
            return { ...alien, positionIdx: newIdx };
          })
        );
        setAliens(updated);

        let kfarSabaInvaded = false;
        let raananaInvaded = false;
        const newWarnings = [];

        updated.forEach((alien, idx) => {
          const alienCoords = [
            alien.route[alien.positionIdx][1], // Longitude
            alien.route[alien.positionIdx][0], // Latitude
          ];
          const alienId = idx + 1;
          const currentTime = Date.now();
          const timeSinceLastWarning = currentTime - (lastWarningTimes.current[alienId] || 0);

          // Check against Kfar Saba polygon
          if (
            isPointInPolygon(
              alienCoords,
              kfarSabaPolygon.features[0].geometry.coordinates[0]
            )
          ) {
            kfarSabaInvaded = true;
            if (timeSinceLastWarning > 10000) {
              console.log(`WARNING! Alien ${alienId} is inside Kfar Saba!`);
              newWarnings.push(`Warning: Alien ${alienId} invading <b>Kfar Saba</b> at [${alienCoords[0].toFixed(4)}, ${alienCoords[1].toFixed(4)}]`);
              lastWarningTimes.current[alienId] = currentTime;
              if (!isMuted) warningSoundRef.current.play();
            }
          }
          // Check against Raanana polygon
          if (
            isPointInPolygon(
              alienCoords,
              raananaPolygon.features[0].geometry.coordinates[0]
            )
          ) {
            raananaInvaded = true;
            if (timeSinceLastWarning > 10000) {
              console.log(`WARNING! Alien ${alienId} is inside Raanana!`);
              newWarnings.push(`Warning: Alien ${alienId} invading <b>Raanana</b> at [${alienCoords[0].toFixed(4)}, ${alienCoords[1].toFixed(4)}]`);
              lastWarningTimes.current[alienId] = currentTime;
              if (!isMuted) warningSoundRef.current.play();
            }
          }
        });
        setWarnings((prevWarnings) => [...prevWarnings, ...newWarnings]);
        setKfarSabaIsInvaded(kfarSabaInvaded);
        setRaananaIsInvaded(raananaInvaded);
        // --- END ALIEN - POLYGON CHECK ---
      };
      updateAliens();
    }, 1000);
    return () => clearInterval(interval);
  }, [aliens, isMuted]);

  useEffect(() => {
    // Clear any existing interval
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
    }

    // Set the interval only if there's an active invasion in either polygon
    if (kfarSabaIsInvaded || raananaIsInvaded) {
      blinkIntervalRef.current = setInterval(() => {
        setKfarSabaBlinking((prev) => !prev);
        setRaananaBlinking((prev) => !prev);
      }, 500); // Blink every 0.5 seconds
    } else {
      // Ensure blinking is off when no invasion
      setKfarSabaBlinking(false);
      setRaananaBlinking(false);
    }

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [kfarSabaIsInvaded, raananaIsInvaded]); // Re-run when invasion status changes

  useEffect(() => {
    if (mapRef.current) {
      // Add Kfar Saba polygon
      kfarSabaPolygonLayer.current = L.geoJSON(kfarSabaPolygon, {
        color: 'blue',
        weight: 3,
        opacity: 0.9, // Keep the border opacity constant
        fillColor: kfarSabaIsInvaded
          ? kfarSabaBlinking
            ? 'red'
            : 'darkred'
          : 'blue',
        fillOpacity: 0.3, // Constant fill opacity when not blinking for emphasis
      }).addTo(mapRef.current);

      // Add Raanana polygon
      raananaPolygonLayer.current = L.geoJSON(raananaPolygon, {
        color: 'green',
        weight: 3,
        opacity: 0.9, // Keep the border opacity constant
        fillColor: raananaIsInvaded
          ? raananaBlinking
            ? 'red'
            : 'darkred'
          : 'lightgreen',
        fillOpacity: 0.3, // Constant fill opacity when not blinking for emphasis
      }).addTo(mapRef.current);

      // Fit bounds to both polygons and zoom out by one level on initial load
      if (!initialBoundsSet.current && kfarSabaPolygonLayer.current && raananaPolygonLayer.current && mapRef.current) {
        const bounds = L.latLngBounds(
          kfarSabaPolygonLayer.current.getBounds(),
          raananaPolygonLayer.current.getBounds()
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] }); // Add some padding
        setTimeout(() => {
          if (mapRef.current && !hasZoomedOut.current) {
            const currentZoom = mapRef.current.getZoom();
            mapRef.current.setZoom(currentZoom - 1);
            hasZoomedOut.current = true;
          }
        }, 500); // Adjust the delay as needed
        initialBoundsSet.current = true;
      } else if (mapRef.current && !initialBoundsSet.current) {
        mapRef.current.setView(center, initialZoom); // Fallback if polygons aren't loaded
        setTimeout(() => {
          if (mapRef.current && !hasZoomedOut.current) {
            const currentZoom = mapRef.current.getZoom();
            mapRef.current.setZoom(currentZoom - 1);
            hasZoomedOut.current = true;
          }
        }, 500);
        initialBoundsSet.current = true;
      }
    }
    return () => {
      if (kfarSabaPolygonLayer.current && mapRef.current) {
        mapRef.current.removeLayer(kfarSabaPolygonLayer.current);
      }
      if (raananaPolygonLayer.current && mapRef.current) {
        mapRef.current.removeLayer(raananaPolygonLayer.current);
      }
    };
  }, [mapRef.current, kfarSabaIsInvaded, raananaIsInvaded, kfarSabaBlinking, raananaBlinking]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <MapContainer center={center} zoom={initialZoom} style={{ height: '100%' }} ref={mapRef}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler setLanding={setLanding} />
        {landing && <Marker position={landing} icon={landingIcon} />}
        {aliens.map((alien, idx) => (
          <React.Fragment key={idx}>
            <Polyline positions={alien.route} color="purple" dashArray="3" />
            <Marker position={alien.route[alien.positionIdx]} icon={alienIcon(idx + 1)} />
          </React.Fragment>
        ))}
      </MapContainer>
      <div className="warnings-container">
        {warnings.map((warning, index) => (
          <WarningCard key={index} message={warning} />
        ))}
        {warnings.length > 0 && (
          <div className="warnings-controls-bottom">
            <button onClick={toggleMute}>
              <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  );
}