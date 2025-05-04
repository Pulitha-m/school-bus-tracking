import React, { useEffect, useRef, useState } from "react";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import {
  SearchIcon,
  ChevronDown as ChevronDownIcon,
  FileText as FileTextIcon,
  Loader2 as LoaderIcon,
  Calendar as CalendarIcon,
  RefreshCw as RefreshIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import backendUrl from "../../config/config";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function AllBusLocations() {
  const [busLocations, setBusLocations] = useState([]);
  const [busHistory, setBusHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuses, setSelectedBuses] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showBusDropdown, setShowBusDropdown] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [mapZoom, setMapZoom] = useState(8);

  const mapRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch bus locations on mount
  useEffect(() => {
    fetchBusLocations();
  }, []);

  // Fetch bus history when date or selected buses change
  useEffect(() => {
    if (selectedDate && selectedBuses.length > 0) {
      fetchBusHistory();
    } else {
      setBusHistory([]);
    }
  }, [selectedDate, selectedBuses]);

  // Handle click outside to close bus dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBusLocations = async () => {
    try {
      const res = await axios.get(`${backendUrl}/all-current-locations`, {
        withCredentials: true,
      });
      const grouped = groupByLatestLocation(res.data);
      setBusLocations(grouped);
    } catch (error) {
      console.error("Failed to load bus locations", error);
      toast.error("Failed to fetch buses");
    }
  };

  const fetchBusHistory = async () => {
    if (!selectedDate || selectedBuses.length === 0) return;

    setIsLoadingHistory(true);
    try {
      let allHistoryData = [];
      const selectedDateObj = new Date(selectedDate);

      for (const busId of selectedBuses) {
        const res = await axios.get(`${backendUrl}/location-history/${busId}`, {
          withCredentials: true,
        });

        const filteredData = res.data.filter((location) => {
          const locationDate = new Date(location.timestamp);
          return locationDate.toDateString() === selectedDateObj.toDateString();
        });

        allHistoryData = [...allHistoryData, ...filteredData];
      }

      setBusHistory(allHistoryData);

      if (allHistoryData.length > 0) {
        const latitudes = allHistoryData.map((loc) => loc.latitude);
        const longitudes = allHistoryData.map((loc) => loc.longitude);
        const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLng =
          longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(12);
      }

      toast.success(`Loaded history data for ${selectedBuses.length} bus(es)`);
    } catch (error) {
      console.error("Failed to load bus history", error);
      toast.error("Failed to fetch bus history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const groupByLatestLocation = (locations) => {
    const latest = {};
    locations.forEach((loc) => {
      const key = loc.busId;
      if (
        !latest[key] ||
        new Date(loc.timestamp) > new Date(latest[key].timestamp)
      ) {
        latest[key] = loc;
      }
    });
    return Object.values(latest);
  };

  const handleBusSelection = (busId) => {
    setSelectedBuses((prev) =>
      prev.includes(busId)
        ? prev.filter((id) => id !== busId)
        : [...prev, busId]
    );
  };

  const deduplicateData = (data) => {
    const uniqueData = [];
    const seenTimestamps = new Set();

    data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    data.forEach((bus) => {
      const timestamp = new Date(bus.timestamp).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const key = `${bus.busId}-${timestamp}`;

      if (!seenTimestamps.has(key)) {
        seenTimestamps.add(key);
        uniqueData.push(bus);
      }
    });

    return uniqueData;
  };

  const handleDownload = async (format) => {
    try {
      setIsDownloading(true);

      if (!selectedDate) {
        toast.error("Please select a date first.");
        return;
      }

      if (selectedBuses.length === 0) {
        toast.error("Please select at least one bus.");
        return;
      }

      let dataToExport = historyTableData.length > 0 ? historyTableData : [];

      if (dataToExport.length === 0) {
        toast.error("No data available for the selected filters.");
        return;
      }

      if (format === "csv") {
        const csvData = dataToExport.map((bus) => ({
          BusID: bus.busId,
          NoPlate: bus.noPlate || "N/A",
          Latitude: bus.latitude,
          Longitude: bus.longitude,
          LastUpdated: new Date(bus.timestamp).toLocaleString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bus Locations");
        const fileName = `bus_location_report_${selectedDate}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast.success("CSV Report Downloaded!");
      } else if (format === "pdf") {
        const doc = new jsPDF();
        let currentY = 10;

        try {
          const logoUrl = "/logost.png";
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = logoUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const imgWidth = 50;
          const imgHeight = (img.height * imgWidth) / img.width;
          const pageWidth = doc.internal.pageSize.getWidth();
          const logoX = (pageWidth - imgWidth) / 2;
          doc.addImage(img, "PNG", logoX, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
        } catch (error) {
          console.error("Failed to load logo:", error);
          toast.warn("Logo not included in PDF due to loading issue.");
          currentY += 10;
        }

        const uniquePlates = [
          ...new Set(dataToExport.map((bus) => bus.noPlate || "N/A")),
        ];
        const noPlates = uniquePlates.join(", ");

        const title = `Bus Location History Report for ${selectedDate} bus : ${noPlates}`;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        const titleWidth = doc.getTextWidth(title);
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(title, (pageWidth - titleWidth) / 2, currentY);
        currentY += 10;

        const generatedDate = `Generated on: ${new Date().toLocaleDateString()}`;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const dateWidth = doc.getTextWidth(generatedDate);
        doc.text(generatedDate, (pageWidth - dateWidth) / 2, currentY);
        currentY += 15;

        if (mapRef.current && mapLoaded) {
          try {
            const map = mapRef.current;
            if (busHistory.length > 0) {
              const points = busHistory.map((loc) => [
                loc.latitude,
                loc.longitude,
              ]);
              const bounds = L.latLngBounds(points);
              map.fitBounds(bounds, { padding: [50, 50] });
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mapElement = map.getContainer();
            const canvas = await html2canvas(mapElement, {
              useCORS: true,
              logging: true,
              scale: 3,
            });
            const imgData = canvas.toDataURL("image/png");
            const mapImgWidth = 180;
            const mapImgHeight = (canvas.height * mapImgWidth) / canvas.width;
            const mapX = (pageWidth - mapImgWidth) / 2;
            if (
              currentY + mapImgHeight >
              doc.internal.pageSize.getHeight() - 20
            ) {
              doc.addPage();
              currentY = 10;
            }
            doc.addImage(
              imgData,
              "PNG",
              mapX,
              currentY,
              mapImgWidth,
              mapImgHeight
            );
            currentY += mapImgHeight + 10;
          } catch (error) {
            console.error("Failed to capture map for PDF:", error);
            toast.warn("Map not included in PDF due to rendering issue.");
            currentY += 10;
          }
        }

        autoTable(doc, {
          startY: currentY,
          head: [["Bus ID", "No Plate", "Latitude", "Longitude", "Timestamp"]],
          body: dataToExport.map((bus) => [
            bus.busId,
            bus.noPlate || "N/A",
            bus.latitude.toFixed(5),
            bus.longitude.toFixed(5),
            new Date(bus.timestamp).toLocaleString(),
          ]),
          theme: "grid",
          styles: { halign: "center" },
          headStyles: { fillColor: [59, 130, 246] },
        });

        const fileName = `bus_location_report_${selectedDate}.pdf`;
        doc.save(fileName);
        toast.success("PDF Report Downloaded!");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report!");
    } finally {
      setIsDownloading(false);
    }
  };

  // Clear selections and refresh latest locations
  const handleClear = () => {
    setSelectedBuses([]);
    setSelectedDate("");
    setBusHistory([]);
    setSearchTerm("");
    setMapCenter([7.8731, 80.7718]);
    setMapZoom(8);
    fetchBusLocations();
    toast.info("Filters cleared and latest locations refreshed");
  };

  // Handle overlapping markers by adding slight offset
  const getOffsetPosition = (position, index, total) => {
    if (total <= 1) return position;
    const angle = (index / total) * 2 * Math.PI;
    const offset = 0.0002; // Adjust offset distance (~10 meters)
    return [
      position[0] + offset * Math.cos(angle),
      position[1] + offset * Math.sin(angle),
    ];
  };

  const filteredHistory = busHistory.filter((location) => {
    const term = searchTerm.toLowerCase();
    return (
      location.noPlate?.toLowerCase().includes(term) ||
      location.latitude?.toString().includes(term) ||
      location.longitude?.toString().includes(term) ||
      new Date(location.timestamp).toLocaleString().toLowerCase().includes(term)
    );
  });

  const latestTableData = deduplicateData(busLocations); // Show all latest, no filtering
  const historyTableData = deduplicateData(filteredHistory); // Only history is filtered

  return (
    <div className="p-6 space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Bus Location Tracking
      </h1>

      {/* Map */}
      <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "500px", width: "100%" }}
          ref={mapRef}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution='© <a href="https://www.google.com/maps">Google Maps</a>'
          />

          {/* Current bus locations */}
          {busHistory.length === 0 &&
            busLocations.map((bus, index) => {
              const position = [bus.latitude, bus.longitude];
              const overlappingBuses = busLocations.filter((b) => {
                const latDiff = Math.abs(b.latitude - bus.latitude);
                const lngDiff = Math.abs(b.longitude - bus.longitude);
                return latDiff < 0.0001 && lngDiff < 0.0001;
              });

              const offsetPosition = getOffsetPosition(
                position,
                overlappingBuses.indexOf(bus),
                overlappingBuses.length
              );

              return (
                <Marker
                  key={`${bus.busId}-${index}`}
                  position={offsetPosition}
                  icon={busIcon}
                >
                  <Popup>
                    <div className="text-center space-y-1">
                      <p>
                        <strong>Bus ID:</strong> {bus.busId}
                      </p>
                      <p>
                        <strong>No Plate:</strong> {bus.noPlate || "N/A"}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>
                        <br />
                        {new Date(bus.timestamp).toLocaleString()}
                      </p>
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/bus-history/${bus.busId}`)
                        }
                        className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                      >
                        View Full History
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Bus history markers */}
          {/* Bus history markers (deduplicated by lat+lng) */}
          {[
            ...new Map(
              busHistory.map((loc) => [
                `${loc.busId}-${loc.latitude.toFixed(
                  5
                )}-${loc.longitude.toFixed(5)}`,
                loc,
              ])
            ).values(),
          ].map((location, index, arr) => {
            const position = [location.latitude, location.longitude];

            const overlapping = arr.filter(
              (l) =>
                l.latitude.toFixed(5) === location.latitude.toFixed(5) &&
                l.longitude.toFixed(5) === location.longitude.toFixed(5)
            );

            const offsetPosition = getOffsetPosition(
              position,
              overlapping.indexOf(location),
              overlapping.length
            );

            return (
              <Marker
                key={`history-${location.busId}-${index}`}
                position={offsetPosition}
                icon={busIcon}
              >
                <Popup>
                  <div className="text-center space-y-1">
                    <p>
                      <strong>Bus ID:</strong> {location.busId}
                    </p>
                    <p>
                      <strong>No Plate:</strong> {location.noPlate || "N/A"}
                    </p>
                    <p>
                      <strong>Time:</strong>
                      <br />
                      {new Date(location.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Latest Locations Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Latest Bus Locations
        </h2>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {/* <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Bus ID
                </th> */}
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  No Plate
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Latitude
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Longitude
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {latestTableData.length > 0 ? (
                latestTableData.map((location, idx) => (
                  <tr
                    key={`latest-${location.busId}-${idx}`}
                    className="hover:bg-blue-50"
                  >
                    {/* <td className="py-3 px-4">{location.busId}</td> */}
                    <td className="py-3 px-4">{location.noPlate || "N/A"}</td>
                    <td className="py-3 px-4">
                      {location.latitude?.toFixed(5)}
                    </td>
                    <td className="py-3 px-4">
                      {location.longitude?.toFixed(5)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(location.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No latest bus locations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtering and Report Generation */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Filters & Reports</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search records"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Bus Selection Dropdown */}
          <div className="relative min-w-[200px]" ref={dropdownRef}>
            <button
              onClick={() => setShowBusDropdown(!showBusDropdown)}
              className="w-full flex items-center justify-between px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
            >
              <span>
                {selectedBuses.length > 0
                  ? `${selectedBuses.length} bus(es) selected`
                  : "Select Buses"}
              </span>
              <ChevronDownIcon size={18} />
            </button>
            {showBusDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {busLocations.length > 0 ? (
                  busLocations.map((bus) => (
                    <label
                      key={bus.busId}
                      className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBuses.includes(bus.busId)}
                        onChange={() => handleBusSelection(bus.busId)}
                        className="mr-2"
                      />
                      {bus.busId} ({bus.noPlate || "N/A"})
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No buses available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="relative min-w-[200px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <CalendarIcon
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Load History Button */}
          <button
            onClick={fetchBusHistory}
            disabled={
              !selectedDate || selectedBuses.length === 0 || isLoadingHistory
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoadingHistory ? (
              <>
                <LoaderIcon className="animate-spin" size={18} />
                <span>Loading...</span>
              </>
            ) : (
              <span>Show History</span>
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow-sm flex items-center gap-2"
          >
            <RefreshIcon size={18} />
            <span>Clear & Refresh</span>
          </button>
        </div>

        {/* Download Reports */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Generate Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DownloadCard
              title="Download CSV"
              icon={<FileTextIcon size={24} />}
              format="csv"
              onDownload={handleDownload}
              loading={isDownloading}
            />
            <DownloadCard
              title="Download PDF"
              icon={<FileTextIcon size={24} />}
              format="pdf"
              onDownload={handleDownload}
              loading={isDownloading}
            />
          </div>
        </div>
      </div>

      {/* Bus History Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Bus Location History
        </h2>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  No Plate
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Latitude
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Longitude
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-600">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyTableData.length > 0 ? (
                historyTableData.map((location, idx) => (
                  <tr
                    key={`history-${location.busId}-${idx}`}
                    className="hover:bg-blue-50"
                  >
                    {/* <td className="py-3 px-4">{location.busId}</td> */}
                    <td className="py-3 px-4">{location.noPlate || "N/A"}</td>
                    <td className="py-3 px-4">
                      {location.latitude?.toFixed(5)}
                    </td>
                    <td className="py-3 px-4">
                      {location.longitude?.toFixed(5)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(location.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    {selectedDate
                      ? "No history data available for the selected date and buses."
                      : "Please select buses and date to view history."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DownloadCard = ({ title, icon, format, onDownload, loading }) => (
  <button
    onClick={() => onDownload(format)}
    disabled={loading}
    className="flex items-center justify-center gap-3 w-full bg-white shadow-sm border border-gray-200 p-4 rounded-md hover:bg-blue-50 transition disabled:opacity-50"
  >
    {loading ? <LoaderIcon className="animate-spin" size={20} /> : icon}
    <span className="font-semibold text-gray-700">
      {loading ? "Preparing..." : title}
    </span>
  </button>
);
