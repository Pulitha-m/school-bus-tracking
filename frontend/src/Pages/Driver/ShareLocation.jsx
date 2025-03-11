import React, { useEffect, useState } from "react";
import {
  ShareIcon,
  QrCodeIcon,
  CopyIcon,
  CheckIcon,
  TrashIcon,
  UsersIcon,
  PlusIcon,
} from "lucide-react";

export const ShareLocation = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const [sharedGroups] = useState([
    {
      id: 1,
      name: "Morning Route Parents",
      members: 25,
      active: true,
    },
    {
      id: 2,
      name: "Afternoon Route Parents",
      members: 18,
      active: true,
    },
    {
      id: 3,
      name: "School Administrators",
      members: 5,
      active: false,
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
    navigator.clipboard.writeText("https://schoolbus.app/share/ABC123");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Share Location</h1>
        <p className="text-gray-600">
          Share your real-time location with parents and school staff
        </p>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Sharing Controls */}
        <div className="space-y-6">
          {/* Sharing Status Card */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden`}>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
                      ? "Currently sharing your location"
                      : "Location sharing is paused"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSharing}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isSharing
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {isSharing ? "Stop Sharing" : "Start Sharing"}
              </button>
            </div>
            {isSharing && (
              <div className="border-t border-gray-100 bg-green-50 px-6 py-4">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-sm text-green-700">
                    Sharing with {sharedGroups.filter((g) => g.active).length}{" "}
                    groups
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Quick Share Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Share
            </h2>
            <div className="space-y-4">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value="https://schoolbus.app/share/ABC123"
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
                <div className="w-40 h-40 bg-white rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <QrCodeIcon size={64} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Scan this QR code to track the bus location
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - Shared Groups */}
        <div className="space-y-6">
          {/* Shared Groups Card */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-amber-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Shared Groups
                </h2>
              </div>
              <button className="text-sm text-amber-600 hover:text-amber-700 flex items-center">
                <PlusIcon size={16} className="mr-1" />
                Add Group
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {sharedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">
                          {group.name}
                        </h3>
                        {group.active && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {group.members} members
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100">
                      <TrashIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Sharing Settings Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sharing Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Share Route History
                  </p>
                  <p className="text-xs text-gray-500">
                    Allow viewers to see past routes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Auto-stop Sharing
                  </p>
                  <p className="text-xs text-gray-500">
                    Stop sharing after route completion
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
