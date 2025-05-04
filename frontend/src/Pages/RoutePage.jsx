import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { toast } from "react-toastify";
import { ClockIcon, MapIcon, SearchIcon } from "lucide-react";

const iconRetinaUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RouteMachine = ({ routeCoordinates }) => {
  const map = useMap();
  const routingControlRef = React.useRef(null);

  useEffect(() => {
    if (routeCoordinates.length < 2) return;
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }
    routingControlRef.current = L.Routing.control({
      waypoints: routeCoordinates.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [routeCoordinates, map]);

  return null;
};

const LocationSelector = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
      toast.info("Pickup location selected");
    },
  });
  return null;
};

export const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffSchool, setDropoffSchool] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [busDetails, setBusDetails] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getAllRoutes");
        setRoutes(response.data);
        setFilteredRoutes(response.data);
      } catch (err) {
        console.error("Route fetch error:", err);
        toast.error("Failed to load routes. Please try again later.");
      }
    };
    fetchRoutes();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = routes.filter(
      (route) =>
        route.startName.toLowerCase().includes(query) ||
        route.endName.toLowerCase().includes(query) ||
        route.schools.some((school) =>
          school.name.toLowerCase().includes(query)
        )
    );
    setFilteredRoutes(filtered);
  };

  const handleRouteSelect = async (route) => {
    setSelectedRoute(route);
    setPickupLocation(null);
    setDropoffSchool(null);
    setEstimatedFare(null);
    setDistanceKm(null);
    setRouteCoordinates([
      [route.startLat, route.startLng],
      ...route.schools.map((s) => [s.latitude, s.longitude]),
      [route.endLat, route.endLng],
    ]);
    toast.success(`Selected route: ${route.startName} → ${route.endName}`);
    try {
      const response = await axios.get(
        `http://localhost:8080/getBusById/${route.busId}`
      );
      setBusDetails(response.data);
    } catch (err) {
      console.error("Bus fetch error:", err);
      toast.error("Failed to load bus details.");
    }
  };

  const calculateFare = async () => {
    if (!pickupLocation || !dropoffSchool) {
      toast.error("Please select both pickup location and school drop-off.");
      return;
    }
    try {
      const origin = `${pickupLocation.lat},${pickupLocation.lng}`;
      const destination = `${dropoffSchool.latitude},${dropoffSchool.longitude}`;
      const res = await axios.get("http://localhost:8080/api/getDistance", {
        params: { origins: origin, destinations: destination },
      });
      if (!res.data.routes || res.data.routes.length === 0) {
        toast.error("No route found between selected points.");
        return;
      }
      const meters = res.data.routes[0].distanceMeters;
      const distance = (meters / 1000).toFixed(2);
      const monthlyFare = (distance * 20 * 20 * 2).toFixed(2);
      setDistanceKm(distance);
      setEstimatedFare(monthlyFare);
      toast.success(
        `Estimated Monthly Fare: Rs. ${monthlyFare} (${distance} km)`
      );
    } catch (error) {
      console.error("Fare calculation error:", error);
      toast.error("Failed to calculate fare. Try again.");
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bus Routes</h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Tap a route to preview. Click map to set pickup. Choose drop-off
            school, then estimate your monthly fare.
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search routes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          />
          <SearchIcon
            className="absolute right-3 top-3 text-gray-400"
            size={20}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRoutes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                className={`bg-white border rounded-lg shadow-sm hover:shadow-lg transition p-5 relative cursor-pointer ${
                  isSelected ? "ring-2 ring-yellow-400" : ""
                }`}
                onClick={() => handleRouteSelect(route)}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {route.startName} → {route.endName}
                </h3>
                <div className="text-sm text-gray-500 mb-3">
                  Route: {route.startName} →{" "}
                  {route.schools.map((s) => s.name).join(" → ")} →{" "}
                  {route.endName}
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <ClockIcon size={16} />{" "}
                  {route.timing || "Timing not available"}
                  <MapIcon size={16} /> {route.schools.length} school stops
                </div>
              </div>
            );
          })}
        </div>

        {selectedRoute && (
          <div className="bg-white rounded-lg shadow p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">
              {selectedRoute.startName} → {selectedRoute.endName}
            </h2>

            {busDetails && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Bus Details</h3>
                <div className="flex items-center space-x-4">
                  {busDetails.busImage && (
                    <img
                      src={`data:image/jpeg;base64,${busDetails.busImage}`}
                      alt="Bus"
                      className="h-24 w-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <p>
                      <strong>Number Plate:</strong> {busDetails.noPlate}
                    </p>
                    <p>
                      <strong>Make:</strong> {busDetails.make}
                    </p>
                    <p>
                      <strong>Model:</strong> {busDetails.model}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {busDetails.capacity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="h-96 border rounded overflow-hidden mb-6">
              <MapContainer
                center={[selectedRoute.startLat, selectedRoute.startLng]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[selectedRoute.startLat, selectedRoute.startLng]}
                >
                  <Popup>Start: {selectedRoute.startName}</Popup>
                </Marker>
                {selectedRoute.schools.map((school, i) => (
                  <Marker
                    key={i}
                    position={[school.latitude, school.longitude]}
                  >
                    <Popup>{school.name}</Popup>
                  </Marker>
                ))}
                <Marker position={[selectedRoute.endLat, selectedRoute.endLng]}>
                  <Popup>End: {selectedRoute.endName}</Popup>
                </Marker>
                {pickupLocation && (
                  <Marker position={pickupLocation}>
                    <Popup>Pickup</Popup>
                  </Marker>
                )}
                <LocationSelector setLocation={setPickupLocation} />
                <RouteMachine routeCoordinates={routeCoordinates} />
              </MapContainer>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Drop-off School:
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={dropoffSchool?.name || ""}
                onChange={(e) => {
                  const school = selectedRoute.schools.find(
                    (s) => s.name === e.target.value
                  );
                  setDropoffSchool(school);
                  toast.info(`Drop-off set to: ${school.name}`);
                }}
              >
                <option value="" disabled>
                  Select a school
                </option>
                {selectedRoute.schools.map((s, i) => (
                  <option key={i} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <button
                onClick={calculateFare}
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition"
              >
                Calculate Fare
              </button>
              {estimatedFare && (
                <div className="text-green-700 font-medium bg-green-100 p-3 rounded-lg border">
                  Estimated Monthly Fare: Rs. {estimatedFare} ({distanceKm} km)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
