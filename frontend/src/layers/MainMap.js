import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import WindLayer from "./WindLayer";
import MunicipalitiesLayer from "./MunicipalitiesLayer";
import InvasionLayer from "./InvasionLayer";
import HistoricalInvasionLayer from "./HistoricalInvasionLayer";
import ShelterLayer from "./ShelterLayer";
import NearbySheltersLayer from "./NearbySheltersLayer";

import localMunicipalities from "../municipalities.json";
import axios from "axios";

const center = [32.08, 34.78];
const zoom = 13;

function MainMapContent({ mapRef, pendingLanding, setPendingLanding, flyToLanding }) {
  const map = useMap();

  useEffect(() => {
    console.log("✅ useMap hook detected map ready!", map);

    if (mapRef && !mapRef.current) {
      mapRef.current = map;
    }

    if (pendingLanding) {
      console.log("🔥 Flying pending landing after map ready!");
      flyToLanding(pendingLanding);
      setPendingLanding(null);
    }
  }, [map]);

  return null;
}

export default function MainMap({
  showMunicipalities,
  showLandings,
  showHistory,
  showAliens,
  showShelters,
  showNearbyShelters,
  showWeather,
  nightMode,
  visibleHistoricalIds,
  radius,
  latestLandingCoords,
  stopBlinking,
  mapRef,
  selectedLandingInfo,
}) {
  const [municipalities, setMunicipalities] = useState(null);
  const [invasionData, setInvasionData] = useState([]);
  const [pendingLanding, setPendingLanding] = useState(null);

  useEffect(() => {
    setMunicipalities(localMunicipalities);
  }, []);

  useEffect(() => {
    const loadInvasion = () => {
      axios
        .get("https://invasion-api.onrender.com/api/invasion")
        .then((res) => {
          const newFeatures = res.data.features;
          if (JSON.stringify(newFeatures) !== JSON.stringify(invasionData)) {
            setInvasionData(newFeatures);
          }
        })
        .catch((err) => console.error("Failed to load invasion data", err));
    };

    loadInvasion();
    const interval = setInterval(loadInvasion, 1000);
    return () => clearInterval(interval);
  }, [invasionData]);

  const flyToLanding = (landing) => {
    if (!landing || !Array.isArray(landing.coordinates) || landing.coordinates.length !== 2 || !mapRef?.current) {
      console.warn("⚠️ Cannot fly — landing info or map is missing.", landing);
      return;
    }
  
    console.log("🔥 Flying to landing:", landing);
  
    const { coordinates, id, municipalityName, timestamp } = landing;
  
    const today = new Date();
    const datePart = today.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    const fullTimeDisplay = timestamp
      ? `${datePart}, ${timestamp}`
      : "לא ידוע";
  
    // ✅ Step 1: Fly directly to new location WHILE zooming out
    mapRef.current.flyTo(coordinates, 10, {
      animate: true,
      duration: 3,      // ⏳ long smooth fly
      easeLinearity: 0.25,
    });
  
    // ✅ Step 2: After the fly, zoom in smoothly
    setTimeout(() => {
      mapRef.current.flyTo(coordinates, 12, {
        animate: true,
        duration: 1.5,   // ⏳ zoom in quickly
        easeLinearity: 0.2,
      });
  
      const popupContent = `
        🛸 ${id} - ${municipalityName}<br/>
        📍 ${coordinates[0].toFixed(5)}, ${coordinates[1].toFixed(5)}<br/>
        🕒 ${fullTimeDisplay}
      `;
  
      L.popup()
        .setLatLng(coordinates)
        .setContent(popupContent)
        .openOn(mapRef.current);
  
      const circle = L.circle(coordinates, {
        radius: 300,
        color: "yellow",
        fillColor: "yellow",
        fillOpacity: 0.3,
      }).addTo(mapRef.current);
  
      setTimeout(() => {
        mapRef.current.removeLayer(circle);
      }, 3000);
  
    }, 3000); // after main fly ends (duration match flyTo 3s)
  };
  

  useEffect(() => {
    if (selectedLandingInfo && Array.isArray(selectedLandingInfo.coordinates) && selectedLandingInfo.coordinates.length === 2) {
      if (mapRef?.current) {
        flyToLanding(selectedLandingInfo);
      } else {
        console.log("🕑 Map not ready, saving landing to pending...");
        setPendingLanding(selectedLandingInfo);
      }
    }
  }, [selectedLandingInfo]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MainMapContent
        mapRef={mapRef}
        pendingLanding={pendingLanding}
        setPendingLanding={setPendingLanding}
        flyToLanding={flyToLanding}
      />

      {showMunicipalities && municipalities && (
        <MunicipalitiesLayer
          data={municipalities}
          aliens={showLandings ? invasionData : []}
          stopBlinking={stopBlinking}
        />
      )}

      {showLandings && invasionData.length > 0 && (
        <InvasionLayer data={invasionData} />
      )}

      {showWeather && <WindLayer visible={true} />}

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
            pathOptions={{ color: "yellow", fillOpacity: 0.2 }}
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
