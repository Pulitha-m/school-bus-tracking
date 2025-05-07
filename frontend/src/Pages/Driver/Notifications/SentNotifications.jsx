import React, { useEffect, useState } from "react";
import {
  InboxIcon,
  ClockIcon,
  FilterIcon,
  PencilIcon,
  TrashIcon,
  AlertCircleIcon,
  InfoIcon,
  MessageSquareIcon,
  XIcon,
  SaveIcon,
} from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../../config/config";

export default function SentNotifications() {
  const [sentNotifications, setSentNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const [editingNotification, setEditingNotification] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editDriverUsername, setEditDriverUsername] = useState("");
  const [editLevel, setEditLevel] = useState("INFO");

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");

    if (sessionData) {
      const { id } = JSON.parse(sessionData);

      axios
        .get(`${backendUrl}/getDriverById/${id}`, { withCredentials: true })
        .then((res) => {
          if (res.data.busId) {
            fetchNotifications(res.data.busId);
            // fetchLatest(res.data.busId);
          } else {
            toast.error("Bus not assigned to this driver!");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch driver info.");
          setLoading(false);
        });
    } else {
      toast.error("No session found!");
      setLoading(false);
    }
  }, []);

  const fetchNotifications = (busId) => {
    axios
      .get(`${backendUrl}/api/notifications/bus/${busId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setSentNotifications(sorted);
        setFilteredNotifications(sorted);
        setLoading(false);
      })

      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch sent notifications.");
        setLoading(false);
      });
  };

  // const fetchLatest = (busId) => {
  //   axios
  //     .get(`${backendUrl}/api/notifications/getLatestByBusId/${busId}`, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       if (res.data) {
  //         console.log("Latest notification:", res.data);
  //         setSentNotifications([res.data]);
  //         setFilteredNotifications([res.data]);
  //       } else {
  //         setSentNotifications([]);
  //         setFilteredNotifications([]);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       toast.error("Failed to fetch sent notifications.");
  //       setLoading(false);
  //     });
  // };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "ALL") {
      setFilteredNotifications(sentNotifications);
    } else {
      setFilteredNotifications(
        sentNotifications.filter((n) => n.level === selectedFilter)
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      axios
        .delete(`${backendUrl}/api/notifications/delete/${id}`, {
          withCredentials: true,
        })
        .then(() => {
          toast.success("Notification deleted!");
          setSentNotifications((prev) => prev.filter((n) => n.id !== id));
          setFilteredNotifications((prev) => prev.filter((n) => n.id !== id));
        })
        .catch(() => {
          toast.error("Failed to delete notification.");
        });
    }
  };

  const handleEditClick = (notification) => {
    setEditingNotification(notification);
    setEditTitle(notification.title);
    setEditMessage(notification.message);
    setEditDriverUsername(notification.driverUsername || "");
    setEditLevel(notification.level || "INFO"); // <- Add this line
  };

  const handleEditSave = () => {
    if (
      !editTitle.trim() ||
      !editMessage.trim() ||
      !editDriverUsername.trim()
    ) {
      toast.error("Title, Message, and Driver Username cannot be empty!");
      return;
    }

    axios
      .put(
        `${backendUrl}/api/notifications/update/${editingNotification.id}`,
        {
          ...editingNotification,
          title: editTitle.trim(),
          message: editMessage.trim(),
          driverUsername: editDriverUsername.trim(),
          timestamp: new Date(),
          level: editLevel,
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Notification updated!");
        setEditingNotification(null);
        fetchNotifications(editingNotification.busId);
      })
      .catch(() => {
        toast.error("Failed to update notification.");
      });
  };

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
    <>
      <div className="space-y-6 mt-6">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-4">
          <FilterIcon size={20} className="text-gray-500" />
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Notifications</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading notifications...
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4 relative bg-yellow-50"
            >
              {/* Small Circle Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow-sm mr-4">
                {getIcon(notification.level)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {notification.title}
                      {notification.level === "CRITICAL" && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                          Critical
                        </span>
                      )}
                      {notification.level === "WARNING" && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-yellow-600 bg-yellow-100 rounded-full">
                          Warning
                        </span>
                      )}
                      {notification.level === "INFO" && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                          Info
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      To: Assigned Bus
                      {/* <br /> Rating : {notification.rating} */}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ClockIcon size={14} />
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{notification.message}</p>

                {/* Edit + Delete buttons */}
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => handleEditClick(notification)}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-800"
                  >
                    <PencilIcon size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <InboxIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              No notifications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filter or sending a new notification.
            </p>
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
              value={editDriverUsername}
              onChange={(e) => {
                let input = e.target.value;
                input = input.replace(/[^A-Za-z\s]/g, ""); // Remove non-letters/spaces
                input = input.replace(/\s+/g, " ").trimStart(); // Normalize spacing
                setEditDriverUsername(input);
              }}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Driver Username"
            />

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Title"
            />

            {/* Level Selection */}
            <select
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="INFO">🔵 Info - General Notice</option>
              <option value="WARNING">🟠 Warning - Important Notice</option>
              <option value="CRITICAL">
                🔴 Critical - Immediate Attention
              </option>
            </select>

            <textarea
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              rows={5}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              place
              holder="Message"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingNotification(null)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XIcon size={16} />
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <SaveIcon size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
