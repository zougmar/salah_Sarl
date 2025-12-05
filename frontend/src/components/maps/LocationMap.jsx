import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export const LocationMap = ({ locations }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !locations || locations.length === 0) return;

    // Create a simple map visualization using HTML/CSS
    // In a real implementation, you would use a library like Leaflet or Google Maps

    // This is a placeholder implementation
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Create a map container
    const mapDiv = document.createElement('div');
    mapDiv.className = 'relative w-full h-full bg-slate-100 rounded-lg overflow-hidden';
    mapDiv.style.minHeight = '400px';

    // Add a simple map background
    const mapBg = document.createElement('div');
    mapBg.className = 'absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50';
    mapDiv.appendChild(mapBg);

    // Add location markers
    locations.forEach((location, index) => {
      if (!location.latitude || !location.longitude) return;

      // Create a marker element
      const marker = document.createElement('div');
      marker.className = 'absolute transform -translate-x-1/2 -translate-y-1/2';

      // Random position for demo (in real implementation, you would calculate actual position)
      const top = 20 + (index * 15) % 60;
      const left = 20 + (index * 25) % 70;

      marker.style.top = `${top}%`;
      marker.style.left = `${left}%`;

      // Create the marker icon
      const markerIcon = document.createElement('div');
      markerIcon.className = 'relative';

      const pinIcon = document.createElement('div');
      pinIcon.className = 'w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg';
      pinIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      `;

      markerIcon.appendChild(pinIcon);

      // Create a tooltip with location info
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-3 w-48 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10';
      tooltip.innerHTML = `
        <div class="text-sm">
          <p class="font-semibold text-slate-900">${location.employeeId?.name || 'Unknown'}</p>
          <p class="text-xs text-slate-500">${new Date(location.createdAt).toLocaleString()}</p>
          <p class="text-xs text-slate-600 mt-1">Lat: ${location.latitude?.toFixed(6)}, Lng: ${location.longitude?.toFixed(6)}</p>
        </div>
      `;

      markerIcon.appendChild(tooltip);
      marker.appendChild(markerIcon);
      mapDiv.appendChild(marker);
    });

    // Add a map legend
    const legend = document.createElement('div');
    legend.className = 'absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs';
    legend.innerHTML = `
      <p class="font-semibold text-slate-700 mb-1">Recent Check-ins</p>
      <p class="text-slate-600">Last 24 hours</p>
    `;
    mapDiv.appendChild(legend);

    mapContainer.appendChild(mapDiv);

  }, [locations]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] bg-slate-100 rounded-lg"
    >
      {(!locations || locations.length === 0) && (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
          <MapPin className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium">No location data</p>
          <p className="text-xs mt-1">No check-ins in the last 24 hours</p>
        </div>
      )}
    </div>
  );
};
