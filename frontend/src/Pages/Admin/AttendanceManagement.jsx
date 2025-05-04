import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import backendUrl from "../../config/config";

export default function AttendanceManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("BusID");
  const [filterDate, setFilterDate] = useState("");

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/attendance`, {
        withCredentials: true,
      });
      const sortedRecords = response.data.sort(
        (a, b) => new Date(b.scannedAt) - new Date(a.scannedAt)
      );
      setAttendanceRecords(sortedRecords);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setSearchTerm("");
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const matchesDate = (recordDateStr, selectedDateStr) => {
    const recordDate = new Date(recordDateStr);
    const selectedDate = new Date(selectedDateStr);
    return (
      recordDate.getFullYear() === selectedDate.getFullYear() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getDate() === selectedDate.getDate()
    );
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const term = searchTerm?.toString();

    const matchesTextFilter =
      filterOption === "BusID"
        ? record.busId && record.busId.toString().includes(term)
        : filterOption === "Email"
        ? typeof record.email === "string" && record.email.includes(term)
        : true;

    const matchesDateFilter =
      filterDate === "" || matchesDate(record.scannedAt, filterDate);

    return matchesTextFilter && matchesDateFilter;
  });

  const generateReport = () => {
    const doc = new jsPDF();

    // Load image (make sure logo.png is inside public folder)
    const imageUrl = "/logo.png";
    doc.addImage(imageUrl, "PNG", 10, 10, 30, 30); // Logo on top-left

    // Title: SafeTrack.lk centered
    doc.setFontSize(22);
    doc.text("SafeTrack.lk", doc.internal.pageSize.width / 2, 22, {
      align: "center",
    });

    // Subtitle: Attendance Report centered under the title
    doc.setFontSize(16);
    doc.text("Attendance Report", doc.internal.pageSize.width / 2, 32, {
      align: "center",
    });

    // Add generated date at top-right corner
    const generatedDate = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(
      `Generated Date: ${generatedDate}`,
      doc.internal.pageSize.width - 10,
      40,
      { align: "right" }
    );

    // Attendance Table
    autoTable(doc, {
      head: [["Email", "Scanned At", "Status", "Student ID", "Bus ID"]],
      body: filteredRecords.map((record) => [
        record.email,
        new Date(record.scannedAt).toLocaleString(),
        record.status,
        record.student?.id || "N/A",
        record.busId,
      ]),
      startY: 48, // Start below the generated date line
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 195, 18], textColor: [0, 0, 0] },
    });

    doc.save("attendance_report.pdf");
  };

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  // Function to prevent "@" from being typed
  const handleBusIdInput = (e) => {
    const key = e.key;
    if (key === "@" || /^[a-zA-Z]$/.test(key)) {
      e.preventDefault(); // Prevent typing '@' or any letter
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Attendance Management
      </h2>

      <p className="text-center text-gray-700 mb-4 text-lg font-medium">
        Filter & Search Attendance
      </p>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <select
          className="p-2 border rounded"
          value={filterOption}
          onChange={handleFilterChange}
        >
          <option value="BusID">Bus ID</option>
          <option value="Email">Email</option>
        </select>
        <input
          type="text"
          className="p-2 border rounded"
          placeholder={`Search by ${filterOption}`}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={filterOption === "BusID" ? handleBusIdInput : null} // Only apply to BusID field
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={filterDate}
          onChange={handleDateChange}
          max={currentDate} // Prevent future dates from being selected
        />
        <button
          onClick={generateReport}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate PDF Report
        </button>
      </div>

      {loading && <p>Loading attendance records...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading &&
        !error &&
        (searchTerm || filterDate) &&
        filteredRecords.length === 0 && <p>No attendance records found.</p>}

      {!loading &&
        !error &&
        filteredRecords.length > 0 &&
        (searchTerm || filterDate) && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-[#FFC312] text-black">
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Scanned At</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Student ID</th>
                  <th className="py-2 px-4 border">Bus ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{record.email}</td>
                    <td className="py-2 px-4 border">
                      {new Date(record.scannedAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border">{record.status}</td>
                    <td className="py-2 px-4 border">
                      {record.student?.id || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{record.busId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
