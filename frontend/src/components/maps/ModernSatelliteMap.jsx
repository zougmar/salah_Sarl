import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Layers, Maximize2, Minimize2, AlertCircle, Loader } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for employees
const createCustomIcon = () => {
  return L.divIcon({
    html: `<div class="custom-map-marker">
            <div class="marker-pin"></div>
            <div class="marker-pulse"></div>
           </div>`,
    className: 'custom-marker-container',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
};

export const ModernSatelliteMap = ({ locations, height = '500px' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Add custom styles
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-map-marker {
        position: relative;
        width: 30px;
        height: 42px;
      }

      .marker-pin {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        background-color: #ef4444;
        border-radius: 50% 50% 50% 0;
        transform: translateX(-50%) rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .marker-pulse {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 30px;
        background-color: rgba(239, 68, 68, 0.3);
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        70% {
          transform: translateX(-50%) scale(1.5);
          opacity: 0;
        }
        100% {
          transform: translateX(-50%) scale(1.5);
          opacity: 0;
        }
      }

      .leaflet-popup-content-wrapper {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .leaflet-popup-content {
        margin: 0;
        font-family: 'Inter', sans-serif;
      }

      .map-controls {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .map-control-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .map-control-btn:hover {
        background-color: #f9fafb;
        transform: scale(1.05);
      }

      .map-control-btn.active {
        background-color: #3b82f6;
        color: white;
      }

      .map-legend {
        position: absolute;
        bottom: 32px;
        left: 12px;
        background-color: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 200px;
      }

      .fullscreen-map {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        border-radius: 0 !important;
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Initialize map only if it doesn't exist
      if (!map) {
        const leafletMap = L.map(mapRef.current, {
          center: [33.8869, 9.5375], // Default center (Tunisia)
          zoom: 6,
          zoomControl: false, // We'll add custom controls
        });

        // Initial tile layer
        updateTileLayer(leafletMap, 'satellite');

        setMap(leafletMap);
        setIsReady(true);
      }

      // Clean up on unmount
      return () => {
        if (map) {
          map.remove();
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError(err.message);
    }
  }, []);

  // Function to update tile layer based on map style
  const updateTileLayer = (mapInstance, style) => {
    // Remove existing tile layers
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstance.removeLayer(layer);
      }
    });

    // Add new tile layer based on style
    if (style === 'satellite') {
      // Satellite imagery
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 18,
      }).addTo(mapInstance);

      // Add a layer for labels
      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 18,
        opacity: 0.7,
      }).addTo(mapInstance);
    } else if (style === 'street') {
      // Standard street map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
      }).addTo(mapInstance);
    } else if (style === 'terrain') {
      // Terrain map
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 17,
      }).addTo(mapInstance);
    }
  };

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

      const marker = L.marker([location.latitude, location.longitude], { icon: createCustomIcon() })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <span style="font-weight: bold; color: #4b5563;">${location.employeeId?.name?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <p style="margin: 0; font-weight: 600; color: #111827;">${location.employeeId?.name || 'Unknown Employee'}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">${location.employeeId?.email || 'No email'}</p>
              </div>
            </div>
            <div style="padding-top: 8px; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${new Date(location.createdAt).toLocaleString()}</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Lat: ${location.latitude?.toFixed(6)}, Lng: ${location.longitude?.toFixed(6)}</p>
              ${location.accuracy ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Accuracy: ±${location.accuracy}m</p>` : ''}
            </div>
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

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Change map style
  const changeMapStyle = (style) => {
    setMapStyle(style);
    if (map) {
      updateTileLayer(map, style);
    }
  };

  // Center map on user location
  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (map) {
            map.setView([latitude, longitude], 13);

            // Add a temporary marker for user location
            const userIcon = L.divIcon({
              html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
              className: 'user-location-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            const userMarker = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map)
              .bindPopup('Your current location')
              .openPopup();

            // Remove the marker after 5 seconds
            setTimeout(() => {
              map.removeLayer(userMarker);
            }, 5000);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError("Unable to get your location. Please check your browser settings.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-red-50 rounded-lg" style={{ height }}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-sm font-medium text-red-800">Map Error</p>
        <p className="text-xs text-red-600 mt-1">{error}</p>
      </div>
    );
  }

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
    <div className={`relative rounded-lg overflow-hidden shadow-md ${isFullscreen ? 'fullscreen-map' : ''}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: height }} />

      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10" style={{ width: '70%', maxWidth: '400px' }}>
        <div className="bg-white rounded-lg shadow-md flex items-center px-3 py-2">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search locations..."
            className="flex-1 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {!isReady && (
        <div className="loading-overlay">
          <div className="text-center">
            <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="map-controls">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-2">
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-b border-gray-200"
            onClick={() => map && map.zoomIn()}
            title="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
            </svg>
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
            onClick={() => map && map.zoomOut()}
            title="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
        </div>
        
        <button
          className="map-control-btn bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center mb-2"
          onClick={centerOnUserLocation}
          title="Center on your location"
        >
          <Navigation className="w-5 h-5 text-blue-600" />
        </button>

        <div className="relative group">
          <button
            className="map-control-btn bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center"
            title="Map style"
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="absolute right-full mr-2 top-0 bg-white rounded-lg shadow-lg p-1 hidden group-hover:block z-10 min-w-[120px]">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${mapStyle === 'satellite' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => changeMapStyle('satellite')}
            >
              Satellite
            </button>
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${mapStyle === 'street' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => changeMapStyle('street')}
            >
              Street
            </button>
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${mapStyle === 'terrain' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => changeMapStyle('terrain')}
            >
              Terrain
            </button>
          </div>
        </div>

        <button
          className="map-control-btn bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-md px-3 py-1 z-10">
        <div className="flex items-center">
          <div className="h-1 bg-gray-800" style={{ width: '50px' }}></div>
          <span className="text-xs ml-2 text-gray-600">100m</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <h3 className="font-semibold text-sm mb-2">Recent Check-ins</h3>
        <p className="text-xs text-slate-600 mb-2">Last 24 hours</p>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <p className="text-xs text-slate-600">Employee Location</p>
        </div>
        <p className="text-xs text-slate-500 mb-2">Total: {locations.length} check-ins</p>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-400">Map data: Esri, OpenStreetMap</p>
        </div>
      </div>
    </div>
  );
};
