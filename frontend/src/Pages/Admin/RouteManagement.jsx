import React, { useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MapIcon,
  ClockIcon,
  TruckIcon,
  UsersIcon,
  AlertCircleIcon,
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  Link2,
} from "lucide-react";
import backendUrl from "../../config/config";

export function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const routeMetrics = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r) => r.busId !== null).length,
    totalStops: routes.reduce((acc, r) => acc + r.studentPickups.length, 0),
    averageTime: "45 mins", // Static for now
    onTimePerformance: "92%", // Static for now
  };

  const handleDelete = async (routeId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this route?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${backendUrl}/deleteRoute/${routeId}`);
      setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== routeId));
      alert("Route deleted successfully.");
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Failed to delete route.");
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/getAllRoutes`);
        setRoutes(res.data);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter((route) =>
    route.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
        <p className="text-gray-600">Manage and analyze bus routes and stops</p>
      </div>

      {/* Route Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Routes"
          value={routeMetrics.totalRoutes}
          icon={<MapIcon className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        <MetricCard
          label="Active Routes"
          value={routeMetrics.activeRoutes}
          icon={<TruckIcon className="h-6 w-6 text-green-500" />}
          color="green"
        />
        <MetricCard
          label="Total Stops"
          value={routeMetrics.totalStops}
          icon={<MapPinIcon className="h-6 w-6 text-amber-500" />}
          color="amber"
        />
        <MetricCard
          label="Average Time"
          value={routeMetrics.averageTime}
          icon={<ClockIcon className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
        <MetricCard
          label="On-Time"
          value={routeMetrics.onTimePerformance}
          icon={<AlertCircleIcon className="h-6 w-6 text-teal-500" />}
          color="teal"
        />
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
            <Link
              className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors"
              to="addRoute"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Add Route</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-gray-600">Loading routes...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
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
                    Bus Assigned
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
                      {route.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {route.schools.map((school, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {school.name ?? "Unnamed School"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.studentPickups.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.busId ? `Bus #${route.busId}` : "Not Assigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Link
                        className="flex items-center space-x-1 text-amber-500 hover:text-amber-700"
                        to={`viewRoute/${route.id}`}
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span>View</span>
                      </Link>
                      <Link
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
                        to={`editRoute/${route.id}`}
                      >
                        <EditIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-700"
                      >
                        <span className="material-icons">🗑️</span>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteManagement;
