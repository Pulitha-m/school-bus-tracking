import React from "react";
import { MapPinIcon, RefreshCwIcon, FilterIcon, UsersIcon } from "lucide-react";
export function LocationTracking() {
  const activeBuses = [
    {
      id: "Bus #42",
      driver: "Michael Davis",
      route: "Route B",
      status: "On Route",
      location: "North Springfield Ave",
      lastUpdate: "2 min ago",
    },
    {
      id: "Bus #17",
      driver: "Sarah Johnson",
      route: "Route A",
      status: "On Route",
      location: "East Main St",
      lastUpdate: "1 min ago",
    },
    {
      id: "Bus #23",
      driver: "Robert Wilson",
      route: "Route C",
      status: "At School",
      location: "Springfield Elementary",
      lastUpdate: "5 min ago",
    },
    {
      id: "Bus #35",
      driver: "Jennifer Brown",
      route: "Route D",
      status: "On Route",
      location: "West Park Ave",
      lastUpdate: "3 min ago",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Location Tracking</h1>
        <p className="text-gray-600">
          Track real-time location of school buses
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-medium text-gray-800">Live Map</h2>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors">
                <FilterIcon className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </button>
              <button className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors">
                <RefreshCwIcon className="h-4 w-4 mr-1" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="h-[500px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPinIcon className="h-10 w-10 text-amber-500 mx-auto" />
              <p className="mt-2 text-gray-500">
                Interactive map would be displayed here
              </p>
              <p className="text-sm text-gray-400">
                Showing real-time location of all active buses
              </p>
            </div>
          </div>
        </div>
        {/* Active Buses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-medium text-gray-800">Active Buses</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {activeBuses.map((bus) => (
              <div key={bus.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{bus.id}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      bus.status === "On Route"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Driver: {bus.driver}
                </div>
                <div className="text-sm text-gray-500">Route: {bus.route}</div>
                <div className="mt-2 flex items-start">
                  <MapPinIcon className="h-4 w-4 text-amber-500 mt-0.5 mr-1" />
                  <div>
                    <div className="text-sm">{bus.location}</div>
                    <div className="text-xs text-gray-400">
                      Updated {bus.lastUpdate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
