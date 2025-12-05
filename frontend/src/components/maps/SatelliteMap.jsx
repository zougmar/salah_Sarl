import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const SatelliteMap = ({ locations, height = '400px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || map) return;

    // Initialize map
    const leafletMap = L.map(mapRef.current, {
      center: [33.8869, 9.5375], // Default center (Tunisia)
      zoom: 6,
      zoomControl: true,
    });

    // Add satellite tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    }).addTo(leafletMap);

    // Add a layer for labels
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png', {
      attribution: 'Map labels by Stamen Design',
      maxZoom: 18,
      opacity: 0.7,
    }).addTo(leafletMap);

    setMap(leafletMap);
    setIsReady(true);

    // Clean up on unmount
    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, [mapRef.current]);

  // Update markers when locations change
  useEffect(() => {
    if (!map || !isReady) return;

    // Clear existing markers
    markers.forEach(marker => {
      map.removeLayer(marker);
    });

    // Add new markers
    const newMarkers = [];

    locations.forEach(location => {
      if (!location.latitude || !location.longitude) return;

      const marker = L.marker([location.latitude, location.longitude])
        .addTo(map)
        .bindPopup(`
          <div class="text-sm">
            <p class="font-semibold">${location.employeeId?.name || 'Unknown Employee'}</p>
            <p class="text-xs text-gray-500">${location.employeeId?.email || 'No email'}</p>
            <p class="text-xs text-gray-500 mt-1">${new Date(location.createdAt).toLocaleString()}</p>
            <p class="text-xs text-gray-500">Lat: ${location.latitude?.toFixed(6)}, Lng: ${location.longitude?.toFixed(6)}</p>
            ${location.accuracy ? `<p class="text-xs text-gray-500">Accuracy: ±${location.accuracy}m</p>` : ''}
          </div>
        `);

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers if there are any
    if (newMarkers.length > 0) {
      const group = new L.featureGroup(newMarkers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Clean up markers on unmount
    return () => {
      newMarkers.forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [map, isReady, locations]);

  if (!locations || locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-slate-100 rounded-lg" style={{ height }}>
        <MapPin className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-500">No location data</p>
        <p className="text-xs text-slate-400 mt-1">No check-ins in the last 24 hours</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs z-10">
        <p className="font-semibold text-slate-700 mb-1">Recent Check-ins</p>
        <p className="text-slate-600">Last 24 hours</p>
      </div>
    </div>
  );
};
