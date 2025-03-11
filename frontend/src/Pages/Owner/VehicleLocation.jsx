import React from "react";
import { MapIcon, SearchIcon } from "lucide-react";

const VehicleLocation = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Location</h1>
        <p className="text-gray-600">
          Track and monitor your fleet in real-time
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Live Tracking</h2>
            <div className="flex items-center p-2 bg-gray-100 rounded-md">
              <SearchIcon size={16} className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                className="text-sm bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-16 bg-gray-50">
          <div className="flex flex-col items-center text-gray-400">
            <MapIcon size={48} />
            <p className="mt-2">Map view will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleLocation;
