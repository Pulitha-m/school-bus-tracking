import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  InboxIcon,
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  MessageSquareIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [studentBusId, setStudentBusId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (sessionData) {
      const { busId } = JSON.parse(sessionData);
      setStudentBusId(busId);
      fetchNotifications();
    } else {
      toast.error("No session found!");
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/notifications/getAll`, {
        withCredentials: true,
      });
      const withReadFlag = res.data.map((n) => ({ ...n, read: false }));
      setNotifications(withReadFlag);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReadToggle = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications
    .filter(
      (n) =>
        (n.busId === studentBusId && n.driverUsername === "@admin") ||
        n.busId === "ADMIN"
    )
    .filter((n) => {
      if (selectedFilter === "unread") return !n.read;
      if (selectedFilter === "alerts") return n.level === "CRITICAL";
      if (selectedFilter === "info") return n.level === "INFO";
      return true;
    })
    .filter((n) => {
      const q = searchQuery.toLowerCase();
      return (
        n.title?.toLowerCase().includes(q) ||
        n.message?.toLowerCase().includes(q)
      );
    });

  const getIcon = (level) => {
    switch (level) {
      case "CRITICAL":
        return <AlertCircleIcon className="text-red-500" size={20} />;
      case "WARNING":
        return <AlertCircleIcon className="text-yellow-500" size={20} />;
      case "INFO":
        return <InfoIcon className="text-blue-500" size={20} />;
      default:
        return <MessageSquareIcon className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h2>
            <p className="text-gray-500 text-sm">
              View notifications sent by Admin or related to your bus
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="alerts">Critical Alerts</option>
            <option value="info">Information</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center text-gray-400 py-8">
            Loading notifications...
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 relative ${
                n.read ? "bg-white" : "bg-yellow-50"
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm mr-4">
                {getIcon(n.level)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{n.message}</p>

                    {/* Sent By */}
                    <p className="text-xs text-gray-500">
                      Sent by:{" "}
                      <span className="font-semibold">{n.driverUsername}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Read/Unread Toggle */}
                <div className="flex justify-end items-center mt-4">
                  <button
                    onClick={() => handleMarkReadToggle(n.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <CheckCircleIcon size={16} />
                    {n.read ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <InboxIcon className="text-gray-400 mx-auto" size={48} />
            <p className="text-gray-500 mt-2">No notifications found</p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
