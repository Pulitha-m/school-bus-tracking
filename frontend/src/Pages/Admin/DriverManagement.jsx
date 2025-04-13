import React, { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../../config/config";
import {
  UsersIcon,
  BusFrontIcon,
  Trash2Icon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [assignData, setAssignData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDrivers();
    fetchBuses();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllDrivers`);
      setDrivers(res.data);
    } catch (error) {
      toast.error("Failed to fetch drivers.");
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllBusses`);
      setBuses(res.data);
    } catch (error) {
      toast.error("Failed to fetch buses.");
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await axios.delete(`${backendUrl}/deleteDriverById/${driverId}`);
      toast.success("Driver deleted.");
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to delete driver.");
    }
  };

  const handleBusSelect = (driverId, busId) => {
    setAssignData((prev) => ({
      ...prev,
      [driverId]: busId,
    }));
  };

  const assignBus = async (driverId) => {
    const busId = assignData[driverId];
    if (!busId) {
      toast.warn("Please select a bus.");
      return;
    }

    try {
      await axios.put(`${backendUrl}/assign-bus/${driverId}/${busId}`);
      toast.success("Bus assigned successfully.");
      fetchDrivers();
    } catch (error) {
      toast.error(error.response?.data || "Failed to assign bus.");
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const keyword = searchQuery.toLowerCase();
    return (
      driver.user?.username?.toLowerCase().includes(keyword) ||
      driver.firstName?.toLowerCase().includes(keyword) ||
      driver.lastName?.toLowerCase().includes(keyword) ||
      driver.phoneNumber?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <p className="text-gray-600">Manage and assign school bus drivers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">Total Drivers</p>
            <h3 className="text-2xl font-bold text-blue-700">
              {drivers.length}
            </h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <UsersIcon className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600">Assigned</p>
            <h3 className="text-2xl font-bold text-green-700">
              {drivers.filter((d) => d.busId !== null).length}
            </h3>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <BusFrontIcon className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600">Unassigned</p>
            <h3 className="text-2xl font-bold text-yellow-700">
              {drivers.filter((d) => d.busId === null).length}
            </h3>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <Trash2Icon className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by email, name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Email",
                "First",
                "Last",
                "Phone",
                "Address",
                "Emergency",
                "DOB",
                "Bus",
                "Route",
                "Assign",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDrivers.map((driver) => (
              <tr
                key={driver.id}
                className={`${!driver.busId ? "bg-yellow-50" : ""}`}
              >
                <td className="px-4 py-3">{driver.id}</td>
                <td className="px-4 py-3">{driver.user?.username || "-"}</td>
                <td className="px-4 py-3">{driver.firstName || "-"}</td>
                <td className="px-4 py-3">{driver.lastName || "-"}</td>
                <td className="px-4 py-3">{driver.phoneNumber || "-"}</td>
                <td className="px-4 py-3">{driver.address || "-"}</td>
                <td className="px-4 py-3">{driver.emergencyContact || "-"}</td>
                <td className="px-4 py-3">
                  {driver.dob ? new Date(driver.dob).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3">{driver.busId || "None"}</td>
                <td className="px-4 py-3">{driver.routeId || "None"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <select
                      value={assignData[driver.id] || ""}
                      onChange={(e) =>
                        handleBusSelect(driver.id, parseInt(e.target.value))
                      }
                      className="border px-2 py-1 rounded text-xs"
                    >
                      <option value="">Select Bus</option>
                      {buses
                        .filter(
                          (bus) =>
                            bus.driverAssigned === false ||
                            bus.busId === driver.busId
                        )
                        .map((bus) => (
                          <option key={bus.busId} value={bus.busId}>
                            {bus.busNumber || `Bus ${bus.busId}`}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => assignBus(driver.id)}
                      disabled={!assignData[driver.id]}
                      className={`px-2 py-1 text-xs rounded text-white ${
                        assignData[driver.id]
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Assign
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleDelete(driver.id)}
                    className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredDrivers.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverManagement;
