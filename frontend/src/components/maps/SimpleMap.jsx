import { MapPin } from 'lucide-react';

export const SimpleMap = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
        <MapPin className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm font-medium">No location data</p>
        <p className="text-xs mt-1">No check-ins in the last 24 hours</p>
      </div>
    );
  }

  // Function to convert lat/lng to x/y coordinates for our simple map
  const latLngToXY = (lat, lng) => {
    // Simple projection - in a real app you would use proper map projection
    const x = ((lng + 180) / 360) * 100; // Convert longitude to 0-100% range
    const y = ((90 - lat) / 180) * 100;  // Convert latitude to 0-100% range (inverted)
    
    // Ensure coordinates are within bounds
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden" 
         style={{
           backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="satellite" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill="%23e8f4ea"/><path d="M0,0 L100,0 L100,100 L0,100 Z" fill="%23e8f4ea"/><path d="M0,20 Q20,10 40,20 T80,20 T100,20" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M0,40 Q20,30 40,40 T80,40 T100,40" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M0,60 Q20,50 40,60 T80,60 T100,60" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M0,80 Q20,70 40,80 T80,80 T100,80" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M20,0 Q10,20 20,40 T20,80 T20,100" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M40,0 Q30,20 40,40 T40,80 T40,100" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M60,0 Q50,20 60,40 T60,80 T60,100" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><path d="M80,0 Q70,20 80,40 T80,80 T80,100" stroke="%23c8e6c9" stroke-width="0.5" fill="none"/><rect x="20" y="20" width="15" height="15" fill="%23b8d6a9" opacity="0.4"/><rect x="60" y="40" width="20" height="20" fill="%23b8d6a9" opacity="0.4"/><rect x="30" y="70" width="25" height="15" fill="%23b8d6a9" opacity="0.4"/></pattern></defs><rect width="100" height="100" fill="url(%23satellite)"/></svg>')`,
           backgroundSize: 'cover',
           backgroundColor: '#e8f4ea'
         }}>
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs z-10">
        <p className="font-semibold text-slate-700 mb-1">Recent Check-ins</p>
        <p className="text-slate-600">Last 24 hours</p>
      </div>

      {/* Location Markers */}
      {locations.map((location) => {
        // Use actual coordinates if available, otherwise random positions
        let top, left;
        
        if (location.latitude && location.longitude) {
          const { x, y } = latLngToXY(location.latitude, location.longitude);
          left = x;
          top = y;
        } else {
          // Fallback to random positioning
          top = 20 + Math.random() * 60;
          left = 20 + Math.random() * 60;
        }

        return (
          <div
            key={location._id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className="relative group">
              {/* Shadow */}
              <div className="absolute inset-0 bg-black opacity-20 rounded-full blur-md transform translate-y-1"></div>
              
              {/* Pin */}
              <div className="relative w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 z-10">
                <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75"></div>
                <MapPin className="w-5 h-5 text-white relative z-10" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">{location.employeeId?.name || 'Unknown Employee'}</p>
                  <p className="text-xs text-slate-500">{new Date(location.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-slate-600 mt-1">Lat: {location.latitude?.toFixed(6)}, Lng: {location.longitude?.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
