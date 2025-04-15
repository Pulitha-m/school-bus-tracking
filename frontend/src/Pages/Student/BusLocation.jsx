// import { useState, useEffect, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
//   ZoomControl,
//   Circle,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import backendUrl from "../../config/config";
// import {
//   Bus,
//   MapPin,
//   Navigation,
//   Clock,
//   AlertTriangle,
//   Info,
//   LocateFixed,
//   Route as RouteIcon,
//   Flag,
// } from "lucide-react";

// // Custom bus icon
// const busIcon = new L.Icon({
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// // Component to update map view when position changes
// function MapUpdater({ position, follow }) {
//   const map = useMap();

//   useEffect(() => {
//     if (position && position.lat && position.lng && follow) {
//       map.setView(position, 15);
//     }
//   }, [position, map, follow]);

//   return null;
// }

// // Duration formatter
// function formatDuration(seconds) {
//   if (!seconds) return "N/A";

//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;

//   if (minutes === 0) {
//     return `${remainingSeconds} sec`;
//   }
//   return `${minutes} min ${remainingSeconds} sec`;
// }

// export default function BusTracker() {
//   const [busId, setBusId] = useState(null);
//   const [busInfo, setBusInfo] = useState(null);
//   const [error, setError] = useState("");
//   const [position, setPosition] = useState(null);
//   const [pathCoordinates, setPathCoordinates] = useState([]);
//   const [isWaiting, setIsWaiting] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [homePosition, setHomePosition] = useState(null);
//   const [followBus, setFollowBus] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [estimatedArrival, setEstimatedArrival] = useState(null);
//   const eventSourceRef = useRef(null);
//   const locationUpdateCountRef = useRef(0);

//   useEffect(() => {
//     const fetchBusData = async () => {
//       try {
//         // Get student data from session storage
//         const sessionData = sessionStorage.getItem("user");
//         if (!sessionData) {
//           setError("No session data found");
//           toast.error("No session data found. Please login again.");
//           setLoading(false);
//           return;
//         }

//         const userData = JSON.parse(sessionData);

//         // Get student details to find busId
//         const response = await fetch(
//           `${backendUrl}/getStudentById/${userData.id}`,
//           { credentials: "include" }
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch student data");
//         }

//         const studentData = await response.json();

//         if (!studentData.busId) {
//           setError("No bus assigned to this student");
//           toast.warning("No bus assigned to this student");
//           setLoading(false);
//           return;
//         }

//         // Set home position from student's start location
//         if (studentData.startLocation) {
//           try {
//             // For demo purposes, parsing a string like "lat,lng"
//             // In a real app, you might need to geocode an address
//             const [homeLat, homeLng] = studentData.startLocation
//               .split(",")
//               .map((coord) => parseFloat(coord.trim()));
//             if (!isNaN(homeLat) && !isNaN(homeLng)) {
//               setHomePosition({ lat: homeLat, lng: homeLng });
//             }
//           } catch (e) {
//             console.log("Could not parse home location");
//           }
//         }

//         setBusId(studentData.busId);

//         // Get bus details
//         try {
//           const busResponse = await fetch(
//             `${backendUrl}/getBusById/${studentData.busId}`,
//             { credentials: "include" }
//           );
//           if (busResponse.ok) {
//             const busData = await busResponse.json();
//             setBusInfo(busData);
//           }
//         } catch (e) {
//           console.log("Could not fetch bus details");
//         }

//         setLoading(false);

//         // Now that we have the busId, set up the event source
//         setupEventSource(studentData.busId);
//       } catch (err) {
//         console.error("Error fetching bus data:", err);
//         setError(err.message || "Failed to load data");
//         toast.error("Failed to load bus tracking data");
//         setLoading(false);
//       }
//     };

//     fetchBusData();

//     // Clean up function
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
//     };
//   }, []);

//   const setupEventSource = (id) => {
//     const eventSourceUrl = `${backendUrl}/get-location/${id}`;

//     console.log(`Connecting to EventSource for bus ${id}:`, eventSourceUrl);

//     const eventSource = new EventSource(eventSourceUrl);
//     eventSourceRef.current = eventSource;

//     eventSource.onopen = () => {
//       console.log("EventSource connection opened.");
//       toast.success("Connected to bus tracking service");
//     };

