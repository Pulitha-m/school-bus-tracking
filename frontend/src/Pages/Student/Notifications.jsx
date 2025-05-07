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
    if (!sessionData) {
      toast.error("No session found!");
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(sessionData);

    axios
      .get(`${backendUrl}/getStudentById/${id}`, { withCredentials: true })
      .then((res) => {
        const student = res.data;
        console.log("Student data:", student);
        setStudentBusId(student.busId); // e.g. 7
        fetchNotifications();
      })
      .catch((err) => {
        console.error("Error loading student data:", err);
        toast.error("Student data not found!");
        setLoading(false);
      });
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
        n.busId?.toString() === studentBusId?.toString() || // Ensure string comparison
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
    })
    // Sort by timestamp, latest first
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getIcon = (level) => {
    switch (level) {
      case "CRITICAL":
        return <AlertCircleIcon className="text-red-600" size={24} />;
      case "WARNING":
        return <AlertCircleIcon className="text-yellow-600" size={24} />;
      case "INFO":
        return <InfoIcon className="text-blue-600" size={24} />;
      default:
        return <MessageSquareIcon className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Notifications
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Stay updated with messages from Admin or your bus
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full sm:w-auto">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="alerts">Critical Alerts</option>
              <option value="info">Information</option>
            </select>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`relative flex items-start border-l-4 ${
                    n.level === "CRITICAL"
                      ? "border-red-500"
                      : n.level === "WARNING"
                      ? "border-yellow-500"
                      : "border-blue-500"
                  } rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 ${
                    n.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-200 mr-4">
                    {getIcon(n.level)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {n.title}
                        </h3>
                        <p className="text-gray-700 text-sm mt-1">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Sent by:{" "}
                          <span className="font-medium">
                            {n.driverUsername}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Read/Unread Toggle */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleMarkReadToggle(n.id)}
                        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                      >
                        <CheckCircleIcon size={18} />
                        {n.read ? "Mark as Unread" : "Mark as Read"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <InboxIcon className="text-gray-400 mx-auto" size={48} />
              <p className="text-gray-600 mt-4 text-lg">
                No notifications found
              </p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
