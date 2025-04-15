import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import polyline from 'polyline';
import MunicipalitiesMap from './MunicipalitiesMap';
//import './MunicipalitiesApp.css';

const center = [31.5, 34.8];
const initialZoom = 7;
const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://invasion-api.onrender.com";

// Define icon variables BEFORE ClickHandler
const alienIcon = (number) => L.divIcon({ html: `<div style="font-size:24px;">👽<span style="color:black; font-weight:bold; font-size:14px;">${number}</span></div>`, className: 'alien-icon', iconSize: [30, 30] });
const landingIcon = L.divIcon({ html: '<div style="font-size:28px; color: white;">🛸</div>', className: 'landing-icon', iconSize: [30, 30] }); // Added color: white

const ClickHandler = ({ setLanding, mapRef }) => {
  useMapEvents({
    contextmenu: (e) => { // Change to 'contextmenu' for right-click
      console.log('Right-click detected at:', e.latlng);
      setLanding(e.latlng); // Use e.latlng to get the coordinates
      if (mapRef.current) {
        mapRef.current.closePopup();
      }
    },
  });
  return null;
};

const MunicipalitiesApp = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [landing, setLanding] = useState(null);
  const [aliens, setAliens] = useState([]);
  const mapRef = useRef(null);

  const getRoute = async (from, to) => {
    try {
      const res = await axios.get(`${API_BASE}/api/route?fromLat=${from[0]}&fromLng=${from[1]}&toLat=${to[0]}&toLng=${to[1]}`);
      return polyline.decode(res.data.routes[0].geometry).map(coord => [coord[0], coord[1]]);
    } catch (error) {
      console.error("Error fetching route:", error);
      return [];
    }
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
  }, [landing, getRoute]);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/municipalities/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMunicipalities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching municipalities:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchMunicipalities();
  }, []);

  if (loading) {
    return <div>Loading municipalities...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App" style={{ height: '100vh' }}>
      <header className="App-header">
        <h1 className="text-2xl font-bold mb-4">Municipalities Map</h1>
      </header>
      <main style={{ height: 'calc(100% - 60px)' }}>
        <MapContainer
          center={center}
          zoom={initialZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler setLanding={setLanding} mapRef={mapRef} />
          {landing && <Marker position={landing} icon={landingIcon} />}
          {aliens.map((alien, idx) => (
            <React.Fragment key={idx}>
              <Polyline positions={alien.route} color="purple" dashArray="3" />
              <Marker position={alien.route[alien.positionIdx]} icon={alienIcon(idx + 1)} />
            </React.Fragment>
          ))}
          <MunicipalitiesMap municipalities={municipalities} />
        </MapContainer>
      </main>
    </div>
  );
};

export default MunicipalitiesApp;
