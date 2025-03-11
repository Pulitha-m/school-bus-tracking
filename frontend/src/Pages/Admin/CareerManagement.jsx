import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
  BriefcaseIcon,
} from "lucide-react";
export function CareerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const jobApplications = [
    {
      id: 1,
      position: "Bus Driver",
      applicant: "John Smith",
      experience: "5 years",
      status: "Pending",
      appliedDate: "2023-08-01",
    },
    {
      id: 2,
      position: "Transportation Coordinator",
      applicant: "Sarah Johnson",
      experience: "3 years",
      status: "Interviewed",
      appliedDate: "2023-07-28",
    },
    // Add more applications as needed
  ];
  const openPositions = [
    {
      id: 1,
      title: "Bus Driver",
      location: "North Springfield",
      type: "Full-time",
      applications: 12,
    },
    {
      id: 2,
      title: "Transportation Coordinator",
      location: "Central Office",
      type: "Full-time",
      applications: 8,
    },
    // Add more positions as needed
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Career Management</h1>
        <p className="text-gray-600">Manage job openings and applications</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-medium text-gray-800">Recent Applications</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                  <FilterIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.applicant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            application.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "Interviewed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Open Positions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-medium text-gray-800">Open Positions</h2>
          </div>
          <div className="p-4 space-y-4">
            {openPositions.map((position) => (
              <div key={position.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {position.title}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <div>{position.location}</div>
                      <div>{position.type}</div>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    {position.applications} applications
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600">
                    Edit Position
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
