import React, { useEffect, useState } from "react";
import {
  InboxIcon,
  PlusIcon,
  SendIcon,
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  MessageSquareIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";
import AddNotification from "./Notifications/AddNotification";
import SentNotifications from "./Notifications/SentNotifications";

export default function NotificationManagement() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [userBusId, setUserBusId] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdminSent, setShowAdminSent] = useState(true);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (sessionData) {
      const { busId, username } = JSON.parse(sessionData);
      setUserBusId(busId);
      setUserUsername(username.startsWith("@") ? username : "@" + username);
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
    .filter((n) => {
      if (showAdminSent) {
        return (
          (n.busId === userBusId && n.driverUsername === "@admin") ||
          n.busId === "ADMIN"
        );
      } else {
        return n.driverUsername === userUsername;
      }
    })
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
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Notification Management
        </h1>
        <p className="text-gray-600">Manage and track notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("inbox")}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  activeTab === "inbox"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <InboxIcon size={18} className="mr-1" />
                Inbox
              </button>
              <button
                onClick={() => setActiveTab("compose")}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  activeTab === "compose"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <PlusIcon size={18} className="mr-1" />
                Compose
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`px-4 py-2 rounded-lg transition flex items-center ${
                  activeTab === "sent"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <SendIcon size={18} className="mr-1" />
                Sent
              </button>
            </div>
          </div>
          {activeTab === "inbox" && (
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
          )}
        </div>

        {activeTab === "inbox" ? (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => setShowAdminSent(true)}
                className={`px-4 py-2 rounded-l-lg ${
                  showAdminSent
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Admin Sent
              </button>
            </div>
            {loading ? (
              <div className="p-8 text-center">Loading notifications...</div>
            ) : filteredNotifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Icon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Timestamp
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
                    {filteredNotifications.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getIcon(n.level)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {n.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {n.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(n.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              n.read
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {n.read ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleMarkReadToggle(n.id)}
                            className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            {n.read ? "Mark Unread" : "Mark Read"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <InboxIcon className="text-gray-400 mx-auto" size={48} />
                <p className="text-gray-500 mt-2">No notifications found</p>
              </div>
            )}
          </div>
        ) : activeTab === "compose" ? (
          <AddNotification />
        ) : (
          <SentNotifications />
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
