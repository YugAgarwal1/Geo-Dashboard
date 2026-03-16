// CountryOverlay — used internally by WorldMap via Leaflet divIcon overlays
// This file exists as a placeholder for future GeoJSON-based overlays

export function getCountryOverlayStyle(tensionScore) {
  const { interpolateColor } = require('../../utils/tensionColors');
  return {
    fillColor: interpolateColor(tensionScore),
    fillOpacity: 0.6,
    weight: 0.8,
    color: '#ffffff',
    opacity: 0.2,
  };
}

export function getHoverStyle(tensionScore) {
  const { getTensionColor } = require('../../utils/tensionColors');
  return {
    fillColor: getTensionColor(tensionScore),
    fillOpacity: 0.8,
    weight: 1.5,
    color: getTensionColor(tensionScore),
    opacity: 0.6,
  };
}

export default { getCountryOverlayStyle, getHoverStyle };
