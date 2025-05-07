import React, { useState, useEffect } from "react";
import {
  UsersIcon,
  SearchIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  MoreVerticalIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FilterIcon,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import backendUrl from "../../config/config";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    driverId: "",
    status: "all", // 'all', 'late', 'on-time'
    minDuration: "",
    maxDuration: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch shifts based on filters
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        setError(null);
        const queryParams = new URLSearchParams();
        if (filters.startDate)
          queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        if (filters.driverId) queryParams.append("driverId", filters.driverId);
        if (filters.status !== "all")
          queryParams.append("status", filters.status);
        if (filters.minDuration)
          queryParams.append("minDuration", filters.minDuration);
        if (filters.maxDuration)
          queryParams.append("maxDuration", filters.maxDuration);

        const response = await fetch(
          `${backendUrl}/api/shifts/getAll?${queryParams.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch shifts");
        const data = await response.json();
        setShifts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError("Failed to load shift data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [filters]);

  // Format ISO time string to HH:mm:ss
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const date = new Date(`1970-01-01T${timeStr}Z`);
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  // Convert ISO 8601 duration to readable format (HH:mm:ss)
  const formatDuration = (durationStr) => {
    if (!durationStr) return "-";
    const match = durationStr.match(
      /PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/
    );
    if (!match) return "-";
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
  };

  // Parse duration to total hours for filtering
  const parseDurationToHours = (durationStr) => {
    if (!durationStr) return 0;
    const match = durationStr.match(
      /PT(?:(\d+\.?\d*)H)?(?:(\d+\.?\d*)M)?(?:(\d+\.?\d*)S)?/
    );
    if (!match) return 0;
    const hours = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    return hours + minutes / 60 + seconds / 3600;
  };

  // Filter shifts based on search query and current date
  const filteredShifts = shifts.filter((shift) => {
    const shiftDate = new Date(shift.date);
    const matchesDate = shiftDate.toDateString() === currentDate.toDateString();
    const matchesSearch = shift.driverId.toString().includes(searchQuery);
    return matchesDate && matchesSearch;
  });

  // Calculate statistics based on filtered shifts
  const totalShifts = filteredShifts.length;
  const lateShifts = filteredShifts.filter((shift) => shift.isLate).length;
  const onTimeShifts = totalShifts - lateShifts;
  const avgDuration =
    filteredShifts.reduce((acc, shift) => {
      const hours = parseDurationToHours(shift.totalWorkedTime);
      return acc + hours;
    }, 0) / totalShifts;
  const formattedAvgDuration = isNaN(avgDuration)
    ? "-"
    : `${Math.floor(avgDuration)}h ${Math.round((avgDuration % 1) * 60)}m`;

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      driverId: "",
      status: "all",
      minDuration: "",
      maxDuration: "",
    });
    setSearchQuery("");
  };

  // Navigation for date
  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Report title and metadata
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Driver Shift Report", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, {
      align: "center",
    });
    doc.text(`Date: ${formatDate(currentDate)}`, 105, 28, { align: "center" });

    // Display applied filters
    const appliedFilters = Object.entries(filters)
      .filter(([_, value]) => value && value !== "all")
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    doc.text(`Filters Applied: ${appliedFilters || "None"}`, 105, 34, {
      align: "center",
    });

    // Summary metrics
    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 46);

    doc.setFontSize(12);
    doc.text(`Total Shifts: ${totalShifts}`, 14, 54);
    doc.text(
      `On Time Shifts: ${onTimeShifts} (${
        totalShifts > 0 ? Math.round((onTimeShifts / totalShifts) * 100) : 0
      }%)`,
      14,
      62
    );
    doc.text(
      `Late Shifts: ${lateShifts} (${
        totalShifts > 0 ? Math.round((lateShifts / totalShifts) * 100) : 0
      }%)`,
      14,
      70
    );
    doc.text(`Average Shift Duration: ${formattedAvgDuration}`, 14, 78);

    // Table data preparation
    const tableData = filteredShifts.map((shift) => [
      shift.driverId,
      new Date(shift.date).toLocaleDateString(),
      formatTime(shift.shiftStart),
      formatTime(shift.shiftEnd),
      formatDuration(shift.totalWorkedTime),
      shift.isLate ? "Late" : "On Time",
    ]);

    // Add the table using autoTable
    autoTable(doc, {
      head: [
        ["Driver ID", "Date", "Shift Start", "Shift End", "Duration", "Status"],
      ],
      body: tableData,
      startY: 86,
      theme: "grid",
      headStyles: {
        fillColor: [245, 158, 11], // yellow-500
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // gray-50
      },
      margin: { top: 86 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    doc.save(
      `driver-shift-report-${currentDate.toISOString().slice(0, 10)}.pdf`
    );
  };


  if (loading) {
    return <div className="p-6">Loading shifts...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center">
          <AlertCircleIcon size={20} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shift Management</h1>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
        >
          <DownloadIcon size={18} />
          Export to PDF
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex items-center justify-between">
        <button
          onClick={prevDay}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeftIcon size={24} />
        </button>
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-yellow-500" />
          <span className="text-lg font-semibold">
            {formatDate(currentDate)}
          </span>
        </div>
        <button
          onClick={nextDay}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRightIcon size={24} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon size={20} className="text-yellow-500" />
          <h3 className="text-lg font-semibold">Report Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver ID
            </label>
            <input
              type="text"
              name="driverId"
              value={filters.driverId}
              onChange={handleFilterChange}
              placeholder="Enter Driver ID"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            >
              <option value="all">All</option>
              <option value="on-time">On Time</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Duration (hours)
            </label>
            <input
              type="number"
              name="minDuration"
              value={filters.minDuration}
              onChange={handleFilterChange}
              placeholder="e.g., 4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Duration (hours)
            </label>
            <input
              type="number"
              name="maxDuration"
              value={filters.maxDuration}
              onChange={handleFilterChange}
              placeholder="e.g., 8"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Search Shifts</h3>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Driver ID..."
            className="w-full p-2 border border-gray-300 rounded-md focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Shift Statistics</h3>
          </div>
          {totalShifts === 0 ? (
            <p className="text-sm text-gray-500">No shift data available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon size={16} className="text-blue-500" />
                  <h4 className="font-medium">Average Shift Duration</h4>
                </div>
                <p className="text-2xl font-bold">{formattedAvgDuration}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon size={16} className="text-green-500" />
                  <h4 className="font-medium">Attendance Rate</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${
                          totalShifts > 0
                            ? (onTimeShifts / totalShifts) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {totalShifts > 0
                      ? Math.round((onTimeShifts / totalShifts) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>On Time: {onTimeShifts}</span>
                  <span>Late: {lateShifts}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shift Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClockIcon size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Shift Records</h3>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
        {filteredShifts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No shifts found for the selected criteria.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver ID
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift Start
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift End
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShifts.map((shift, index) => (
                  <tr key={`${shift.id}-${index}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shift.driverId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shift.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(shift.shiftStart)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(shift.shiftEnd)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(shift.totalWorkedTime)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {shift.isLate ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <AlertCircleIcon size={14} className="mr-1" /> Late
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircleIcon size={14} className="mr-1" /> On Time
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreVerticalIcon size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
