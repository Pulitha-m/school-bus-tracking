import React from "react";
import {
  BellIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircleIcon,
  XIcon,
} from "lucide-react";

export const Notifications = () => {
  const notifications = [
    {
      id: "1",
      type: "alert",
      title: "Route Change",
      message:
        "Your route has been modified for tomorrow due to road construction on Main St.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Schedule Update",
      message:
        "School dismissal will be 30 minutes early on Friday, October 20th.",
      time: "1 day ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Payment Received",
      message:
        "Your monthly salary of $1,250.00 has been deposited to your account.",
      time: "3 days ago",
      read: false,
    },
    {
      id: "4",
      type: "info",
      title: "New Student Added",
      message:
        "A new student, Emily Parker (6th Grade), has been added to your route.",
      time: "1 week ago",
      read: true,
    },
    {
      id: "5",
      type: "alert",
      title: "Vehicle Maintenance",
      message:
        "Your bus is scheduled for routine maintenance this Saturday, October 21st.",
      time: "1 week ago",
      read: true,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-600">Stay updated with important information</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <BellIcon className="mr-2 h-5 w-5 text-amber-500" />
            Recent Notifications
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              3
            </span>
          </h2>
          <button className="text-sm text-amber-600 hover:text-amber-800">
            Mark all as read
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 flex ${
                notification.read ? "bg-white" : "bg-amber-50"
              }`}
            >
              <div className="flex-shrink-0 mr-4">
                {notification.type === "alert" && (
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                )}
                {notification.type === "info" && (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <InfoIcon className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                {notification.type === "success" && (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button className="text-gray-400 hover:text-gray-500">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t text-center">
          <button className="text-sm text-amber-600 hover:text-amber-800">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};
