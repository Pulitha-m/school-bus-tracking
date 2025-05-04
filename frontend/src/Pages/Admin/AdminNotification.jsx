import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- ADDED
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";
import {
  SearchIcon,
  BellIcon,
  AlertTriangleIcon,
  InfoIcon,
  TrashIcon,
  PencilIcon,
  XIcon,
  SaveIcon,
} from "lucide-react";

export default function AdminNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0,
  });
  const [editingNotification, setEditingNotification] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const navigate = useNavigate(); // <-- ADDED

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/notifications/getAll`, {
        withCredentials: true,
      });
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sorted);
      calculateAnalytics(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    const total = data.length;
    const critical = data.filter((n) => n.level === "CRITICAL").length;
    const warning = data.filter((n) => n.level === "WARNING").length;
    const info = data.filter((n) => n.level === "INFO").length;
    setAnalytics({ total, critical, warning, info });
  };

  const deleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`${backendUrl}/api/notifications/delete/${id}`, {
          withCredentials: true,
        });
        loadNotifications();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete notification");
      }
    }
  };

  const handleEditClick = (notification) => {
    setEditingNotification(notification);
    setEditTitle(notification.title);
    setEditMessage(notification.message);
  };

  const handleEditSave = () => {
    if (!editTitle.trim() || !editMessage.trim()) {
      toast.error("Title and Message cannot be empty!");
      return;
    }
    axios
      .put(
        `${backendUrl}/api/notifications/update/${editingNotification.id}`,
        {
          ...editingNotification,
          title: editTitle.trim(),
          message: editMessage.trim(),
          timestamp: new Date(),
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Notification updated!");
        setEditingNotification(null);
        loadNotifications();
      })
      .catch(() => {
        toast.error("Failed to update notification.");
      });
  };

  const filteredNotifications = notifications.filter((n) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      n.title?.toLowerCase().includes(lowerSearch) ||
      n.message?.toLowerCase().includes(lowerSearch) ||
      n.busId?.toLowerCase().includes(lowerSearch) ||
      n.driverUsername?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Notifications
        </h1>
        <p className="text-gray-600">
          View and manage all system notifications
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm">Total Notifications</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {analytics.total}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BellIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm">Critical</p>
              <h3 className="text-2xl font-bold text-red-700">
                {analytics.critical}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangleIcon className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm">Warning</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                {analytics.warning}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangleIcon className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm">Info</p>
              <h3 className="text-2xl font-bold text-green-700">
                {analytics.info}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <InfoIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Notification */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* ADD SEND NOTIFICATION BUTTON */}
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white transition-colors"
              onClick={() => navigate("/admin/notifications/sendNotification")} // <-- Your new route
            >
              <BellIcon className="h-4 w-4 mr-1" />
              <span>Send Notification</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center">Loading notifications...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No matching notifications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bus ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sent By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {n.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {n.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {n.busId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {n.driverUsername}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          n.level === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : n.level === "WARNING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {n.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(n.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm flex space-x-2">
                      <button
                        onClick={() => handleEditClick(n)}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-800"
                      >
                        <PencilIcon size={16} /> Edit
                      </button>
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingNotification && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Notification
            </h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />
            <textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              rows={5}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Message"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingNotification(null)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XIcon size={16} /> Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <SaveIcon size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
