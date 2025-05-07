import React, { useRef, useEffect, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { NavigationIcon, RouteIcon, ArrowUpRightIcon } from "lucide-react";
import backendUrl from "../../config/config";

// Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Optimize route
const reorderWaypoints = (start, waypoints) => {
  let currentPoint = start;
  let remaining = [...waypoints];
  const ordered = [];

  while (remaining.length) {
    let closest = null;
    let closestDist = Infinity;
    remaining.forEach((wp) => {
      const dist = calculateDistance(currentPoint.lat, currentPoint.lng, wp.lat, wp.lng);
      if (dist < closestDist) {
        closest = wp;
        closestDist = dist;
      }
    });
    ordered.push(closest);
    currentPoint = closest;
    remaining = remaining.filter((wp) => wp !== closest);
  }

  return ordered;
};

const StudentLocationTracking = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const directionsPolylineRef = useRef(null);
  const watchIdRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const [trafficVisible, setTrafficVisible] = useState(true);


  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeId, setRouteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const apiKey = "AIzaSyCSBBiJ1FlfAgReJyDEgDrwiX0R0CLIGHM";

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || !window.google?.maps) return;
    const map = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 6.9805, lng: 79.9296 },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapRef.current = map;
    trafficLayerRef.current = new window.google.maps.TrafficLayer();
    trafficLayerRef.current.setMap(map);

  }, []);

  useEffect(() => {
    const loader = new Loader({ apiKey, libraries: ["geometry"] });
    loader.load()
      .then(() => setGoogleMapsLoaded(true))
      .catch(() => setError("Failed to load Google Maps"));
  }, []);

  useEffect(() => {
    if (googleMapsLoaded) initializeMap();
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

  useEffect(() => {
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (markerRef.current) markerRef.current.setMap(null);
      if (routePolylineRef.current) routePolylineRef.current.setMap(null);
      if (directionsPolylineRef.current) directionsPolylineRef.current.setMap(null);
      
    };
  }, []);
  

  const addCustomMarkers = useCallback((data, studentPickups, schools) => {
    const createMarker = (lat, lng, title, color) => {
      return new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 1,
          scale: 8,
          strokeWeight: 0,
        },
      });
    };
    createMarker(data.startLat, data.startLng, `Start: ${data.startName}`, "green");
    createMarker(data.endLat, data.endLng, `End: ${data.endName}`, "red");
    studentPickups.forEach((p) => createMarker(p.latitude, p.longitude, `Pickup: ${p.studentEmail}`, "purple"));
    schools.forEach((s) => createMarker(s.latitude, s.longitude, `School: ${s.name}`, "blue"));
  }, []);

  const startJourney = useCallback(async () => {
    if (!mapRef.current || !routeId || !googleMapsLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/getRouteById/${routeId}`);
      const data = await res.json();
      let studentPickups = data.studentPickups || [];
      const schools = data.schools || [];

      const today = new Date().toISOString().split("T")[0];
      const filtered = [];

      for (const p of studentPickups) {
        try {
          const res = await fetch(`${backendUrl}/api/availability/student/${p.studentEmail}`);
          const availability = await res.json();
          const isComing = availability.every((a) => {
            const date = a.date?.split("T")[0];
            return !(date === today && (a.coming === false || a.coming === "false") && a.attendanceType === "Both");
          });
          if (isComing) filtered.push(p);
        } catch {
          filtered.push(p);
        }
      }

      const waypoints = [
        { lat: data.startLat, lng: data.startLng },
        ...filtered.map((p) => ({ lat: p.latitude, lng: p.longitude })),
        ...schools.map((s) => ({ lat: s.latitude, lng: s.longitude })),
        { lat: data.endLat, lng: data.endLng },
      ];

      const optimized = reorderWaypoints({ lat: data.startLat, lng: data.startLng }, waypoints.slice(1, -1));

      const routeRequest = {
        origin: { location: { latLng: { latitude: data.startLat, longitude: data.startLng } } },
        destination: { location: { latLng: { latitude: data.endLat, longitude: data.endLng } } },
        intermediates: optimized.map((wp) => ({
          location: { latLng: { latitude: wp.lat, longitude: wp.lng } },
        })),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE_OPTIMAL",
      };

      const res2 = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
        },
        body: JSON.stringify(routeRequest),
      });

      const result = await res2.json();
      const polyline = result.routes?.[0]?.polyline?.encodedPolyline;
      if (!polyline) throw new Error("No polyline found");

      const path = window.google.maps.geometry.encoding.decodePath(polyline);
      if (routePolylineRef.current) routePolylineRef.current.setMap(null);

      routePolylineRef.current = new window.google.maps.Polyline({
        path,
        map: mapRef.current,
        strokeColor: "#2337C6",
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });

      setRouteCoordinates(path.map((p) => [p.lng(), p.lat()]));
      addCustomMarkers(data, filtered, schools);

      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      mapRef.current.fitBounds(bounds);
    } catch (err) {
      console.error(err);
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

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        markerRef.current.setPosition(position);
        mapRef.current.panTo(position);
        mapRef.current.setZoom(17);
        mapRef.current.setTilt(45);
      },
      () => setError("Unable to access your location."),
      { enableHighAccuracy: true }
    );
  }, [googleMapsLoaded]);

  const navigateToStart = useCallback(() => {
    if (!mapRef.current || !routeCoordinates.length || !googleMapsLoaded) return;

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const startLat = routeCoordinates[0][1];
          const startLng = routeCoordinates[0][0];

          const requestBody = {
            origin: { location: { latLng: { latitude: userLat, longitude: userLng } } },
            destination: { location: { latLng: { latitude: startLat, longitude: startLng } } },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE_OPTIMAL",
          };

          const res = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-FieldMask": "*",
            },
            body: JSON.stringify(requestBody),
          });

          const data = await res.json();
          const polyline = data.routes?.[0]?.polyline?.encodedPolyline;
          if (!polyline) throw new Error("No polyline returned");

          const decodedPath = window.google.maps.geometry.encoding.decodePath(polyline);
          if (directionsPolylineRef.current) directionsPolylineRef.current.setMap(null);

          directionsPolylineRef.current = new window.google.maps.Polyline({
            path: decodedPath,
            map: mapRef.current,
            strokeColor: "#FF8800",
            strokeOpacity: 0.9,
            strokeWeight: 4,
          });

          const bounds = new window.google.maps.LatLngBounds();
          decodedPath.forEach((p) => bounds.extend(p));
          mapRef.current.fitBounds(bounds);
        } catch (err) {
          console.error("❌ navigateToStart error:", err);
          setError(err.message);
        }
        setIsLoading(false);
      },
      () => {
        setError("Unable to access your location.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, [routeCoordinates, googleMapsLoaded]);

  const toggleTraffic = () => {
    if (!mapRef.current || !trafficLayerRef.current) return;
  
    if (trafficVisible) {
      trafficLayerRef.current.setMap(null); // Turn off
    } else {
      trafficLayerRef.current.setMap(mapRef.current); // Turn on
    }
  
    setTrafficVisible(!trafficVisible);
  };
  

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Student Location Tracking</h1>
      <p className="text-gray-600 mb-4">Live tracking of the school bus route and student pickups</p>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 flex flex-wrap gap-2 p-3">
          <button
            onClick={startJourney}
            disabled={isLoading || !googleMapsLoaded}
            className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? <span className="animate-spin mr-1">↻</span> : <RouteIcon size={16} className="inline mr-1" />}
            Start Journey
          </button>
          <button
            onClick={startNavigation}
            disabled={!routeCoordinates.length || isLoading || !googleMapsLoaded}
            className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
              !routeCoordinates.length || isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
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
          <button
    onClick={toggleTraffic}
    className="px-4 py-2 font-medium text-sm text-white rounded flex items-center bg-gray-600 hover:bg-gray-700"
  >
    {trafficVisible ? "Hide Traffic" : "Show Traffic"}
  </button>

        </div>
        <div className="p-6">
          <div ref={mapContainer} className="w-full h-[500px] rounded border shadow" />
          {!googleMapsLoaded && <div className="text-center py-4 text-gray-500">Loading Google Maps...</div>}
        </div>
      </div>
    </div>
  );
};

export default StudentLocationTracking;
