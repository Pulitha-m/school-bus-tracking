import React, { useState } from "react";
import {
  BellIcon,
  AlertTriangleIcon,
  InfoIcon,
  MapIcon,
  CloudSnowIcon,
  CheckCircleIcon,
  XIcon,
} from "lucide-react";

export function NotificationsSection() {
  const initialNotifications = [
    {
      id: 1,
      type: "alert",
      title: "Bus Delay Alert",
      message:
        "Bus #42 is running 10 minutes late due to heavy traffic on Main Street.",
      date: "2023-06-14T08:30:00",
      read: false,
    },
    {
      id: 2,
      type: "route",
      title: "Route Change",
      message:
        "Temporary route modification due to road construction on Oak Avenue. New pickup point will be at the corner of Maple Street.",
      date: "2023-06-14T07:15:00",
      read: false,
    },
    {
      id: 3,
      type: "weather",
      title: "Weather Advisory",
      message:
        "Expected heavy snow tomorrow morning. Bus service might be delayed. Please check updates before heading to bus stop.",
      date: "2023-06-13T18:00:00",
      read: false,
    },
    {
      id: 4,
      type: "info",
      title: "Schedule Update",
      message:
        "Early dismissal next Friday. Afternoon bus service will begin 2 hours earlier than usual.",
      date: "2023-06-13T14:20:00",
      read: true,
    },
    {
      id: 5,
      type: "success",
      title: "Bus Service Normal",
      message: "All bus routes are running on schedule this morning.",
      date: "2023-06-13T06:45:00",
      read: true,
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangleIcon className="text-red-500" size={20} />;
      case "info":
        return <InfoIcon className="text-blue-500" size={20} />;
      case "route":
        return <MapIcon className="text-amber-500" size={20} />;
      case "weather":
        return <CloudSnowIcon className="text-gray-500" size={20} />;
      case "success":
        return <CheckCircleIcon className="text-green-500" size={20} />;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || (filter === "unread" && !notif.read)
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "unread"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm border ${
              notification.read ? "border-gray-100" : "border-amber-200"
            } p-4 transition-colors ${!notification.read && "bg-amber-50"}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.date)}
                    </span>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "unread"
                ? "You're all caught up!"
                : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
