import { useState, useCallback } from 'react';

export function useMap() {
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [zoom, setZoom] = useState(2);
  const [center, setCenter] = useState([20, 10]);

  const flyToCountry = useCallback((country, coordsMap) => {
    const coords = coordsMap[country.name];
    if (coords && mapInstance) {
      mapInstance.flyTo(coords, 5, { animate: true, duration: 1.2 });
    }
    setSelectedCountry(country);
  }, [mapInstance]);

  const resetView = useCallback(() => {
    if (mapInstance) {
      mapInstance.flyTo([20, 10], 2, { animate: true, duration: 1.0 });
    }
    setSelectedCountry(null);
  }, [mapInstance]);

  return {
    mapInstance, setMapInstance,
    selectedCountry, setSelectedCountry,
    zoom, setZoom, center, setCenter,
    flyToCountry, resetView,
  };
}

export default useMap;
