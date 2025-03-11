import React, { useState } from "react";
import {
  MapIcon,
  ClockIcon,
  TruckIcon,
  UsersIcon,
  AlertCircleIcon,
  MapPinIcon,
  SchoolIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
} from "lucide-react";

export function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const routeMetrics = {
    totalRoutes: 24,
    activeRoutes: 18,
    totalStops: 156,
    averageTime: "45 mins",
    onTimePerformance: "92%",
  };

  const routes = [
    {
      id: "R001",
      name: "North Route",
      schools: ["Springfield Elementary", "North High School"],
      totalStops: 8,
      driver: "Michael Davis",
      bus: "Bus #42",
      schedule: "7:30 AM - 8:30 AM",
      status: "Active",
      performance: 94,
      students: 35,
    },
    {
      id: "R002",
      name: "South Route",
      schools: ["South Elementary", "Central Middle School"],
      totalStops: 6,
      driver: "Sarah Johnson",
      bus: "Bus #17",
      schedule: "7:15 AM - 8:15 AM",
      status: "Active",
      performance: 96,
      students: 28,
    },
    {
      id: "R003",
      name: "East Route",
      schools: ["East Elementary", "Springfield High School"],
      totalStops: 7,
      driver: "Robert Wilson",
      bus: "Bus #23",
      schedule: "7:45 AM - 8:45 AM",
      status: "Inactive",
      performance: 92,
      students: 32,
    },
  ];

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
        <p className="text-gray-600">Manage and analyze bus routes and stops</p>
      </div>

      {/* Route Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Routes</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {routeMetrics.totalRoutes}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MapIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Active Routes</p>
              <h3 className="text-2xl font-bold text-green-700">
                {routeMetrics.activeRoutes}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TruckIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">Total Stops</p>
              <h3 className="text-2xl font-bold text-amber-700">
                {routeMetrics.totalStops}
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <MapPinIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm">Average Time</p>
              <h3 className="text-2xl font-bold text-purple-700">
                {routeMetrics.averageTime}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <ClockIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 text-sm">On-Time</p>
              <h3 className="text-2xl font-bold text-teal-700">
                {routeMetrics.onTimePerformance}
              </h3>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <AlertCircleIcon className="h-6 w-6 text-teal-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search routes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <span>Add Route</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Schools
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {route.schools.map((school, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {school}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.totalStops}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.bus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        route.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.performance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="flex items-center space-x-1 text-amber-500 hover:text-amber-700">
                      <EyeIcon className="h-5 w-5" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
                      <EditIcon className="h-5 w-5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