//     eventSource.onmessage = (event) => {
//       console.log("Received location update:", event.data);

//       try {
//         const parsedData = JSON.parse(event.data);
//         console.log("Parsed location data:", parsedData);

//         if (parsedData.latitude && parsedData.longitude) {
//           const newPosition = {
//             lat: parsedData.latitude,
//             lng: parsedData.longitude,
//           };

//           setPosition(newPosition);
//           setPathCoordinates((prev) => [
//             ...prev,
//             [newPosition.lat, newPosition.lng],
//           ]);
//           setIsWaiting(false);
//           setLastUpdate(new Date());

//           // Update location count for animation purposes
//           locationUpdateCountRef.current += 1;

//           // Calculate estimated arrival if we have home position
//           if (homePosition) {
//             // Simple straight-line distance calculation
//             // In a real app, you'd use a routing service for actual ETA
//             const R = 6371e3; // Earth's radius in meters
//             const φ1 = (homePosition.lat * Math.PI) / 180;
//             const φ2 = (newPosition.lat * Math.PI) / 180;
//             const Δφ = ((newPosition.lat - homePosition.lat) * Math.PI) / 180;
//             const Δλ = ((newPosition.lng - homePosition.lng) * Math.PI) / 180;

//             const a =
//               Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//               Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//             const distance = R * c; // in meters

//             // Assume average bus speed of 30 km/h or 8.33 m/s
//             const estimatedTimeSeconds = Math.round(distance / 8.33);
//             setEstimatedArrival(estimatedTimeSeconds);
//           }
//         } else {
//           throw new Error("Invalid location data format");
//         }
//       } catch (error) {
//         console.error("Error parsing location data:", error);
//         setError("Error processing location data. Please refresh.");
//         toast.error("Error processing location data");
//       }
//     };

//     eventSource.onerror = (error) => {
//       console.error("EventSource error:", error);
//       setError("Connection error. Please try again later.");
//       toast.error("Connection error. Trying to reconnect...");
//       eventSource.close();

//       // Try to reconnect after 5 seconds
//       setTimeout(() => setupEventSource(id), 5000);
//     };
//   };

//   // Format time helper
//   const formatTime = (date) => {
//     if (!date) return "N/A";
//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96 w-full">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-amber-500 border-r-transparent mb-4"></div>
//           <p className="text-lg text-gray-600">Loading bus tracking data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//           <Bus className="mr-3 text-amber-500" size={28} />
//           Bus Live Tracker
//         </h1>
//         {busId && (
//           <p className="text-gray-500 mt-1 flex items-center">
//             <Info size={16} className="mr-1" />
//             Tracking Bus ID: <span className="font-semibold ml-1">{busId}</span>
//             {busInfo && busInfo.noPlate && (
//               <span className="ml-2 bg-amber-100 text-amber-800 py-1 px-2 rounded-md text-xs font-medium">
//                 {busInfo.noPlate}
//               </span>
//             )}
//           </p>
//         )}
//       </div>

//       {/* Status Cards */}
//       {!error && busId && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Last Update Card */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//             <div className="flex items-start">
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <Clock className="text-blue-500" size={20} />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-gray-500">
//                   Last Updated
//                 </h3>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {lastUpdate ? formatTime(lastUpdate) : "Waiting..."}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Current Location */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//             <div className="flex items-start">
//               <div className="bg-green-50 p-3 rounded-lg">
//                 <MapPin className="text-green-500" size={20} />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-gray-500">
//                   Current Location
//                 </h3>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {position
//                     ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
//                     : "Unknown"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ETA Card */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//             <div className="flex items-start">
//               <div className="bg-purple-50 p-3 rounded-lg">
//                 <Flag className="text-purple-500" size={20} />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-gray-500">
//                   Est. Arrival Time
//                 </h3>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {estimatedArrival
//                     ? formatDuration(estimatedArrival)
//                     : "Calculating..."}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error message display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//           <AlertTriangle size={20} className="mr-2" />
//           {error}
//         </div>
//       )}

