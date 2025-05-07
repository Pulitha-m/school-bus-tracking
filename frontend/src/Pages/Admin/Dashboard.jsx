import React, { useEffect, useState } from "react";
import {
  BarChart3Icon,
  UsersIcon,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Dashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    buses: 0,
    drivers: 0,
    routes: 0,
  });
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await fetch("http://localhost:8080/getAllStudents");
        const students = await studentsRes.json();

        const busesRes = await fetch("http://localhost:8080/getAllBusses");
        const buses = await busesRes.json();

        const driversRes = await fetch("http://localhost:8080/getAllDrivers");
        const drivers = await driversRes.json();

        const routesRes = await fetch("http://localhost:8080/getAllRoutes");
        const routes = await routesRes.json();

        const locationsRes = await fetch(
          "http://localhost:8080/all-current-locations"
        );
        const locationsData = await locationsRes.json();

        setCounts({
          students: students.length,
          buses: buses.length,
          drivers: drivers.length,
          routes: routes.length,
        });
        setLocations(locationsData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the SchoolBus Management System
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          icon={<UsersIcon className="h-6 w-6 text-blue-500" />}
          color="blue"
          label="Total Students"
          value={counts.students}
        />
        <SummaryCard
          icon={<TruckIcon className="h-6 w-6 text-green-500" />}
          color="green"
          label="Active Buses"
          value={counts.buses}
        />
        <SummaryCard
          icon={<UsersIcon className="h-6 w-6 text-amber-500" />}
          color="amber"
          label="Drivers"
          value={counts.drivers}
        />
        <SummaryCard
          icon={<MapPinIcon className="h-6 w-6 text-purple-500" />}
          color="purple"
          label="Routes"
          value={counts.routes}
        />
        <SummaryCard
          icon={<CalendarIcon className="h-6 w-6 text-red-500" />}
          color="red"
          label="Today's Attendance"
          value="96%"
        />
        <SummaryCard
          icon={<DollarSignIcon className="h-6 w-6 text-teal-500" />}
          color="teal"
          label="Monthly Revenue"
          value="LKR 24,500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Buses Map */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-gray-800 mb-4">
            Active Bus Locations
          </h2>
          <div className="h-64 rounded overflow-hidden">
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((loc, i) => (
                <Marker
                  key={i}
                  position={[loc.latitude || 0, loc.longitude || 0]}
                >
                  <Popup>
                    Bus ID: {loc.busId || "Unknown"} <br />
                    Time: {new Date(loc.timestamp).toLocaleString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <Activity
              icon={<TruckIcon className="h-4 w-4 text-blue-500" />}
              desc="Bus #7 started Kaduwel route"
              time="10 minutes ago"
            />
            <Activity
              icon={<UsersIcon className="h-4 w-4 text-green-500" />}
              desc="10 studnet get-in at bus #&"
              time="25 minutes ago"
            />
            <Activity
              icon={<MapPinIcon className="h-4 w-4 text-red-500" />}
              desc="Bus #1 reported maintenance issue"
              time="1 hour ago"
            />
            <Activity
              icon={<DollarSignIcon className="h-4 w-4 text-amber-500" />}
              desc="Monthly payment collected from 10 students"
              time="3 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ icon, color, label, value }) => (
  <div
    className={`bg-white rounded-lg shadow p-4 border-l-4 border-${color}-500`}
  >
    <div className="flex items-center">
      <div className={`bg-${color}-100 p-3 rounded-full`}>{icon}</div>
      <div className="ml-4">
        <h2 className="text-sm font-medium text-gray-600">{label}</h2>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const Activity = ({ icon, desc, time }) => (
  <div className="flex items-start pb-3 border-b last:border-b-0">
    <div className="p-2 rounded-full bg-gray-100">{icon}</div>
    <div className="ml-3">
      <p className="text-sm">{desc}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);
