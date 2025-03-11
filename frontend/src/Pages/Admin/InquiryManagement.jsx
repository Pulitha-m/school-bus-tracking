import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  MessageSquareIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
export function InquiryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const inquiries = [
    {
      id: 1,
      type: "General",
      from: "Parent",
      name: "Robert Wilson",
      subject: "Transportation Schedule Query",
      status: "New",
      priority: "Medium",
      date: "2023-08-01",
    },
    {
      id: 2,
      type: "Complaint",
      from: "Parent",
      name: "Emily Brown",
      subject: "Bus Delay Issue",
      status: "In Progress",
      priority: "High",
      date: "2023-07-31",
    },
    // Add more inquiries as needed
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inquiry Management</h1>
        <p className="text-gray-600">
          Handle and respond to inquiries and complaints
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600">Total Inquiries</div>
          <div className="text-2xl font-bold text-blue-700">156</div>
          <div className="text-sm text-blue-600">This Month</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600">Resolved</div>
          <div className="text-2xl font-bold text-green-700">132</div>
          <div className="text-sm text-green-600">85% Resolution Rate</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">18</div>
          <div className="text-sm text-yellow-600">Require Attention</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600">Critical</div>
          <div className="text-2xl font-bold text-red-700">6</div>
          <div className="text-sm text-red-600">High Priority</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
              <FilterIcon className="h-4 w-4 mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        inquiry.type === "Complaint"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {inquiry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inquiry.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        inquiry.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : inquiry.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {inquiry.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        inquiry.status === "New"
                          ? "bg-green-100 text-green-800"
                          : inquiry.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inquiry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <MessageSquareIcon className="h-4 w-4" />
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
  );
}
