import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  ShareIcon,
  UsersIcon,
  LinkIcon,
  CopyIcon,
  QrCodeIcon,
  CheckIcon,
  XIcon,
  MapIcon,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const StudentLocationTracking = () => {
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const [activeTab, setActiveTab] = useState("track");
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      location: [40.7128, -74.006],
    },
    {
      id: 2,
      name: "Emma Wilson",
      location: [40.7148, -74.0068],
    },
    {
      id: 3,
      name: "Tyler Brown",
      location: [40.7138, -74.0055],
    },
  ]);
  const [sharedWith] = useState([
    {
      id: 1,
      name: "Parent Group A",
      type: "group",
      members: 15,
    },
    {
      id: 2,
      name: "Route B Parents",
      type: "group",
      members: 12,
    },
    {
      id: 3,
      name: "School Admin",
      type: "admin",
      members: 3,
    },
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    }
  }, []);

  const toggleSharing = () => {
    setIsSharing(!isSharing);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText("https://schoolbus.app/track/ABC123");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Location Tracking</h1>
        <p className="text-gray-600">Track and share location with students</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "track"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("track")}
            >
              <MapIcon size={16} className="inline mr-2" />
              Track Location
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "share"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("share")}
            >
              <ShareIcon size={16} className="inline mr-2" />
              Share Location
            </button>
          </div>
        </div>
        {activeTab === "track" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2">
              <div className="h-[500px] z-0 rounded-lg overflow-hidden border">
                <MapContainer
                  center={currentLocation}
                  zoom={13}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={currentLocation}>
                    <Popup>Your current location</Popup>
                  </Marker>
                  {students.map((student) => (
                    <Marker key={student.id} position={student.location}>
                      <Popup>{student.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Students on Route
                </h3>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between bg-white p-3 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ID: ST{student.id}2345
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "share" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-lg border ${
                    isSharing
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isSharing && (
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                      )}
                      <span
                        className={`font-medium ${
                          isSharing ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {isSharing
                          ? "Currently sharing location"
                          : "Location sharing is off"}
                      </span>
                    </div>
                    <button
                      onClick={toggleSharing}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        isSharing
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {isSharing ? "Stop Sharing" : "Start Sharing"}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Sharing Link
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      readOnly
                      value="https://schoolbus.app/track/ABC123"
                      className="flex-1 p-2 border rounded-l-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-4 py-2 bg-amber-500 text-white rounded-r-lg hover:bg-amber-600 flex items-center"
                    >
                      {copySuccess ? (
                        <CheckIcon size={16} className="mr-1" />
                      ) : (
                        <CopyIcon size={16} className="mr-1" />
                      )}
                      {copySuccess ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
                  <div className="w-48 h-48 bg-white rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCodeIcon size={64} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code to track the bus location
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Shared With
                  </h3>
                  <div className="space-y-3">
                    {sharedWith.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {group.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {group.members} members
                          </p>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Sharing Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Share location history
                      </span>
                      <button className="text-amber-600 hover:text-amber-700 text-sm">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Share with parents
                      </span>
                      <button className="text-amber-600 hover:text-amber-700 text-sm">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
