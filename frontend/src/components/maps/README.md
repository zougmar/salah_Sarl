# Satellite Map Implementation Guide

## Overview
The SatelliteMap component provides an interactive satellite view map with zoom, pan, and real satellite imagery using Leaflet and Esri World Imagery tiles.

## Features
- Real satellite imagery from Esri
- Zoom and pan controls
- Custom markers for location check-ins
- Popup information for each marker
- Responsive design
- Automatic map bounds adjustment to show all markers

## Installation

### 1. Install Required Dependencies
```bash
npm install leaflet
npm install -D @types/leaflet
```

### 2. Update package.json
Replace your package.json with the one provided (package.json.new) which includes the Leaflet dependency.

### 3. Import CSS
Add this import to your main App.jsx or index.js:
```javascript
import 'leaflet/dist/leaflet.css';
```

## Usage

### Basic Implementation
```jsx
import { SatelliteMap } from '../components/maps/SatelliteMap';

// In your component:
<SatelliteMap 
  locations={yourLocationData} 
  height="400px" 
/>
```

### Location Data Format
The locations prop should be an array of objects with the following structure:
```javascript
[
  {
    _id: "unique_id",
    latitude: 33.8869,
    longitude: 9.5375,
    createdAt: "2023-10-25T12:00:00Z",
    employeeId: {
      name: "Employee Name",
      email: "employee@example.com"
    },
    accuracy: 10 // Optional, in meters
  },
  // ... more locations
]
```

## Customization

### Changing the Map Style
To use a different tile provider (e.g., OpenStreetMap), modify this section in SatelliteMap.jsx:
```javascript
// Current: Esri World Imagery (satellite)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 18,
}).addTo(leafletMap);

// Example: OpenStreetMap (standard map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(leafletMap);
```

### Custom Marker Icons
To customize the marker icons, modify the marker creation in the useEffect:
```javascript
const customIcon = L.divIcon({
  html: '<div class="custom-marker">Your HTML here</div>',
  className: 'custom-marker-container',
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
```

## API Keys

### Esri World Imagery (Current Implementation)
The current implementation uses Esri World Imagery tiles which do not require an API key for development use. For production use, you may need to:

1. Sign up for an Esri developer account
2. Register your application
3. Add your API key to the tile URL:
```javascript
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${YOUR_API_KEY}`, {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 18,
}).addTo(leafletMap);
```

### Alternative: Google Maps
If you prefer to use Google Maps satellite imagery:

1. Get a Google Maps JavaScript API key from the Google Cloud Console
2. Install the react-google-maps package:
```bash
npm install @googlemaps/react-wrapper
```

3. Replace the SatelliteMap component with a Google Maps implementation

## Troubleshooting

### Markers Not Showing
If markers are not appearing:
1. Check that your location data includes valid latitude and longitude values
2. Ensure the Leaflet CSS is properly imported
3. Check browser console for any errors

### Map Not Rendering
If the map is not rendering:
1. Verify that the map container has a defined height
2. Make sure Leaflet CSS is imported before your component CSS
3. Check that the mapRef is properly attached to a DOM element

### Performance Issues
For large numbers of markers:
1. Consider implementing marker clustering
2. Use marker grouping for better performance
3. Limit the number of visible markers based on zoom level
