import React, { useState } from "react";
import {
  CalendarIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  ChevronDownIcon,
} from "lucide-react";

export function AttendanceLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");
  const attendanceLogs = [
    {
      id: 1,
      student: "Emma Johnson",
      grade: "5th Grade",
      bus: "Bus #42",
      pickupTime: "7:45 AM",
      dropoffTime: "4:15 PM",
      status: "Present",
    },
    {
      id: 2,
      student: "Noah Williams",
      grade: "3rd Grade",
      bus: "Bus #42",
      pickupTime: "7:50 AM",
      dropoffTime: "4:20 PM",
      status: "Present",
    },
    {
      id: 3,
      student: "Olivia Smith",
      grade: "6th Grade",
      bus: "Bus #42",
      pickupTime: "-",
      dropoffTime: "-",
      status: "Absent",
    },
    {
      id: 4,
      student: "Liam Brown",
      grade: "4th Grade",
      bus: "Bus #42",
      pickupTime: "7:55 AM",
      dropoffTime: "4:25 PM",
      status: "Present",
    },
    {
      id: 5,
      student: "Ava Jones",
      grade: "2nd Grade",
      bus: "Bus #17",
      pickupTime: "8:05 AM",
      dropoffTime: "4:30 PM",
      status: "Present",
    },
    {
      id: 6,
      student: "William Davis",
      grade: "1st Grade",
      bus: "Bus #17",
      pickupTime: "8:10 AM",
      dropoffTime: "4:35 PM",
      status: "Present",
    },
    {
      id: 7,
      student: "Sophia Miller",
      grade: "Kindergarten",
      bus: "Bus #17",
      pickupTime: "-",
      dropoffTime: "-",
      status: "Absent",
    },
    {
      id: 8,
      student: "James Wilson",
      grade: "3rd Grade",
      bus: "Bus #23",
      pickupTime: "8:15 AM",
      dropoffTime: "4:40 PM",
      status: "Present",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Attendance Logs</h1>
        <p className="text-gray-600">
          Track student attendance and bus schedules
        </p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex space-x-2">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="flex items-center px-3 py-2 border rounded-lg text-gray-700">
              {selectedDate}
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
              <FilterIcon className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors">
              <DownloadIcon className="h-4 w-4 mr-1" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pickup Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Drop-off Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.bus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.pickupTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.dropoffTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status}
                    </span>
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
