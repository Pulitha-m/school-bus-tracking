import React from "react";
import {
  BarChart3Icon,
  TruckIcon,
  UsersIcon,
  AlertTriangleIcon,
  DollarSignIcon,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Owner Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Welcome back! Here's an overview of your fleet operations
        </p>
      </div>
      {/* Stats Cards - Updated for better mobile layout */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-blue-500 rounded-md">
              <TruckIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <h3 className="text-xl font-bold">24</h3>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-green-500 rounded-md">
              <UsersIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Drivers</p>
              <h3 className="text-xl font-bold">18</h3>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-red-500 rounded-md">
              <AlertTriangleIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Maintenance Alerts</p>
              <h3 className="text-xl font-bold">3</h3>
            </div>
          </div>
        </div>
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 mr-3 text-white bg-purple-500 rounded-md">
              <DollarSignIcon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <h3 className="text-xl font-bold">$24,500</h3>
            </div>
          </div>
        </div>
      </div>
      {/* Vehicle Status and Finance Overview - Updated for mobile */}
      <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2 md:gap-6 md:mt-6">
        {/* Vehicle Status Table */}
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-medium">Vehicle Status</h2>
            <button className="px-2 py-1 md:px-3 text-xs md:text-sm text-amber-600 bg-amber-100 rounded-md">
              View All
            </button>
          </div>
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 px-3 md:pb-2 text-xs md:text-sm font-medium">
                      Bus ID
                    </th>
                    <th className="py-2 px-3 md:pb-2 text-xs md:text-sm font-medium">
                      Driver
                    </th>
                    <th className="py-2 px-3 md:pb-2 text-xs md:text-sm font-medium">
                      Status
                    </th>
                    <th className="py-2 px-3 md:pb-2 text-xs md:text-sm font-medium">
                      Route
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Bus #42
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Michael Davis
                    </td>
                    <td className="py-2 px-3 md:py-3">
                      <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
                        On Route
                      </span>
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      North Springfield
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Bus #36
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Sarah Johnson
                    </td>
                    <td className="py-2 px-3 md:py-3">
                      <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                        Maintenance
                      </span>
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      East Meadow
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Bus #28
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Robert Chen
                    </td>
                    <td className="py-2 px-3 md:py-3">
                      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                        Parked
                      </span>
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      West County
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Bus #17
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      Emily Wilson
                    </td>
                    <td className="py-2 px-3 md:py-3">
                      <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                        On Route
                      </span>
                    </td>
                    <td className="py-2 px-3 md:py-3 text-xs md:text-sm">
                      South Central
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Finance Overview - Adjusted for mobile */}
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-medium">
              Finance Overview
            </h2>
            <button className="px-2 py-1 md:px-3 text-xs md:text-sm text-amber-600 bg-amber-100 rounded-md">
              Details
            </button>
          </div>
          <div className="flex items-center justify-center p-2 md:p-4">
            <BarChart3Icon
              size={150}
              className="text-gray-300 md:w-[200px] md:h-[200px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 md:gap-4 md:mt-4">
            <div className="p-2 md:p-3 bg-gray-50 rounded-md">
              <p className="text-xs md:text-sm text-gray-500">Total Revenue</p>
              <p className="text-base md:text-lg font-bold">$156,240</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-md">
              <p className="text-xs md:text-sm text-gray-500">Expenses</p>
              <p className="text-base md:text-lg font-bold">$98,450</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activities - Mobile optimized */}
      <div className="mt-4 md:mt-6">
        <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-medium">
              Recent Activities
            </h2>
            <button className="px-2 py-1 md:px-3 text-xs md:text-sm text-amber-600 bg-amber-100 rounded-md">
              View All
            </button>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-start p-2 md:p-3 bg-gray-50 rounded-md">
              <div className="p-1.5 md:p-2 mr-2 md:mr-3 text-white bg-green-500 rounded-full">
                <DollarSignIcon size={14} className="md:w-4 md:h-4" />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium">
                  Payment sent to Michael Davis
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  $1,250.00 - Today at 10:45 AM
                </p>
              </div>
            </div>
            <div className="flex items-start p-2 md:p-3 bg-gray-50 rounded-md">
              <div className="p-1.5 md:p-2 mr-2 md:mr-3 text-white bg-amber-500 rounded-full">
                <AlertTriangleIcon size={14} className="md:w-4 md:h-4" />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium">
                  Maintenance alert for Bus #36
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Reported by Driver Sarah Johnson
                </p>
              </div>
            </div>
            <div className="flex items-start p-2 md:p-3 bg-gray-50 rounded-md">
              <div className="p-1.5 md:p-2 mr-2 md:mr-3 text-white bg-blue-500 rounded-full">
                <TruckIcon size={14} className="md:w-4 md:h-4" />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium">
                  Bus #28 started route
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  West County - Today at 8:30 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
