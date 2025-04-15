import React from 'react';
import { GeoJSON } from 'react-leaflet';

const strongColors = [
  '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33',
  '#a65628', '#f781bf', '#999999', '#1b9e77', '#d95f02', '#7570b3'
];

export default function MunicipalitiesLayer({ data }) {
  if (!data || !data.features) return null;

  const style = (feature) => {
    const index = data.features.indexOf(feature);
    return {
      fillColor: strongColors[index % strongColors.length],
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
