import React, { useEffect, useState } from "react";
import { SendIcon, XIcon } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import backendUrl from "../../../config/config"; // adjust if needed

export default function AddNotification() {
  const [busId, setBusId] = useState("");
  const [driverUsername, setDriverUsername] = useState("@");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("INFO");
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (sessionData) {
      const { id } = JSON.parse(sessionData);

      axios
        .get(`${backendUrl}/getDriverById/${id}`, { withCredentials: true })
        .then((res) => {
          if (res.data.busId) {
            setBusId(res.data.busId); // ✅ Save actual busId
          } else {
            toast.error("Bus not assigned to this driver!");
          }
        })
        .catch(() => toast.error("Failed to fetch driver information"));
    }

    const today = new Date().toISOString().split("T")[0];
    setTimestamp(today);
  }, []);

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
    const input = e.target.value;
    const cleaned = input.replace(/[^A-Za-z0-9 .,'"-]/g, "");
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
    if (!driverUsername || driverUsername.trim() === "@")
      newErrors.driverUsername = "Driver Username is required";
    if (!title) newErrors.title = "Title is required";
    if (!message) newErrors.message = "Message is required";
    if (!busId) newErrors.busId = "Bus ID is missing";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const payload = {
      busId: busId, // ✅ Send real busId
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
      });

      toast.success("Notification sent successfully!");

      setTimeout(() => {
        handleClear(); // ✅ Clear after showing success
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDriverUsername("@");
    setTitle("");
    setMessage("");
    setLevel("INFO");
    setErrors({});
    const today = new Date().toISOString().split("T")[0];
    setTimestamp(today);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 mt-6 ${shake ? "animate-shake" : ""}`}
      >
        <div className="space-y-4">
          {/* Hidden Bus ID */}
          <input type="hidden" value={busId} />

          {/* Assigned Bus ID */}
          {busId && (
            <div className="text-sm text-gray-500 mb-2">
              Assigned Bus ID:{" "}
              <span className="font-semibold text-gray-700">{busId}</span>
            </div>
          )}

          {/* Driver Username */}
          <div>
            <input
              type="text"
              placeholder="Driver Username"
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

          {/* Priority Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="INFO">🔵 Info - General Notice</option>
            <option value="WARNING">🟠 Warning - Important Notice</option>
            <option value="CRITICAL">🔴 Critical - Immediate Attention</option>
          </select>

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
          <input
            type="text"
            value={timestamp}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-500"
          />
        </div>

        {/* Submit and Clear Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <XIcon size={18} />
            Clear
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