//       {/* Map container with improved styling */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         {/* Map Controls */}
//         {busId && !error && (
//           <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
//             <div className="flex items-center">
//               <RouteIcon size={18} className="text-amber-500 mr-2" />
//               <span className="text-sm font-medium text-gray-700">
//                 Path Points: {pathCoordinates.length}
//               </span>
//             </div>
//             <button
//               onClick={() => setFollowBus(!followBus)}
//               className={`flex items-center text-sm font-medium px-3 py-1 rounded-md ${
//                 followBus
//                   ? "bg-amber-100 text-amber-700"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               <LocateFixed size={16} className="mr-1" />
//               {followBus ? "Following Bus" : "Manual Navigation"}
//             </button>
//           </div>
//         )}

//         <div
//           className={`h-96 md:h-[500px] relative ${
//             position ? "animate-fadeIn" : ""
//           }`}
//         >
//           {busId && !error ? (
//             <MapContainer
//               center={position || homePosition || [0, 0]}
//               zoom={15}
//               style={{ height: "100%", width: "100%" }}
//               zoomControl={false}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 maxZoom={19}
//               />

//               <ZoomControl position="bottomright" />
//               <MapUpdater position={position} follow={followBus} />

//               {/* Bus current position with popup */}
//               {position && (
//                 <Marker
//                   position={position}
//                   icon={busIcon}
//                   className={`animate-pulse-${
//                     locationUpdateCountRef.current % 2 === 0 ? "even" : "odd"
//                   }`}
//                 >
//                   <Popup>
//                     <div className="text-center">
//                       <h3 className="font-bold">Bus {busId}</h3>
//                       {busInfo && busInfo.noPlate && (
//                         <p className="text-sm">{busInfo.noPlate}</p>
//                       )}
//                       <p className="text-xs text-gray-500 mt-1">
//                         Last update: {formatTime(lastUpdate)}
//                       </p>
//                     </div>
//                   </Popup>
//                   <Circle
//                     center={position}
//                     radius={50}
//                     color="#F59E0B"
//                     weight={1}
//                     fillColor="#F59E0B"
//                     fillOpacity={0.15}
//                   />
//                 </Marker>
//               )}

//               {/* Home position marker */}
//               {homePosition && (
//                 <Marker position={homePosition}>
//                   <Popup>
//                     <div className="text-center">
//                       <h3 className="font-bold">Your Location</h3>
//                       <p className="text-xs text-gray-500">
//                         Bus arrival in approximately{" "}
//                         {formatDuration(estimatedArrival)}
//                       </p>
//                     </div>
//                   </Popup>
//                 </Marker>
//               )}

//               {/* Bus path */}
//               {pathCoordinates.length > 0 && (
//                 <Polyline
//                   positions={pathCoordinates}
//                   color="#F59E0B"
//                   weight={4}
//                   opacity={0.7}
//                   dashArray="10, 10"
//                 />
//               )}
//             </MapContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full bg-gray-50">
//               <Navigation size={48} className="text-gray-300 mb-3" />
//               <p className="text-gray-500">No bus data available to track</p>
//             </div>
//           )}

//           {/* Pulse animation overlay for new updates */}
//           {position &&
//             lastUpdate &&
//             Date.now() - lastUpdate.getTime() < 3000 && (
//               <div className="absolute inset-0 bg-amber-500 opacity-10 animate-pulse-fast pointer-events-none"></div>
//             )}
//         </div>
//       </div>

//       {/* Waiting message with improved styling */}
//       {isWaiting && busId && !error && (
//         <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center">
//           <div className="mr-3 w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
//           <p className="text-amber-700 font-medium">
//             Waiting for location updates from bus {busId}...
//           </p>
//         </div>
//       )}

//       {/* Add custom styles for animations */}
//       <style jsx>{`
//         @keyframes pulse-fast {
//           0%,
//           100% {
//             opacity: 0;
//           }
//           50% {
//             opacity: 0.1;
//           }
//         }
//         .animate-pulse-fast {
//           animation: pulse-fast 1s ease-in-out infinite;
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0.3;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  ZoomControl,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";
import {
  Bus,
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  Info,
  LocateFixed,
  Route as RouteIcon,
  Flag,
} from "lucide-react";

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to update map view when position changes
function MapUpdater({ position, follow }) {
  const map = useMap();

  useEffect(() => {
    if (position && position.lat && position.lng && follow) {
      map.setView(position, 15);
    }
  }, [position, map, follow]);

  return null;
}

