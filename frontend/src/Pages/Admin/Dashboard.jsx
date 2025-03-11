import React from "react";
import {
  BarChart3Icon,
  UsersIcon,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the SchoolBus Management System
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Total Students
              </h2>
              <p className="text-xl font-semibold">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <TruckIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Active Buses
              </h2>
              <p className="text-xl font-semibold">42</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Drivers</h2>
              <p className="text-xl font-semibold">38</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <MapPinIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Routes</h2>
              <p className="text-xl font-semibold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <CalendarIcon className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Today's Attendance
              </h2>
              <p className="text-xl font-semibold">96%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
          <div className="flex items-center">
            <div className="bg-teal-100 p-3 rounded-full">
              <DollarSignIcon className="h-6 w-6 text-teal-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </h2>
              <p className="text-xl font-semibold">$24,500</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Buses Map */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-gray-800 mb-4">
            Active Bus Locations
          </h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Map view of active buses</p>
          </div>
        </div>
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <div className="flex items-start pb-3 border-b">
              <div className="bg-blue-100 p-2 rounded-full">
                <TruckIcon className="h-4 w-4 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">Bus #42 started Route B</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start pb-3 border-b">
              <div className="bg-green-100 p-2 rounded-full">
                <UsersIcon className="h-4 w-4 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  37 students checked in at North Springfield
                </p>
                <p className="text-xs text-gray-500">25 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start pb-3 border-b">
              <div className="bg-red-100 p-2 rounded-full">
                <MapPinIcon className="h-4 w-4 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">Bus #17 reported maintenance issue</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-100 p-2 rounded-full">
                <DollarSignIcon className="h-4 w-4 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Monthly payment collected from 156 students
                </p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
