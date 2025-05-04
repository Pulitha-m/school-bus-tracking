import React, { useEffect, useState } from "react";
import { SendIcon, XIcon, ArrowLeftIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../../config/config";

export default function AdminSendNotification() {
  const [busId, setBusId] = useState("");
  const [driverUsername, setDriverUsername] = useState("@");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("INFO");
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate(); // ✅ useNavigate hook

  useEffect(() => {
    fetchBuses();
    const today = new Date().toISOString().split("T")[0];
    setTimestamp(today);
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${backendUrl}/getAllBusses`, {
        withCredentials: true,
      });
      setBuses(res.data.map((bus) => bus.busId.toString()));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load buses.");
    }
  };

  const handleDriverUsernameChange = (e) => {
    let input = e.target.value;
    if (!input.startsWith("@")) {
      input = "@" + input;
    }
    const cleaned = "@" + input.slice(1).replace(/[^A-Za-z]/g, "");
    setDriverUsername(cleaned);
    setErrors((prev) => ({ ...prev, driverUsername: "" }));
  };

  const handleTitleChange = (e) => {
    const cleaned = e.target.value.replace(/[^A-Za-z0-9 .,'"-]/g, "");
    setTitle(cleaned);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setErrors((prev) => ({ ...prev, message: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!busId) newErrors.busId = "Please select a Bus ID.";
    if (!driverUsername || driverUsername.trim() === "@")
      newErrors.driverUsername = "Driver Username is required.";
    if (!title) newErrors.title = "Title is required.";
    if (!message) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const payload = {
      busId: busId,
      driverUsername: driverUsername.trim(),
      title: title.trim(),
      message: message.trim(),
      level,
      timestamp: new Date(),
    };

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/notifications`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Notification sent successfully!");
      setTimeout(() => {
        navigate("/admin/notifications"); // ✅ After success, go back
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBusId("");
    setDriverUsername("@");
    setTitle("");
    setMessage("");
    setLevel("INFO");
    setErrors({});
    const today = new Date().toISOString().split("T")[0];
    setTimestamp(today);
  };

  const handleCancel = () => {
    navigate("/admin/notifications"); // ✅ Direct cancel
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 mt-6 ${shake ? "animate-shake" : ""}`}
      >
        <div className="space-y-4">
          {/* Bus ID */}
          <div>
            <select
              value={busId}
              onChange={(e) => {
                setBusId(e.target.value);
                setErrors((prev) => ({ ...prev, busId: "" }));
              }}
              className={`w-full border ${
                errors.busId ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">-- Select Bus ID or Admin --</option>
              <option value="ADMIN">ADMIN (Global Notification)</option>
              {buses.map((busId) => (
                <option key={busId} value={busId}>
                  {busId}
                </option>
              ))}
            </select>
            {errors.busId && (
              <p className="text-red-500 text-sm mt-1">{errors.busId}</p>
            )}
          </div>

          {/* Driver Username */}
          <div>
            <input
              type="text"
              placeholder="Driver Username (start with @)"
              value={driverUsername}
              onChange={handleDriverUsernameChange}
              className={`w-full border ${
                errors.driverUsername ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.driverUsername && (
              <p className="text-red-500 text-sm mt-1">
                {errors.driverUsername}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className={`w-full border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Level */}
          <div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INFO">🔵 Info - General Notice</option>
              <option value="WARNING">🟠 Warning - Important Notice</option>
              <option value="CRITICAL">
                🔴 Critical - Immediate Attention
              </option>
            </select>
          </div>

          {/* Message */}
          <div>
            <textarea
              placeholder="Message"
              value={message}
              onChange={handleMessageChange}
              rows={5}
              className={`w-full border ${
                errors.message ? "border-red-500" : "border-gray-300"
              } rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Timestamp */}
          <div>
            <input
              type="text"
              value={timestamp}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between flex-wrap gap-2 mt-6">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <XIcon size={18} />
            Clear
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <ArrowLeftIcon size={18} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                Sending...
              </>
            ) : (
              <>
                <SendIcon size={18} />
                Send Notification
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
