import React, { useEffect, useRef, useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { isAlienInMunicipality } from './SpatialQuery';

const strongColors = [
  '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33',
  '#a65628', '#f781bf', '#999999', '#1b9e77', '#d95f02', '#7570b3'
];

export default function MunicipalitiesLayer({ data, aliens = [] }) {
  const layerRef = useRef();
  const blinkingPolygons = useRef({});
  const landingPolygonId = useRef(null);
  const landingLayerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const blinkState = useRef(true);
  const lastBlinkTime = useRef(0);
  const BLINK_INTERVAL = 500;

  const coloredData = useMemo(() => {
    if (!data || !Array.isArray(data.features)) return data;
    return {
      ...data,
      features: data.features.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          colorIndex: index % strongColors.length
        }
      }))
    };
  }, [data]);

  // Identify and track blinking polygons
  useEffect(() => {
    if (!layerRef.current) return;

    const layer = layerRef.current;
    const active = {};

    layer.eachLayer((featureLayer) => {
      const feature = featureLayer.feature;
      const colorIndex = feature.properties.colorIndex;
      const originalColor = strongColors[colorIndex];

      const polygonId =
        feature.properties.MUN_ID ||
        feature.properties.id ||
        feature.properties.name ||
        `${feature.properties.MUN_HEB || feature.properties.MUN_ENG || Math.random()}`;

      const isLanding = aliens.some(
        alien =>
          alien.properties?.type === 'landing' &&
          isAlienInMunicipality(alien, feature)
      );

      const isInvaded = aliens.some(alien =>
        isAlienInMunicipality(alien, feature)
      );

      if (isLanding) {
        landingPolygonId.current = polygonId;
        landingLayerRef.current = featureLayer;
        featureLayer._isBlinking = true;
        active[polygonId] = { layer: featureLayer, type: 'landing' };
      } else if (isInvaded) {
        featureLayer._isBlinking = true;
        active[polygonId] = { layer: featureLayer, type: 'invaded' };
      } else {
        // Reset non-blinking polygon
        featureLayer._isBlinking = false;
        featureLayer.setStyle({
          fillColor: originalColor,
          fillOpacity: 0.2,
          color: originalColor,
          weight: 1,
          opacity: 1
        });
      }
    });

    blinkingPolygons.current = active;
  }, [aliens, coloredData]);

  // Flicker via rAF
  useEffect(() => {
    const animate = (time) => {
      if (!lastBlinkTime.current) lastBlinkTime.current = time;

      const elapsed = time - lastBlinkTime.current;

      if (elapsed > BLINK_INTERVAL) {
        blinkState.current = !blinkState.current;
        lastBlinkTime.current = time;

        Object.entries(blinkingPolygons.current).forEach(([id, { layer, type }]) => {
          if (!layer || !layer._isBlinking) return;

          const fillColor = blinkState.current
            ? (type === 'landing' ? '#8B0000' : '#FF0000')
            : 'transparent';

          const stroke = type === 'landing' ? '#5a0000' : '#cc0000';

          layer.setStyle({
            fillColor: fillColor,
            fillOpacity: blinkState.current ? 0.8 : 0,
            color: stroke,
            weight: 3,
            opacity: 1
          });
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <GeoJSON
      data={coloredData}
      ref={layerRef}
      // ❌ remove style prop — we're handling all styling manually
      onEachFeature={(feature, layer) => {
        const colorIndex = feature.properties?.colorIndex ?? 0;
        const originalColor = strongColors[colorIndex];

        // Set initial (non-blinking) style manually
        layer.setStyle({
          fillColor: originalColor,
          fillOpacity: 0.2,
          color: originalColor,
          weight: 1,
          opacity: 1
        });

        const name = feature.properties?.MUN_HEB || feature.properties?.MUN_ENG || 'Unknown';
        layer.bindPopup(`רשות: ${name}`);

        layer._isBlinking = false;
      }}
    />
  );
}
