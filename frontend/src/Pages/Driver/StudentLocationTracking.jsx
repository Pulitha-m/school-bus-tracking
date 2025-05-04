import React, { useRef, useEffect, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { NavigationIcon, RouteIcon, ArrowUpRightIcon } from "lucide-react";
import backendUrl from "../../config/config";

// Function to calculate the distance between two points using the Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
 const R = 6371; // Earth's radius in km
 const dLat = (lat2 - lat1) * (Math.PI / 180);
 const dLng = (lng2 - lng1) * (Math.PI / 180);
 const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat1 * (Math.PI / 180)) *
   Math.cos(lat2 * (Math.PI / 180)) *
   Math.sin(dLng / 2) *
   Math.sin(dLng / 2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 return R * c; // Distance in km
};

// Function to reorder waypoints by calculating the nearest neighbor (optimized waypoints)
const reorderWaypoints = (start, waypoints) => {
 let currentPoint = start;
 let remainingWaypoints = [...waypoints];
 let orderedWaypoints = [];

 while (remainingWaypoints.length > 0) {
  let closestWaypoint = null;
  let closestDistance = Infinity;

  remainingWaypoints.forEach((wp) => {
   const dist = calculateDistance(
    currentPoint.lat,
    currentPoint.lng,
    wp.lat,
    wp.lng
   );
   if (dist < closestDistance) {
    closestWaypoint = wp;
    closestDistance = dist;
   }
  });

  orderedWaypoints.push(closestWaypoint);
  currentPoint = closestWaypoint;
  remainingWaypoints = remainingWaypoints.filter(
   (wp) => wp !== closestWaypoint
  );
 }

 return orderedWaypoints;
};

const StudentLocationTracking = () => {
 const mapContainer = useRef(null);
 const mapRef = useRef(null);
 const routePolylineRef = useRef(null);
 const markerRef = useRef(null);
 const [routeCoordinates, setRouteCoordinates] = useState([]);
 const [routeId, setRouteId] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);
 const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

 const apiKey = "AIzaSyCSBBiJ1FlfAgReJyDEgDrwiX0R0CLIGHM"; // Replace with your actual API key

 const initializeMap = useCallback(() => {
  if (!mapContainer.current || !window.google?.maps) return;

  const map = new window.google.maps.Map(mapContainer.current, {
   center: { lat: 6.9805, lng: 79.9296 },
   zoom: 12,
   mapTypeControl: false,
   streetViewControl: false,
  });

  mapRef.current = map;
 }, []);

 useEffect(() => {
  const loader = new Loader({
   apiKey,
   libraries: ["geometry"],
  });

  loader
   .load()
   .then(() => setGoogleMapsLoaded(true))
   .catch(() => setError("Failed to load Google Maps"));

  return () => {
   if (markerRef.current) markerRef.current.setMap(null);
   if (routePolylineRef.current) routePolylineRef.current.setMap(null);
  };
 }, []);

 useEffect(() => {
  if (googleMapsLoaded) {
   initializeMap();
  }
 }, [googleMapsLoaded, initializeMap]);

 useEffect(() => {
  const sessionData = sessionStorage.getItem("user");
  if (sessionData) {
   const { id } = JSON.parse(sessionData);
   fetch(`${backendUrl}/getDriverById/${id}`)
    .then((res) => res.json())
    .then((data) => setRouteId(data.routeId))
    .catch(() => setError("Failed to load driver routeId"));
  }
 }, []);

 const addCustomMarkers = useCallback((data, studentPickups, schools) => {
  if (!mapRef.current) return;

  new window.google.maps.Marker({
   position: { lat: data.startLat, lng: data.startLng },
   map: mapRef.current,
   title: `Start: ${data.startName}`,
   icon: {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "green",
    fillOpacity: 1,
    scale: 8,
    strokeWeight: 0,
   },
  });

  new window.google.maps.Marker({
   position: { lat: data.endLat, lng: data.endLng },
   map: mapRef.current,
   title: `End: ${data.endName}`,
   icon: {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "red",
    fillOpacity: 1,
    scale: 8,
    strokeWeight: 0,
   },
  });

  studentPickups.forEach((p) => {
   new window.google.maps.Marker({
    position: { lat: p.latitude, lng: p.longitude },
    map: mapRef.current,
    title: `Pickup: ${p.studentEmail}`,
    icon: {
     path: window.google.maps.SymbolPath.CIRCLE,
     fillColor: "purple",
     fillOpacity: 1,
     scale: 8,
     strokeWeight: 0,
    },
   });
  });

  schools.forEach((s) => {
   new window.google.maps.Marker({
    position: { lat: s.latitude, lng: s.longitude },
    map: mapRef.current,
    title: `School: ${s.name}`,
    icon: {
     path: window.google.maps.SymbolPath.CIRCLE,
     fillColor: "blue",
     fillOpacity: 1,
     scale: 8,
     strokeWeight: 0,
    },
   });
  });
 }, []);

 
