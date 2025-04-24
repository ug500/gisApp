import { useEffect, useState } from 'react';
import 'leaflet-velocity/dist/leaflet-velocity.css';
import FlowLayer from './flow-layer';
import { useMap } from 'react-leaflet';
import windData from '../data/wind-data-final-60x100.json';

export default function WindLayer() {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map) return;

    const timeout = setTimeout(() => {
      setReady(true);
    }, 300); // מחכים שהמפה תעלה

    return () => clearTimeout(timeout);
  }, [map]);

  useEffect(() => {
    if (!map || !ready) return;

    const windLayer = new FlowLayer(null, {});
    windLayer.setForecastModel({
      size: [60, 100],
      origin: [33.0, 34.0],
      resolution: [0.05, 0.05]
    });
    windLayer.setData(windData);
    windLayer._baseLayer.addTo(map);

    return () => {
      map.removeLayer(windLayer._baseLayer);
    };
  }, [map, ready]);

  return null;
}
