
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

export function isAlienInMunicipality(alien, municipality) {
  if (!alien || !municipality || !municipality.geometry) return false;

  const alienPoint = point([alien.geometry.coordinates[0], alien.geometry.coordinates[1]]);
  return booleanPointInPolygon(alienPoint, municipality);
}