const startJourney = useCallback(async () => {
  if (!mapRef.current || !routeId || !googleMapsLoaded) return;

  setIsLoading(true);
  setError(null);

  try {
    // Fetch route data
    const res = await fetch(`${backendUrl}/getRouteById/${routeId}`);
    const data = await res.json();
    let studentPickups = data.studentPickups || [];
    const schools = data.schools || [];

    // Fetch today's availability list for the bus
    const availabilityRes = await fetch(`${backendUrl}/api/availability/bus/${routeId}`);
    const availabilityData = await availabilityRes.json();

    const today = new Date().toISOString().split('T')[0];
console.log("📅 Today:", today);

const filteredPickups = [];

for (const pickup of studentPickups) {
  const pickupEmail = (pickup.studentEmail || "").trim().toLowerCase();
  console.log("📩 Checking availability for:", pickupEmail);

  try {
    const res = await fetch(`${backendUrl}/api/availability/student/${pickupEmail}`);
    const availabilityRecords = await res.json();

    const isComing = availabilityRecords.every((avail) => {
      const availDate = avail.date.split('T')[0];
      const notComingToday =
        availDate === today &&
        (avail.coming === false || avail.coming === "false") &&
        avail.attendanceType === "Both";

      console.log("🧪 Availability check for:", {
        email: pickupEmail,
        availDate,
        today,
        coming: avail.coming,
        attendanceType: avail.attendanceType,
        exclude: notComingToday,
      });

      return !notComingToday;
    });

    if (isComing) {
      console.log("✅ Adding pickup:", pickupEmail);
      filteredPickups.push(pickup);
    } else {
      console.log("🚫 Excluding pickup (not coming today):", pickupEmail);
    }
  } catch (err) {
    console.error(`❌ Failed to fetch availability for ${pickupEmail}`, err);
    // Optionally include pickup if fetch fails
    filteredPickups.push(pickup);
  }
}

studentPickups = filteredPickups;


    // Combine all waypoints (start, pickups, schools, end)
    const waypoints = [
      { lat: data.startLat, lng: data.startLng }, // Start
      ...studentPickups.map((p) => ({ lat: p.latitude, lng: p.longitude })), // Student pickups
      ...schools.map((s) => ({ lat: s.latitude, lng: s.longitude })), // Schools
      { lat: data.endLat, lng: data.endLng }, // End
    ];

    // Optimize the waypoints order (excluding start and end points)
    const optimizedWaypoints = reorderWaypoints(
      { lat: data.startLat, lng: data.startLng },
      waypoints.slice(1, -1)
    );

    // Build routing request
    const requestBody = {
      origin: {
        location: { latLng: { latitude: data.startLat, longitude: data.startLng } },
      },
      destination: {
        location: { latLng: { latitude: data.endLat, longitude: data.endLng } },
      },
      intermediates: optimizedWaypoints.map((wp) => ({
        location: { latLng: { latitude: wp.lat, longitude: wp.lng } },
      })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE_OPTIMAL",
    };

    const routeResponse = await fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!routeResponse.ok) {
      const errorMessage = await routeResponse.text();
      throw new Error(`Error fetching route data: ${routeResponse.statusText} - ${errorMessage}`);
    }

    const routeData = await routeResponse.json();

    if (!routeData.routes || routeData.routes.length === 0) {
      throw new Error("No route found in the response.");
    }

    const polyline = routeData.routes[0]?.polyline?.encodedPolyline;

    if (!polyline) {
      throw new Error("No polyline found in the route data.");
    }

    const decodedPath = window.google.maps.geometry.encoding.decodePath(polyline);

    if (routePolylineRef.current) routePolylineRef.current.setMap(null);

    const routeLine = new window.google.maps.Polyline({
      path: decodedPath,
      map: mapRef.current,
      strokeColor: "#2337C6",
      strokeOpacity: 0.9,
      strokeWeight: 5,
    });

    routePolylineRef.current = routeLine;
    setRouteCoordinates(decodedPath.map((latLng) => [latLng.lng(), latLng.lat()]));

    // Add custom markers
    addCustomMarkers(data, studentPickups, schools);

    const bounds = new window.google.maps.LatLngBounds();
    decodedPath.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);

  } catch (err) {
    console.error("Journey error:", err);
    setError(err.message);
  }

  setIsLoading(false);
}, [routeId, googleMapsLoaded, addCustomMarkers]);

 const startNavigation = useCallback(() => {
  if (!mapRef.current || !googleMapsLoaded) return;

  if (markerRef.current) markerRef.current.setMap(null);

  markerRef.current = new window.google.maps.Marker({
   map: mapRef.current,
   icon: {
    url: "https://cdn-icons-png.flaticon.com/512/61/61205.png",
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
   },
  });

  const watchId = navigator.geolocation.watchPosition(
   (pos) => {
    const position = {
     lat: pos.coords.latitude,
     lng: pos.coords.longitude,
    };
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
    mapRef.current.setZoom(17);
    mapRef.current.setTilt(45);
   },
   () => setError("Unable to access your location."),
   { enableHighAccuracy: true }
  );

  return () => navigator.geolocation.clearWatch(watchId);
 }, [googleMapsLoaded]);

 const navigateToStart = useCallback(() => {
  if (!mapRef.current || !routeCoordinates.length || !googleMapsLoaded)
   return;

  setIsLoading(true);
  setError(null);

  navigator.geolocation.getCurrentPosition(
   (pos) => {
    const userLatLng = new window.google.maps.LatLng(
     pos.coords.latitude,
     pos.coords.longitude
    );
    const startLatLng = new window.google.maps.LatLng(
     routeCoordinates[0][1],
     routeCoordinates[0][0]
    );

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(userLatLng);
    bounds.extend(startLatLng);
    mapRef.current.fitBounds(bounds);
   },
   () => setError("Unable to access your location."),
   { enableHighAccuracy: true }
  );

  setIsLoading(false);
 }, [routeCoordinates, googleMapsLoaded]);

 return (
  <div className="mb-6">
   <h1 className="text-2xl font-bold text-gray-800">
    Student Location Tracking
   </h1>
   <p className="text-gray-600 mb-4">
    Live tracking of the school bus route and student pickups
   </p>

   {error && (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
   )}

   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="border-b border-gray-200 flex flex-wrap gap-2 p-3">
     <button
      onClick={startJourney}
      disabled={isLoading || !googleMapsLoaded}
      className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
       isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
     >
      {isLoading ? (
       <span className="animate-spin mr-1">↻</span>
      ) : (
       <RouteIcon size={16} className="inline mr-1" />
      )}
      Start Journey
     </button>
     <button
      onClick={startNavigation}
      disabled={
       !routeCoordinates.length || isLoading || !googleMapsLoaded
      }
      className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
       !routeCoordinates.length || isLoading
        ? "bg-green-400"
        : "bg-green-600 hover:bg-green-700"
      }`}
     >
      <NavigationIcon size={16} className="inline mr-1" />
      Start Navigation
     </button>
     <button
      onClick={navigateToStart}
      disabled={isLoading || !googleMapsLoaded}
      className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
       isLoading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
      }`}
     >
      <ArrowUpRightIcon size={16} className="inline mr-1" />
      Navigate to Start
     </button>
    </div>
    <div className="p-6">
     <div
      ref={mapContainer}
      className="w-full h-[500px] rounded border shadow"
     />
     {!googleMapsLoaded && (
      <div className="text-center py-4 text-gray-500">
       Loading Google Maps...
      </div>
     )}
    </div>
   </div>
  </div>
 );
};

export default StudentLocationTracking;

