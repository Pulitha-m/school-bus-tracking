import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../../config/config";

const RouteMachine = ({ startLocation, schools, endLocation }) => {
  const map = useMap();
  const routingControlRef = React.useRef(null);

  useEffect(() => {
    if (!startLocation || !endLocation) return;

    // Clear existing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(startLocation.lat, startLocation.lng),
        ...schools.map((s) => L.latLng(s.lat, s.lng)),
        L.latLng(endLocation.lat, endLocation.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [startLocation, schools, endLocation, map]);

  return (
    <style>{`.leaflet-routing-container { display: none !important; }`}</style>
  );
};

export default function ViewRoute() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendUrl}/getRouteById/${routeId}`)
      .then((res) => setRoute(res.data))
      .catch((err) => {
        toast.error("Failed to load route.");
        console.error(err);
      });
  }, [routeId]);

  if (!route) {
    return (
      <div className="p-6">
        <ToastContainer />
        <p>Loading route...</p>
      </div>
    );
  }

  const startLocation = {
    lat: route.startLat,
    lng: route.startLng,
    name: route.startName,
  };

  const endLocation = {
    lat: route.endLat,
    lng: route.endLng,
    name: route.endName,
  };

  const schools = (route.schools || []).map((s) => ({
    lat: s.latitude,
    lng: s.longitude,
    name: s.name,
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        View Route: {route.name}
      </h2>

      <div className="w-full h-[500px] rounded-lg overflow-hidden border">
        <MapContainer
          center={[startLocation.lat, startLocation.lng]}
          zoom={12}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={startLocation} />
          {schools.map((school, idx) => (
            <Marker key={idx} position={school} />
          ))}
          <Marker position={endLocation} />
          <RouteMachine
            startLocation={startLocation}
            schools={schools}
            endLocation={endLocation}
          />
        </MapContainer>
      </div>

      {/* Summary Section */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Route Summary
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>
            🟢 <strong>{startLocation.name}</strong>
            <br />({startLocation.lat.toFixed(5)},{" "}
            {startLocation.lng.toFixed(5)})
          </li>
          {schools.map((school, i) => (
            <li key={i}>
              🏫 <strong>{school.name}</strong>
              <br />({school.lat.toFixed(5)}, {school.lng.toFixed(5)})
            </li>
          ))}
          <li>
            🔴 <strong>{endLocation.name}</strong>
            <br />({endLocation.lat.toFixed(5)}, {endLocation.lng.toFixed(5)})
          </li>
        </ul>
      </div>
    </div>
  );
}
