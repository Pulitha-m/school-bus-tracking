import React from "react";
import {
  TruckIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  GaugeIcon,
  WrenchIcon,
  FuelIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  ActivityIcon,
  UsersIcon,
} from "lucide-react";

export function VehicleManagement() {
  // Analytics data
  const fleetAnalytics = {
    totalVehicles: 42,
    activeVehicles: 38,
    inMaintenance: 3,
    outOfService: 1,
    averageFuelEfficiency: "8.5 km/L",
    totalMileage: "125,000 km",
  };

  const maintenanceStats = {
    scheduledMaintenance: 5,
    completedThisMonth: 12,
    averageCost: "$450",
    nextScheduled: 3,
  };

  const fuelConsumption = [
    {
      month: "Jan",
      consumption: 2500,
    },
    {
      month: "Feb",
      consumption: 2300,
    },
    {
      month: "Mar",
      consumption: 2800,
    },
    {
      month: "Apr",
      consumption: 2400,
    },
    {
      month: "May",
      consumption: 2600,
    },
    {
      month: "Jun",
      consumption: 2750,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
        <p className="text-gray-600">Manage and track school bus information</p>
      </div>
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Fleet Status</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {fleetAnalytics.activeVehicles}/{fleetAnalytics.totalVehicles}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TruckIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">Active Vehicles</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Average Efficiency</p>
              <h3 className="text-2xl font-bold text-green-700">
                {fleetAnalytics.averageFuelEfficiency}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <GaugeIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Fuel Efficiency</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">Maintenance</p>
              <h3 className="text-2xl font-bold text-amber-700">
                {maintenanceStats.scheduledMaintenance}
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <WrenchIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-sm text-amber-600 mt-2">Scheduled This Week</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Issues</p>
              <h3 className="text-2xl font-bold text-red-700">
                {fleetAnalytics.inMaintenance}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangleIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">Requiring Attention</p>
        </div>
      </div>
      {/* Maintenance and Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-800">Maintenance Overview</h2>
            <button className="text-sm text-blue-600">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Scheduled Maintenance</p>
                <p className="text-sm text-gray-500">Next 7 days</p>
              </div>
              <span className="text-lg font-semibold">
                {maintenanceStats.scheduledMaintenance}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Completed Maintenance</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <span className="text-lg font-semibold">
                {maintenanceStats.completedThisMonth}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Average Maintenance Cost</p>
                <p className="text-sm text-gray-500">Per vehicle</p>
              </div>
              <span className="text-lg font-semibold">
                {maintenanceStats.averageCost}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-800">
              Fuel Consumption Trends
            </h2>
            <button className="text-sm text-blue-600">View Details</button>
          </div>
          <div className="h-64 flex items-end justify-between px-2">
            {fuelConsumption.map((month) => (
              <div key={month.month} className="flex flex-col items-center">
                <div
                  className="w-8 bg-amber-200 rounded-t"
                  style={{
                    height: `${(month.consumption / 3000) * 100}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">
                  {month.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Vehicle List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
              <FilterIcon className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors">
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bus ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  License Plate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fuel Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Next Service
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Bus #42
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  SCH-2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Michael Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Route A
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Active
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  9.5 km/L
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15 March 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15 June 2024
                </td>
              </tr>
              {/* More vehicles here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
