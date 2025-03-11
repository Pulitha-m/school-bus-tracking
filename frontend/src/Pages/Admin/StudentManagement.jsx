import React, { useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
} from "lucide-react";
export function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "5th Grade",
      school: "Springfield Elementary",
      bus: "Bus #42",
      route: "Route B",
      status: "Active",
    },
    {
      id: 2,
      name: "Noah Williams",
      grade: "3rd Grade",
      school: "Springfield Elementary",
      bus: "Bus #42",
      route: "Route B",
      status: "Active",
    },
    {
      id: 3,
      name: "Olivia Smith",
      grade: "6th Grade",
      school: "Springfield Elementary",
      bus: "Bus #42",
      route: "Route B",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Liam Brown",
      grade: "4th Grade",
      school: "Springfield Elementary",
      bus: "Bus #42",
      route: "Route B",
      status: "Active",
    },
    {
      id: 5,
      name: "Ava Jones",
      grade: "2nd Grade",
      school: "North Springfield Elementary",
      bus: "Bus #17",
      route: "Route A",
      status: "Active",
    },
    {
      id: 6,
      name: "William Davis",
      grade: "1st Grade",
      school: "North Springfield Elementary",
      bus: "Bus #17",
      route: "Route A",
      status: "Active",
    },
    {
      id: 7,
      name: "Sophia Miller",
      grade: "Kindergarten",
      school: "North Springfield Elementary",
      bus: "Bus #17",
      route: "Route A",
      status: "Inactive",
    },
    {
      id: 8,
      name: "James Wilson",
      grade: "3rd Grade",
      school: "East Springfield Elementary",
      bus: "Bus #23",
      route: "Route C",
      status: "Active",
    },
  ];
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <p className="text-gray-600">View and manage student information</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        {/* Search and Actions Bar */}
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
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
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
              <FilterIcon className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors">
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.bus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            <span className="font-medium">8</span> of{" "}
            <span className="font-medium">8</span> results
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
