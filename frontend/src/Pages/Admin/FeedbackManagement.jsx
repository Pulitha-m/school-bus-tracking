import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  MessageSquareIcon,
  StarIcon,
} from "lucide-react";

export function FeedbackManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const feedbacks = [
    {
      id: 1,
      from: "Parent",
      name: "Alice Thompson",
      subject: "Bus Service Feedback",
      rating: 4,
      status: "New",
      date: "2023-08-01",
    },
    {
      id: 2,
      from: "Driver",
      name: "Michael Davis",
      subject: "Route Suggestion",
      rating: 5,
      status: "In Progress",
      date: "2023-07-30",
    },
  ];
  const feedbackMetrics = {
    totalFeedback: 324,
    averageRating: 4.2,
    responseRate: 95,
    resolutionRate: 88,
    averageResponseTime: "4.5 hours",
  };
  const categoryBreakdown = [
    {
      category: "Bus Service",
      count: 145,
      percentage: 45,
    },
    {
      category: "Driver Behavior",
      count: 82,
      percentage: 25,
    },
    {
      category: "Schedule",
      count: 56,
      percentage: 17,
    },
    {
      category: "Safety",
      count: 41,
      percentage: 13,
    },
  ];
  const monthlyRatings = [
    {
      month: "Jan",
      rating: 4.1,
    },
    {
      month: "Feb",
      rating: 4.0,
    },
    {
      month: "Mar",
      rating: 4.3,
    },
    {
      month: "Apr",
      rating: 4.2,
    },
    {
      month: "May",
      rating: 4.4,
    },
    {
      month: "Jun",
      rating: 4.2,
    },
  ];

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Feedback Management
        </h1>
        <p className="text-gray-600">
          Manage and analyze feedback from parents and staff
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Average Rating</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  {feedbackMetrics.averageRating}
                </h3>
                <StarIcon className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <StarIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">+0.2 from last month</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Total Feedback</p>
              <h3 className="text-2xl font-bold text-green-700">
                {feedbackMetrics.totalFeedback}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquareIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">Response Rate</p>
              <h3 className="text-2xl font-bold text-amber-700">
                {feedbackMetrics.responseRate}%
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <MessageSquareIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm">Resolution Rate</p>
              <h3 className="text-2xl font-bold text-purple-700">
                {feedbackMetrics.resolutionRate}%
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageSquareIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search feedback..."
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
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {feedback.name}
                    </div>
                    <div className="text-sm text-gray-500">{feedback.from}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-4 w-4 ${
                            index < feedback.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        feedback.status === "New"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {feedback.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.date}
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