// Duration formatter
function formatDuration(seconds) {
  if (!seconds) return "N/A";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
}

export default function BusTracker() {
  const [busId, setBusId] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [error, setError] = useState("");
  const [position, setPosition] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [isWaiting, setIsWaiting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [homePosition, setHomePosition] = useState(null);
  const [followBus, setFollowBus] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const eventSourceRef = useRef(null);
  const locationUpdateCountRef = useRef(0);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        // Get student data from session storage
        const sessionData = sessionStorage.getItem("user");
        if (!sessionData) {
          setError("No session data found");
          toast.error("No session data found. Please login again.");
          setLoading(false);
          return;
        }

        const userData = JSON.parse(sessionData);

        // Get student details to find busId
        const response = await fetch(
          `${backendUrl}/getStudentById/${userData.id}`,
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const studentData = await response.json();

        if (!studentData.busId) {
          setError("No bus assigned to this student");
          toast.warning("No bus assigned to this student");
          setLoading(false);
          return;
        }

        // Set home position from student's start location
        if (studentData.startLocation) {
          try {
            // For demo purposes, parsing a string like "lat,lng"
            // In a real app, you might need to geocode an address
            const [homeLat, homeLng] = studentData.startLocation
              .split(",")
              .map((coord) => parseFloat(coord.trim()));
            if (!isNaN(homeLat) && !isNaN(homeLng)) {
              setHomePosition({ lat: homeLat, lng: homeLng });
            }
          } catch (e) {
            console.log("Could not parse home location");
          }
        }

        setBusId(studentData.busId);

        // Get bus details
        try {
          const busResponse = await fetch(
            `${backendUrl}/getBusById/${studentData.busId}`,
            { credentials: "include" }
          );
          if (busResponse.ok) {
            const busData = await busResponse.json();
            setBusInfo(busData);
          }
        } catch (e) {
          console.log("Could not fetch bus details");
        }

        setLoading(false);

        // Now that we have the busId, set up the event source
        setupEventSource(studentData.busId);
      } catch (err) {
        console.error("Error fetching bus data:", err);
        setError(err.message || "Failed to load data");
        toast.error("Failed to load bus tracking data");
        setLoading(false);
      }
    };

    fetchBusData();

    // Clean up function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const setupEventSource = (id) => {
    const eventSourceUrl = `${backendUrl}/get-location/${id}`;

    console.log(`Connecting to EventSource for bus ${id}:`, eventSourceUrl);

    // Note: EventSource does not support credentials: "include" directly.
    // Ensure backend allows credentials via CORS and cookies are sent automatically.
    const eventSource = new EventSource(eventSourceUrl, {
      withCredentials: true,
    });
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("EventSource connection opened.");
      toast.success("Connected to bus tracking service");
    };

    eventSource.onmessage = (event) => {
      console.log("Received location update:", event.data);

      try {
        const parsedData = JSON.parse(event.data);
        console.log("Parsed location data:", parsedData);

        if (parsedData.latitude && parsedData.longitude) {
          const newPosition = {
            lat: parsedData.latitude,
            lng: parsedData.longitude,
          };

          setPosition(newPosition);
          setPathCoordinates((prev) => [
            ...prev,
            [newPosition.lat, newPosition.lng],
          ]);
          setIsWaiting(false);
          setLastUpdate(new Date());

          // Update location count for animation purposes
          locationUpdateCountRef.current += 1;

          // Calculate estimated arrival if we have home position
          if (homePosition) {
            // Simple straight-line distance calculation
            // In a real app, you'd use a routing service for actual ETA
            const R = 6371e3; // Earth's radius in meters
            const φ1 = (homePosition.lat * Math.PI) / 180;
            const φ2 = (newPosition.lat * Math.PI) / 180;
            const Δφ = ((newPosition.lat - homePosition.lat) * Math.PI) / 180;
            const Δλ = ((newPosition.lng - homePosition.lng) * Math.PI) / 180;

            const a =
              Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c; // in meters

            // Assume average bus speed of 30 km/h or 8.33 m/s
            const estimatedTimeSeconds = Math.round(distance / 8.33);
            setEstimatedArrival(estimatedTimeSeconds);
          }
        } else {
          throw new Error("Invalid location data format");
        }
      } catch (error) {
        console.error("Error parsing location data:", error);
        setError("Error processing location data. Please refresh.");
        toast.error("Error processing location data");
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setError("Connection error. Please try again later.");
      toast.error("Connection error. Trying to reconnect...");
      eventSource.close();

      // Try to reconnect after 5 seconds
      setTimeout(() => setupEventSource(id), 5000);
    };
  };

  // Format time helper
  const formatTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-amber-500 border-r-transparent mb-4"></div>
          <p className="text-lg text-gray-600">Loading bus tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Bus className="mr-3 text-amber-500" size={28} />
          Bus Live Tracker
        </h1>
        {busId && (
          <p className="text-gray-500 mt-1 flex items-center">
            <Info size={16} className="mr-1" />
            Tracking Bus ID: <span className="font-semibold ml-1">{busId}</span>
            {busInfo && busInfo.noPlate && (
              <span className="ml-2 bg-amber-100 text-amber-800 py-1 px-2 rounded-md text-xs font-medium">
                {busInfo.noPlate}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Status Cards */}
      {!error && busId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Last Update Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="text-blue-500" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {lastUpdate ? formatTime(lastUpdate) : "Waiting..."}
                </p>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="bg-green-50 p-3 rounded-lg">
                <MapPin className="text-green-500" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Current Location
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {position
                    ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* ETA Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Flag className="text-purple-500" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Est. Arrival Time
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {estimatedArrival
                    ? formatDuration(estimatedArrival)
                    : "Calculating..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Map container with improved styling */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Map Controls */}
        {busId && !error && (
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <RouteIcon size={18} className="text-amber-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Path Points: {pathCoordinates.length}
              </span>
            </div>
            <button
              onClick={() => setFollowBus(!followBus)}
              className={`flex items-center text-sm font-medium px-3 py-1 rounded-md ${
                followBus
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <LocateFixed size={16} className="mr-1" />
              {followBus ? "Following Bus" : "Manual Navigation"}
            </button>
          </div>
        )}

        <div
          className={`h-96 md:h-[500px] relative ${
            position ? "animate-fadeIn" : ""
          }`}
        >
          {busId && !error ? (
            <MapContainer
              center={position || homePosition || [0, 0]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              <ZoomControl position="bottomright" />
              <MapUpdater position={position} follow={followBus} />

              {/* Bus current position with popup */}
              {position && (
                <Marker
                  position={position}
                  icon={busIcon}
                  className={`animate-pulse-${
                    locationUpdateCountRef.current % 2 === 0 ? "even" : "odd"
                  }`}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">Bus {busId}</h3>
                      {busInfo && busInfo.noPlate && (
                        <p className="text-sm">{busInfo.noPlate}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Last update: {formatTime(lastUpdate)}
                      </p>
                    </div>
                  </Popup>
                  <Circle
                    center={position}
                    radius={50}
                    color="#F59E0B"
                    weight={1}
                    fillColor="#F59E0B"
                    fillOpacity={0.15}
                  />
                </Marker>
              )}

              {/* Home position marker */}
              {homePosition && (
                <Marker position={homePosition}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">Your Location</h3>
                      <p className="text-xs text-gray-500">
                        Bus arrival in approximately{" "}
                        {formatDuration(estimatedArrival)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Bus path */}
              {pathCoordinates.length > 0 && (
                <Polyline
                  positions={pathCoordinates}
                  color="#F59E0B"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}
            </MapContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
              <Navigation size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500">No bus data available to track</p>
            </div>
          )}

          {/* Pulse animation overlay for new updates */}
          {position &&
            lastUpdate &&
            Date.now() - lastUpdate.getTime() < 3000 && (
              <div className="absolute inset-0 bg-amber-500 opacity-10 animate-pulse-fast pointer-events-none"></div>
            )}
        </div>
      </div>

      {/* Waiting message with improved styling */}
      {isWaiting && busId && !error && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center">
          <div className="mr-3 w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
          <p className="text-amber-700 font-medium">
            Waiting for location updates from bus {busId}...
          </p>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 0.1;
          }
        }
        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
