import React, { useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  EyeIcon,
} from "lucide-react";

export function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const drivers = [
    {
      id: "DR78945",
      name: "Michael Davis",
      phone: "(555) 234-5678",
      email: "michael.davis@schoolbus.com",
      assignedBus: "Bus #42",
      status: "On Duty",
    },
    {
      id: "DR65432",
      name: "Sarah Johnson",
      phone: "(555) 987-6543",
      email: "sarah.johnson@schoolbus.com",
      assignedBus: "Bus #17",
      status: "On Duty",
    },
    {
      id: "DR23456",
      name: "Robert Wilson",
      phone: "(555) 345-6789",
      email: "robert.wilson@schoolbus.com",
      assignedBus: "Bus #23",
      status: "Off Duty",
    },
    {
      id: "DR87654",
      name: "Jennifer Brown",
      phone: "(555) 876-5432",
      email: "jennifer.brown@schoolbus.com",
      assignedBus: "Bus #35",
      status: "On Duty",
    },
    {
      id: "DR34567",
      name: "Thomas Miller",
      phone: "(555) 456-7890",
      email: "thomas.miller@schoolbus.com",
      assignedBus: "Bus #19",
      status: "On Leave",
    },
    {
      id: "DR76543",
      name: "Emily Anderson",
      phone: "(555) 765-4321",
      email: "emily.anderson@schoolbus.com",
      assignedBus: "Bus #28",
      status: "Off Duty",
    },
  ];

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.assignedBus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <p className="text-gray-600">View and manage driver information</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        {/* Search and Actions Bar */}
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search drivers..."
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
              <span>Add Driver</span>
            </button>
          </div>
        </div>
        {/* Drivers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Bus
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {driver.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.assignedBus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.status === "On Duty"
                          ? "bg-green-100 text-green-800"
                          : driver.status === "Off Duty"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">6</span> of{" "}
            <span className="font-medium">6</span> results
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-amber-500 text-white rounded text-sm">
              1
            </button>
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
