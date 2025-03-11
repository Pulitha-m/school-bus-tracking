import React, { useState } from "react";
import {
  TruckIcon,
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
  WrenchIcon,
  CalendarIcon,
} from "lucide-react";
import ScrollableTabs from "./components/ScrollableTabs";
import TableMobileCard from "./components/TableMobileCard";

const VehicleManagement = () => {
  const [activeTab, setActiveTab] = useState("fleet");

  const tabs = [
    {
      id: "fleet",
      label: "Fleet Overview",
    },
    {
      id: "health",
      label: "Vehicle Health",
    },
    {
      id: "maintenance",
      label: "Maintenance",
    },
  ];

  const vehicles = [
    {
      id: "Bus #42",
      license: "SCH-2023",
      driver: "Michael Davis",
      status: "On Route",
      health: 90,
      lastMaintenance: "May 2, 2023",
    },
    {
      id: "Bus #36",
      license: "SCH-1836",
      driver: "Sarah Johnson",
      status: "Maintenance",
      health: 65,
      lastMaintenance: "April 28, 2023",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Vehicle Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Monitor and manage your entire bus fleet
        </p>
      </div>

      <div className="mb-6">
        <ScrollableTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === "fleet" && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
            <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-3 text-white bg-blue-500 rounded-md">
                  <TruckIcon size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">
                    Total Vehicles
                  </p>
                  <h3 className="text-lg md:text-xl font-bold">24</h3>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-3 text-white bg-green-500 rounded-md">
                  <TruckIcon size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">
                    Active Vehicles
                  </p>
                  <h3 className="text-lg md:text-xl font-bold">18</h3>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-3 text-white bg-yellow-500 rounded-md">
                  <TruckIcon size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">
                    In Maintenance
                  </p>
                  <h3 className="text-lg md:text-xl font-bold">4</h3>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 mr-3 text-white bg-red-500 rounded-md">
                  <AlertTriangleIcon size={20} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Alerts</p>
                  <h3 className="text-lg md:text-xl font-bold">3</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4 md:space-y-0 md:flex md:items-center md:justify-between md:mb-6">
            <div className="relative flex-1 md:max-w-md">
              <input
                type="text"
                placeholder="Search vehicles..."
                className="w-full px-4 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:border-amber-500"
              />
              <SearchIcon
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
                <FilterIcon size={16} className="inline mr-2" />
                Filter
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600">
                <WrenchIcon size={16} className="inline mr-2" />
                Schedule Maintenance
              </button>
            </div>
          </div>

          <div className="block md:hidden space-y-3">
            {vehicles.map((vehicle) => (
              <TableMobileCard
                key={vehicle.id}
                data={vehicle}
                config={[
                  {
                    label: "Vehicle",
                    key: "id",
                    render: (value) => (
                      <div className="flex items-center">
                        <div className="p-2 mr-3 text-white bg-blue-500 rounded-md">
                          <TruckIcon size={16} />
                        </div>
                        <div>
                          <p className="font-medium">{value}</p>
                          <p className="text-sm text-gray-500">
                            {vehicle.license}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Driver",
                    key: "driver",
                  },
                  {
                    label: "Status",
                    key: "status",
                    render: (value) => (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          value === "On Route"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {value}
                      </span>
                    ),
                  },
                  {
                    label: "Health",
                    key: "health",
                    render: (value) => (
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            value >= 80 ? "bg-green-500" : "bg-yellow-500"
                          }`}
                          style={{
                            width: `${value}%`,
                          }}
                        />
                      </div>
                    ),
                  },
                  {
                    label: "Last Maintenance",
                    key: "lastMaintenance",
                  },
                ]}
              />
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Fleet Overview</h2>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md">
                  <FilterIcon size={14} className="mr-1" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="p-4">Bus ID</th>
                    <th className="p-4">License Plate</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Health</th>
                    <th className="p-4">Last Maintenance</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{vehicle.id}</td>
                      <td className="p-4">{vehicle.license}</td>
                      <td className="p-4">{vehicle.driver}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs text-${
                            vehicle.status === "On Route" ? "green" : "yellow"
                          }-700 bg-${
                            vehicle.status === "On Route" ? "green" : "yellow"
                          }-100 rounded-full`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="p-4">{vehicle.health}%</td>
                      <td className="p-4">{vehicle.lastMaintenance}</td>
                      <td className="p-4">
                        <button className="px-2 py-1 text-xs text-white bg-red-500 rounded-md">
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "health" && <div>Health Tab Content</div>}

      {activeTab === "maintenance" && <div>Maintenance Tab Content</div>}
    </div>
  );
};

export default VehicleManagement;
