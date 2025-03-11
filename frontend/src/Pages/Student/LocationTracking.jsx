import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ClockIcon, MapPinIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const schoolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/8074/8074794.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export function LocationTracking() {
  const locationHistory = [
    {
      date: "2023-06-14",
      locations: [
        { time: "7:15 AM", position: [40.7128, -74.006], status: "In transit" },
        {
          time: "7:28 AM",
          position: [40.7135, -74.01],
          status: "Approaching stop",
        },
        {
          time: "7:31 AM",
          position: [40.714, -74.013],
          status: "At stop - Pickup",
        },
        { time: "7:45 AM", position: [40.715, -74.02], status: "In transit" },
        {
          time: "8:00 AM",
          position: [40.716, -74.025],
          status: "Arrived at school",
        },
      ],
    },
    {
      date: "2023-06-13",
      locations: [
        { time: "7:15 AM", position: [40.7128, -74.006], status: "In transit" },
        {
          time: "7:30 AM",
          position: [40.714, -74.013],
          status: "At stop - Pickup",
        },
        { time: "7:45 AM", position: [40.715, -74.02], status: "In transit" },
        {
          time: "8:00 AM",
          position: [40.716, -74.025],
          status: "Arrived at school",
        },
      ],
    },
  ];

  const [selectedDate, setSelectedDate] = useState(locationHistory[0].date);
  const selectedLocations =
    locationHistory.find((h) => h.date === selectedDate)?.locations || [];
  const currentLocation = selectedLocations[selectedLocations.length - 1];
  const homeLocation = [40.714, -74.013];
  const schoolLocation = [40.716, -74.025];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Bus Location Tracking
      </h1>
      <div className="mb-6">
        <label
          htmlFor="dateSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Date
        </label>
        <select
          id="dateSelect"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
        >
          {locationHistory.map((history) => (
            <option key={history.date} value={history.date}>
              {history.date}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
        <div className="flex items-center">
          <div className="bg-amber-100 p-2 rounded-full">
            <MapPinIcon size={24} className="text-amber-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">
              Current Bus Status
            </h3>
            <p className="text-lg font-semibold text-amber-700">
              {currentLocation.status}
            </p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <ClockIcon size={14} className="mr-1" /> Last updated:{" "}
              {currentLocation.time}
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ height: "400px" }}
      >
        <MapContainer
          center={currentLocation.position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentLocation.position} icon={busIcon}>
            <Popup>School Bus</Popup>
          </Marker>
          <Marker position={homeLocation} icon={homeIcon}>
            <Popup>Home</Popup>
          </Marker>
          <Marker position={schoolLocation} icon={schoolIcon}>
            <Popup>School</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
