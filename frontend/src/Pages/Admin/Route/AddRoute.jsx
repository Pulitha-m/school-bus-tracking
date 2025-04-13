import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import backendUrl from "../../../config/config";

const RouteMachine = ({
  startLocation,
  schools,
  endLocation,
  isRouteDrawn,
}) => {
  const map = useMap();
  const routingControlRef = React.useRef(null);

  useEffect(() => {
    if (!startLocation || !endLocation || !isRouteDrawn) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(startLocation.lat, startLocation.lng),
        ...schools.map((school) => L.latLng(school.lat, school.lng)),
        L.latLng(endLocation.lat, endLocation.lng),
      ],
      routeWhileDragging: true,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [startLocation, schools, endLocation, isRouteDrawn, map]);

  return null;
};

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
};

const AddRoute = () => {
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [schools, setSchools] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [startName, setStartName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [endName, setEndName] = useState("");
  const [isRouteDrawn, setIsRouteDrawn] = useState(false);
  const [busId, setBusId] = useState("");
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/getAllBusses`)
      .then((res) => setBuses(res.data))
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        setTempMarker(e.latlng);
      },
    });
    return tempMarker ? <Marker position={tempMarker} /> : null;
  }

  const handleAddStart = () => {
    if (!tempMarker || !startName) {
      toast.warning("Select a location and enter a name for the start point.");
      return;
    }
    setStartLocation({ ...tempMarker, name: startName });
    setStartName("");
    setTempMarker(null);
  };

  const handleAddSchool = () => {
    if (!tempMarker || !schoolName) {
      toast.warning("Select a location and enter a school name.");
      return;
    }
    setSchools([...schools, { ...tempMarker, name: schoolName }]);
    setSchoolName("");
    setTempMarker(null);
  };

  const handleAddEnd = () => {
    if (!tempMarker || !endName) {
      toast.warning("Select a location and enter a name for the end point.");
      return;
    }
    setEndLocation({ ...tempMarker, name: endName });
    setEndName("");
    setTempMarker(null);
  };

  const handleDrawRoute = () => {
    if (!startLocation || !endLocation) {
      toast.error("Start and end locations are required to draw the route.");
      return;
    }
    setIsRouteDrawn(true);
  };

  const handleRemoveMarkers = () => {
    setStartLocation(null);
    setSchools([]);
    setEndLocation(null);
    setTempMarker(null);
    setIsRouteDrawn(false);
  };

  const handleSaveRoute = async () => {
    if (!routeName || !startLocation || !endLocation || !busId) {
      toast.error("Fill route name, select bus, start and end points.");
      return;
    }

    const routeData = {
      name: routeName,
      busId: busId,
      startName: startLocation.name,
      startLat: startLocation.lat,
      startLng: startLocation.lng,
      endName: endLocation.name,
      endLat: endLocation.lat,
      endLng: endLocation.lng,
      schools: schools.map((school) => ({
        latitude: school.lat,
        longitude: school.lng,
        name: school.name,
      })),
    };

    try {
      await axios.post(`${backendUrl}/addRoute`, routeData);
      toast.success("Route saved successfully!");
      setTimeout(() => navigate("/admin/routes"), 1500);
    } catch (error) {
      toast.error("Failed to save route.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Map and Form Section */}
      <div className="lg:w-3/4 w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New Bus Route
        </h2>

        <input
          type="text"
          placeholder="Route Name"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        />

        <select
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
        >
          <option value="">Select Bus</option>
          {buses.map((bus) => (
            <option key={bus.busId} value={bus.busId}>
              {bus.noPlate} ({bus.busId})
            </option>
          ))}
        </select>

        <div className="w-full h-[400px] mb-4 border rounded-lg overflow-hidden">
          <MapContainer
            center={[6.9271, 79.8612]}
            zoom={12}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector />
            <SearchControl />
            {startLocation && <Marker position={startLocation} />}
            {schools.map((school, i) => (
              <Marker key={i} position={school} />
            ))}
            {endLocation && <Marker position={endLocation} />}
            <RouteMachine
              startLocation={startLocation}
              schools={schools}
              endLocation={endLocation}
              isRouteDrawn={isRouteDrawn}
            />
          </MapContainer>
        </div>

        {/* Input Fields for Marker Labels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="Start Name"
            value={startName}
            onChange={(e) => setStartName(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="End Name"
            value={endName}
            onChange={(e) => setEndName(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={handleAddStart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Set Start
          </button>
          <button
            onClick={handleAddSchool}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Add School
          </button>
          <button
            onClick={handleAddEnd}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Set End
          </button>
          <button
            onClick={handleDrawRoute}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Draw Route
          </button>
          <button
            onClick={handleRemoveMarkers}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Clear All
          </button>
          <button
            onClick={handleSaveRoute}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg col-span-2 md:col-span-3"
          >
            Save Route
          </button>
        </div>
      </div>

      {/* Route Info Section */}
      <div className="lg:w-1/4 w-full bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Route Summary
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          {startLocation && (
            <li>
              🟢 <strong>{startLocation.name}</strong>
              <br />({startLocation.lat.toFixed(5)},{" "}
              {startLocation.lng.toFixed(5)})
            </li>
          )}
          {schools.map((school, i) => (
            <li key={i}>
              🏫 <strong>{school.name}</strong>
              <br />({school.lat.toFixed(5)}, {school.lng.toFixed(5)})
            </li>
          ))}
          {endLocation && (
            <li>
              🔴 <strong>{endLocation.name}</strong>
              <br />({endLocation.lat.toFixed(5)}, {endLocation.lng.toFixed(5)})
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddRoute;
