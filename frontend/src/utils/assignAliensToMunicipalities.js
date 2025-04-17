import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

/**
 * Adds 'municipality' to each alien based on spatial intersection with municipalities
 */
export default function assignAliensToMunicipalities(aliens, municipalities) {
  console.log("🏙️ בודק שיוך חייזרים לרשויות...");
  return aliens.map(alien => {
    const pt = point(alien.geometry.coordinates);
    console.log("👽 חייזר בקואורדינטות:", alien.geometry.coordinates);

    const match = municipalities.features.find(muni => {
      const inside = booleanPointInPolygon(pt, muni);
      if (inside) {
        console.log("✅ נמצא בתוך:", muni.properties.MUN_HEB);
      }
      return inside;
    });

    if (!match) {
      console.log("❌ לא נמצא בתוך אף רשות");
    }

    return {
      ...alien,
      properties: {
        ...alien.properties,
        municipality: match?.properties?.MUN_HEB || 'לא ידוע',
      },
    };
  });
}