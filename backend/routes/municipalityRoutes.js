import React from 'react';
import { GeoJSON } from 'react-leaflet';

export default function MunicipalitiesLayer({ data }) {
  if (!data || !data.features) return null;

  return (
    <GeoJSON
      data={data}
      style={() => ({
        color: 'red',
        weight: 3,
        fillColor: 'orange',
        fillOpacity: 0.5
      })}
      onEachFeature={(feature, layer) => {
        const name = feature.properties.MUN_HEB || 'לא ידוע';
        layer.bindPopup(name);
      }}
    />
  );
}
