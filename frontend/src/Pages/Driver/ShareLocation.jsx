import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ShareIcon } from "lucide-react";
import backendUrl from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

const ShareLocation = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [busId, setBusId] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const locationInterval = useRef(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("user");
    if (!sessionData) return;

    const { id } = JSON.parse(sessionData);

    axios
      .get(`${backendUrl}/getDriverById/${id}`)
      .then((res) => setBusId(res.data.busId))
      .catch(() => toast.error("Failed to fetch bus info"));
  }, []);

  useEffect(() => {
    if (!isSharing) {
      clearInterval(locationInterval.current);
      return;
    }

    getLocation(true);

    locationInterval.current = setInterval(() => {
      getLocation(false);
    }, 5000);

    return () => clearInterval(locationInterval.current);
  }, [isSharing, busId]);

  const getLocation = (initial = false) => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        };
        setCurrentLocation(data);
        sendLocationToBackend(data, initial);
      },
      (err) => {
        console.error(err);
        toast.error("Failed to get location");
      }
    );
  };

  const sendLocationToBackend = async (location, isInitial) => {
    if (!busId) return toast.error("Bus ID not found");

    try {
      const res = await axios.post(
        `${backendUrl}/update-location/${busId}`,
        location
      );
      setSubscriberCount(res.data.subscribers || 0);

      if (isInitial) {
        toast.success(
          `Sharing started to ${res.data.subscribers || 0} subscribers`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Location update failed");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Share Location</h1>
      <p className="text-gray-600 mb-6">
        Share your real-time location with parents and school staff.
      </p>

      {/* Location Sharing Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="bg-white shadow rounded-lg p-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  isSharing ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <ShareIcon
                  className={`h-6 w-6 ${
                    isSharing ? "text-green-600" : "text-gray-600"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Location Sharing
                </h2>
                <p
                  className={`text-sm ${
                    isSharing ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isSharing
                    ? `Sharing with ${subscriberCount} active ${
                        subscriberCount === 1 ? "subscriber" : "subscribers"
                      }`
                    : "Location sharing is paused"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSharing(!isSharing);
                if (!isSharing) {
                  toast.info("Location sharing started");
                } else {
                  toast.info("Location sharing stopped");
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isSharing
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isSharing ? "Stop Sharing" : "Start Sharing"}
            </button>
          </div>

          {isSharing && currentLocation && (
            <div className="mt-4 text-sm text-gray-700">
              <div>Latitude: {currentLocation.latitude.toFixed(6)}</div>
              <div>Longitude: {currentLocation.longitude.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Last updated:{" "}
                {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {/* Active Subscribers Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 w-full lg:w-80 shadow">
          <h2 className="text-lg font-semibold text-green-700 mb-2">
            Active Subscribers
          </h2>
          <p className="text-3xl font-bold text-green-800">{subscriberCount}</p>
          <p className="text-sm text-green-600 mt-1">Currently connected</p>
        </div>
      </div>

      {/* Map Section */}
      {isSharing && currentLocation && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Current Bus Location
            </h3>
            <MapContainer
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={16}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[currentLocation.latitude, currentLocation.longitude]}
              >
                <Popup>Bus is here</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareLocation;
