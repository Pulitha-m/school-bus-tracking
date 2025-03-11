import React from "react";
import {
  BarChart3Icon,
  TrendingUpIcon,
  MessageSquareIcon,
  StarIcon,
} from "lucide-react";

export function FeedbackAnalysis() {
  const metrics = {
    totalFeedbacks: 324,
    averageRating: 4.2,
    positivePercentage: 85,
    negativePercentage: 15,
  };

  const monthlyTrends = [
    {
      month: "Jan",
      count: 45,
      rating: 4.1,
    },
    {
      month: "Feb",
      count: 52,
      rating: 4.0,
    },
    {
      month: "Mar",
      count: 58,
      rating: 4.3,
    },
    {
      month: "Apr",
      count: 48,
      rating: 4.2,
    },
    {
      month: "May",
      count: 62,
      rating: 4.4,
    },
    {
      month: "Jun",
      count: 59,
      rating: 4.2,
    },
  ];

  const categories = [
    {
      name: "Service Quality",
      percentage: 45,
    },
    {
      name: "Driver Behavior",
      percentage: 25,
    },
    {
      name: "Timeliness",
      percentage: 20,
    },
    {
      name: "Safety",
      percentage: 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Feedback Analysis</h1>
        <p className="text-gray-600">Analyze feedback trends and patterns</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Feedback</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {metrics.totalFeedbacks}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageSquareIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Average Rating</p>
              <h3 className="text-2xl font-bold text-green-700">
                {metrics.averageRating}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <StarIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm">Positive Feedback</p>
              <h3 className="text-2xl font-bold text-amber-700">
                {metrics.positivePercentage}%
              </h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Negative Feedback</p>
              <h3 className="text-2xl font-bold text-red-700">
                {metrics.negativePercentage}%
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <BarChart3Icon className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Monthly Trends
          </h2>
          <div className="h-64 flex items-end justify-between px-2">
            {monthlyTrends.map((month) => (
              <div
                key={month.month}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className="w-12 bg-amber-200 rounded-t"
                  style={{
                    height: `${(month.count / 70) * 100}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-600">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Feedback Categories
          </h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{category.name}</span>
                  <span>{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
