import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import styles from './MunicipalitiesMap.module.css';

function MunicipalitiesMap({ municipalities }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) {
        mapRef.current = L.map('municipalities-map').setView([31.5, 34.7], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        if (municipalities) {
          L.geoJSON(municipalities, {
            style: (feature) => {
              const index = municipalities.indexOf(feature);
              const fillColor = strongColors[index % strongColors.length];
              return {
                fillColor: fillColor,
                fillOpacity: 0.2,
                weight: 1,
                opacity: 1,
                color: 'blue',
                //className: styles.municipalityPolygon,
              };
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.MUN_HEB) {
                layer.bindPopup(`Municipality (Hebrew): ${feature.properties.MUN_HEB}`);
              } else if (feature.properties && feature.properties.MUN_ENG) {
                layer.bindPopup(`Municipality (English): ${feature.properties.MUN_ENG}`);
              }
            },
          }).addTo(mapRef.current);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [municipalities]);

  const strongColors = [
    '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33',
    '#a65628', '#f781bf', '#999999', '#1b9e77', '#d95f02', '#7570b3'
  ];

  return (
    <div id="municipalities-map" style={{ height: '100vh', width: '100vw' }}></div>
  );
}

export default MunicipalitiesMap;
