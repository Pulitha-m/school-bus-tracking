// import React, { useRef, useEffect, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import {
//   MapIcon,
//   NavigationIcon,
//   RouteIcon,
//   ArrowUpRightIcon,
// } from "lucide-react";
// import backendUrl from "../../config/config";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoicHVsaXRoYSIsImEiOiJjbThrMGpkcGMwdG1nMmtxOWZpbmI2eWs5In0.tQHPaMmKxxWdYQUx7rVdjA";

// const StudentLocationTracking = () => {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const intervalRef = useRef(null);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);
//   const [routeId, setRouteId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const sessionData = sessionStorage.getItem("user");
//     if (sessionData) {
//       const { id } = JSON.parse(sessionData);
//       fetch(`${backendUrl}/getDriverById/${id}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setRouteId(data.routeId);
//         })
//         .catch((err) => {
//           console.error("Failed to load driver routeId", err);
//           setError("Failed to load route information");
//         });
//     }
//   }, []);

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     const map = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [79.9296, 6.9805],
//       zoom: 12,
//     });

//     map.on("load", () => {
//       mapRef.current = map;
//     });

//     return () => {
//       map.remove();
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const startJourney = async () => {
//     if (!mapRef.current || !routeId) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Fetch route data
//       const res = await fetch(`${backendUrl}/getRouteById/${routeId}`);
//       if (!res.ok) throw new Error("Failed to fetch route data");
//       const data = await res.json();

//       // Prepare waypoints
//       const studentPickups = data.studentPickups || [];
//       const schools = data.schools || [];

//       const waypoints = [
//         [data.startLng, data.startLat],
//         ...studentPickups.map((p) => [p.longitude, p.latitude]),
//         ...schools.map((s) => [s.longitude, s.latitude]),
//         [data.endLng, data.endLat],
//       ];

//       // Get optimized waypoint order
//       const coords = waypoints.map((p) => p.join(",")).join(";");
//       const optimizationUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coords}?geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`;

//       const optimizationRes = await fetch(optimizationUrl);
//       if (!optimizationRes.ok) throw new Error("Route optimization failed");
//       const optimizationData = await optimizationRes.json();
//       const waypointOrder =
//         optimizationData.waypoints?.map((w) => w.waypoint_index) || [];

//       const orderedWaypoints = [
//         waypoints[0],
//         ...waypointOrder.map((i) => waypoints[i]),
//         waypoints[waypoints.length - 1],
//       ];

//       // Get detailed directions with full overview
//       const optimizedCoordString = orderedWaypoints
//         .map((p) => p.join(","))
//         .join(";");
//       const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${optimizedCoordString}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;

//       const directionsRes = await fetch(directionsUrl);
//       if (!directionsRes.ok) throw new Error("Failed to get directions");
//       const directionsData = await directionsRes.json();

//       const routeCoords =
//         directionsData.routes?.[0]?.geometry?.coordinates || [];
//       setRouteCoordinates(routeCoords);

//       // Clear existing route if any
//       if (mapRef.current.getSource("route-blue")) {
//         mapRef.current.removeLayer("route-blue");
//         mapRef.current.removeSource("route-blue");
//       }

//       // Add smooth route source and layer
//       mapRef.current.addSource("route-blue", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: routeCoords,
//           },
//         },
//       });

//       mapRef.current.addLayer({
//         id: "route-blue",
//         type: "line",
//         source: "route-blue",
//         layout: {
//           "line-cap": "round",
//           "line-join": "round",
//           "line-simplify": 0, // Disable simplification for smoothness
//         },
//         paint: {
//           "line-color": "#2337C6",
//           "line-width": 5,
//           "line-opacity": 0.9,
//         },
//       });

//       // Add markers
//       const createMarker = (lng, lat, text, color) => {
//         return new mapboxgl.Marker({ color })
//           .setLngLat([lng, lat])
//           .setPopup(new mapboxgl.Popup().setText(text))
//           .addTo(mapRef.current);
//       };

//       createMarker(
//         data.startLng,
//         data.startLat,
//         `Start: ${data.startName}`,
//         "green"
//       );
//       createMarker(data.endLng, data.endLat, `End: ${data.endName}`, "red");

//       studentPickups.forEach((p) =>
//         createMarker(
//           p.longitude,
//           p.latitude,
//           `Pickup: ${p.studentEmail}`,
//           "purple"
//         )
//       );

//       schools.forEach((s) =>
//         createMarker(s.longitude, s.latitude, `School: ${s.name}`, "blue")
//       );

//       // Fit map to route bounds
//       if (routeCoords.length > 0) {
//         const bounds = routeCoords.reduce(
//           (bounds, coord) => bounds.extend(coord),
//           new mapboxgl.LngLatBounds(routeCoords[0], routeCoords[0])
//         );
//         mapRef.current.fitBounds(bounds, { padding: 80 });
//       }
//     } catch (err) {
//       console.error("Journey setup error:", err);
//       setError(err.message || "Failed to start journey");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startNavigation = () => {
//     if (!mapRef.current) return;
//     if (markerRef.current) markerRef.current.remove();

//     const markerEl = document.createElement("div");
//     markerEl.className = "bus-marker";
//     markerEl.style.width = "40px";
//     markerEl.style.height = "40px";
//     markerEl.style.backgroundImage =
//       "url(https://cdn-icons-png.flaticon.com/512/61/61205.png)";
//     markerEl.style.backgroundSize = "contain";
//     markerEl.style.backgroundRepeat = "no-repeat";

//     const marker = new mapboxgl.Marker({ element: markerEl });
//     markerRef.current = marker;

//     navigator.geolocation.watchPosition(
//       (pos) => {
//         const lng = pos.coords.longitude;
//         const lat = pos.coords.latitude;
//         marker.setLngLat([lng, lat]).addTo(mapRef.current);
//         mapRef.current.easeTo({
//           center: [lng, lat],
//           zoom: 17,
//           pitch: 75,
//           bearing: pos.coords.heading || 0,
//         });
//       },
//       (err) => {
//         console.error("Geolocation error:", err);
//         setError("Unable to access your location.");
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   const navigateToStart = () => {
//     if (!mapRef.current || !routeCoordinates.length) return;

//     setIsLoading(true);
//     setError(null);

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         try {
//           const userLng = pos.coords.longitude;
//           const userLat = pos.coords.latitude;
//           const [startLng, startLat] = routeCoordinates[0];

//           const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${startLng},${startLat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
//           const res = await fetch(directionsUrl);
//           if (!res.ok) throw new Error("Navigation directions failed");
//           const data = await res.json();
//           const route = data.routes[0];

//           // Clear existing navigation route if any
//           if (mapRef.current.getLayer("nav-to-start")) {
//             mapRef.current.removeLayer("nav-to-start");
//             mapRef.current.removeSource("nav-to-start");
//           }

//           // Add navigation route
//           mapRef.current.addSource("nav-to-start", {
//             type: "geojson",
//             data: { type: "Feature", geometry: route.geometry },
//           });

//           mapRef.current.addLayer({
//             id: "nav-to-start",
//             type: "line",
//             source: "nav-to-start",
//             layout: {
//               "line-cap": "round",
//               "line-join": "round",
//               "line-simplify": 0,
//             },
//             paint: {
//               "line-color": "#00BFFF",
//               "line-width": 5,
//               "line-opacity": 0.8,
//             },
//           });

//           // Calculate bearing for orientation
//           const firstPoint = route.geometry.coordinates[0];
//           const secondPoint = route.geometry.coordinates[1] || firstPoint;
//           const angle =
//             (Math.atan2(
//               secondPoint[0] - firstPoint[0],
//               secondPoint[1] - firstPoint[1]
//             ) *
//               180) /
//             Math.PI;

//           mapRef.current.easeTo({
//             center: firstPoint,
//             zoom: 19,
//             pitch: 75,
//             bearing: angle,
//             duration: 1500,
//           });
//         } catch (err) {
//           console.error("Navigation error:", err);
//           setError(err.message || "Navigation failed");
//         } finally {
//           setIsLoading(false);
//         }
//       },
//       (err) => {
//         console.error("Location error:", err);
//         setError("Unable to access your location.");
//         setIsLoading(false);
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   return (
//     <div className="mb-6">
//       <h1 className="text-2xl font-bold text-gray-800">
//         Student Location Tracking
//       </h1>
//       <p className="text-gray-600 mb-4">
//         Live tracking of the school bus route and student pickups
//       </p>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
//       )}

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="border-b border-gray-200 flex flex-wrap gap-2 p-3">
//           <button
//             onClick={startJourney}
//             disabled={isLoading}
//             className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
//               isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {isLoading ? (
//               <span className="animate-spin mr-1">↻</span>
//             ) : (
//               <RouteIcon size={16} className="inline mr-1" />
//             )}
//             Start Journey
//           </button>
//           <button
//             onClick={startNavigation}
//             disabled={!routeCoordinates.length || isLoading}
//             className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
//               !routeCoordinates.length || isLoading
//                 ? "bg-green-400"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             <NavigationIcon size={16} className="inline mr-1" />
//             Start Navigation
//           </button>
//           <button
//             onClick={navigateToStart}
//             disabled={isLoading}
//             className={`px-4 py-2 font-medium text-sm text-white rounded flex items-center ${
//               isLoading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
//             }`}
//           >
//             <ArrowUpRightIcon size={16} className="inline mr-1" />
//             Navigate to Start
//           </button>
//         </div>
//         <div className="p-6">
//           <div
//             ref={mapContainer}
//             className="w-full h-[500px] rounded border shadow"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentLocationTracking;

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { NavigationIcon, RouteIcon, ArrowUpRightIcon } from "lucide-react";
import backendUrl from "../../config/config";

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
      const res = await fetch(`${backendUrl}/getRouteById/${routeId}`);
      const data = await res.json();
      const studentPickups = data.studentPickups || [];
      const schools = data.schools || [];

      const waypoints = [
        ...studentPickups.map((p) => ({
          lat: p.latitude,
          lng: p.longitude,
        })),
        ...schools.map((s) => ({
          lat: s.latitude,
          lng: s.longitude,
        })),
      ];

      const requestBody = {
        origin: {
          location: {
            latLng: { latitude: data.startLat, longitude: data.startLng },
          },
        },
        destination: {
          location: {
            latLng: { latitude: data.endLat, longitude: data.endLng },
          },
        },
        intermediates: waypoints.map((wp) => ({
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

      const routeData = await routeResponse.json();
      const polyline = routeData.routes[0]?.polyline?.encodedPolyline;

      if (!polyline) throw new Error("No route found");

      const decodedPath =
        window.google.maps.geometry.encoding.decodePath(polyline);

      if (routePolylineRef.current) routePolylineRef.current.setMap(null);

      const routeLine = new window.google.maps.Polyline({
        path: decodedPath,
        map: mapRef.current,
        strokeColor: "#2337C6",
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });

      routePolylineRef.current = routeLine;
      setRouteCoordinates(
        decodedPath.map((latLng) => [latLng.lng(), latLng.lat()])
      );
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
