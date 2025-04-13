import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import backendUrl from "../../config/config";
import {
  TruckIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  GaugeIcon,
  WrenchIcon,
  AlertTriangleIcon,
} from "lucide-react";

export default function VehicleManagement() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fleetAnalytics, setFleetAnalytics] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inMaintenance: 0,
    outOfService: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const result = await axios.get("http://localhost:8080/getAllBusses");
      setBuses(result.data);

      // Calculate analytics from the bus data
      const totalVehicles = result.data.length;
      const activeVehicles = result.data.filter(
        (b) => b.status === "ACTIVE"
      ).length;
      const inMaintenance = result.data.filter(
        (b) => b.status === "UNDER_MAINTENANCE"
      ).length;
      const outOfService = result.data.filter(
        (b) => b.status === "INACTIVE"
      ).length;

      setFleetAnalytics({
        totalVehicles,
        activeVehicles,
        inMaintenance,
        outOfService,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load buses");
      setLoading(false);
      console.error("Error loading buses:", err);
    }
  };

  const deleteBus = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await axios.delete(`http://localhost:8080/deleteBus/${busId}`);
        loadBuses();
      } catch (err) {
        console.error("Error deleting bus:", err);
        alert("Failed to delete bus");
      }
    }
  };

  const filteredBuses = buses.filter((bus) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      bus.model.toLowerCase().includes(searchLower) ||
      bus.noPlate.toLowerCase().includes(searchLower) ||
      bus.busId.toString().includes(searchTerm) ||
      bus.driverId.toString().includes(searchTerm) ||
      bus.routeId.toString().includes(searchTerm) ||
      bus.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
        <p className="text-gray-600">Manage and track school bus information</p>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Vehicles</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {fleetAnalytics.totalVehicles}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TruckIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Active Vehicles</p>
              <h3 className="text-2xl font-bold text-green-700">
                {fleetAnalytics.activeVehicles}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <GaugeIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">In Maintenance</p>
              <h3 className="text-2xl font-bold text-amber-700">
                {fleetAnalytics.inMaintenance}
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <WrenchIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Out of Service</p>
              <h3 className="text-2xl font-bold text-red-700">
                {fleetAnalytics.outOfService}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangleIcon className="h-6 w-6 text-red-500" />
            </div>
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
            <button
              className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors"
              onClick={() => navigate("addVehicle")}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading buses...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Make
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBuses.map((bus) => (
                  <tr key={bus.busId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bus.make}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bus.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.noPlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          bus.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : bus.status === "MAINTENANCE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bus.busImage ? (
                        <img
                          src={`data:image/jpeg;base64,${bus.busImage}`}
                          alt="Bus"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      {/* Replace with: */}
                      <div className="flex space-x-2">
                        <Link
                          to={`viewBus/${bus.busId}`}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          View
                        </Link>
                        <Link
                          to={`editBus/${bus.busId}`}
                          className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteBus(bus.busId)}
                          className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
