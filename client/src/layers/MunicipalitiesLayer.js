import React from 'react';
import { GeoJSON } from 'react-leaflet';

const strongColors = [
  '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33',
  '#a65628', '#f781bf', '#999999', '#1b9e77', '#d95f02', '#7570b3'
];

export default function MunicipalitiesLayer({ data }) {
  if (!data || !Array.isArray(data)) return null;

  let featureIndex = 0; // Maintain index outside the style function

  const style = (feature) => {
    const color = strongColors[featureIndex % strongColors.length];
    featureIndex++; // Increment for the next feature
    return {
      fillColor: color,
      fillOpacity: 0.2,
      weight: 1,
      color: 'blue'
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.MUN_HEB || feature.properties?.MUN_ENG || 'Unknown';
    layer.bindPopup(`רשות: ${name}`);
  };

  return (
    <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
  );
}