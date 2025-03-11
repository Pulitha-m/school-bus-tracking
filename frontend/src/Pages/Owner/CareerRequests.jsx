import React, { useState } from "react";
import { SearchIcon, FilterIcon, UserIcon } from "lucide-react";
import TableMobileCard from "./components/TableMobileCard";

const CareerRequests = () => {
  const applications = [
    {
      id: 1,
      name: "Thomas Reynolds",
      email: "thomas.r@example.com",
      position: "School Bus Driver",
      experience: "5 years",
      status: "Under Review",
      date: "May 15, 2023",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      position: "School Bus Driver",
      experience: "3 years",
      status: "Pending",
      date: "May 14, 2023",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Career Requests
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage driver applications and career inquiries
        </p>
      </div>
      <div className="space-y-3 mb-4 md:space-y-0 md:flex md:items-center md:justify-between md:mb-6">
        <div className="relative flex-1 md:max-w-md">
          <input
            type="text"
            placeholder="Search applications..."
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
        </div>
      </div>
      <div className="block md:hidden">
        {applications.map((application) => (
          <TableMobileCard
            key={application.id}
            data={application}
            config={[
              {
                label: "Applicant",
                key: "name",
                render: (value) => (
                  <div className="flex items-center">
                    <div className="p-2 mr-3 text-white bg-blue-500 rounded-full">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{value}</p>
                      <p className="text-sm text-gray-500">
                        {application.email}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                label: "Position",
                key: "position",
              },
              {
                label: "Experience",
                key: "experience",
              },
              {
                label: "Status",
                key: "status",
                render: (value) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {value}
                  </span>
                ),
              },
              {
                label: "Applied Date",
                key: "date",
              },
            ]}
          />
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-4">Applicant</th>
                <th className="p-4">Position</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Status</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 mr-3 text-white bg-blue-500 rounded-full">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{application.name}</p>
                        <p className="text-sm text-gray-500">
                          {application.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{application.position}</td>
                  <td className="p-4">{application.experience}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                      {application.status}
                    </span>
                  </td>
                  <td className="p-4">{application.date}</td>
                  <td className="p-4">
                    <button className="px-3 py-1 mr-2 text-sm text-white bg-amber-500 rounded-md">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareerRequests;
