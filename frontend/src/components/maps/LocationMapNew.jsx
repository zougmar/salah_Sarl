import { MapPin } from 'lucide-react';

export const LocationMap = ({ locations }) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-100 rounded-lg overflow-hidden relative">
      {(!locations || locations.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
          <MapPin className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-medium">No location data</p>
          <p className="text-xs mt-1">No check-ins in the last 24 hours</p>
        </div>
      ) : (
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 min-h-[400px] p-6">
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs z-10">
            <p className="font-semibold text-slate-700 mb-1">Recent Check-ins</p>
            <p className="text-slate-600">Last 24 hours</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {locations.map((location, index) => (
              <div key={location._id || index} className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{location.employeeId?.name || 'Unknown Employee'}</h4>
                    <p className="text-xs text-slate-500">{location.employeeId?.email}</p>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Date & Time</p>
                    <p className="font-medium text-slate-700">{new Date(location.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-mono text-slate-700">{location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}</p>
                  </div>
                  {location.accuracy && (
                    <div>
                      <p className="text-xs text-slate-500">Accuracy</p>
                      <p className="text-slate-700">±{location.accuracy}m</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
