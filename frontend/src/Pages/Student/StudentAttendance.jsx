import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import backendUrl from "../../config/config";

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  // Retrieve the user's email from sessionStorage ("user" key)
  const sessionData = sessionStorage.getItem("user");
  const studentEmail = sessionData ? JSON.parse(sessionData).username : null;

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentEmail) {
        setError("No user session found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${backendUrl}/getStudentByEmail/${studentEmail}`,
          { withCredentials: true }
        );

        if (!response.data) {
          setError("Student not found in the system.");
          return;
        }

        setStudentDetails(response.data);
      } catch (err) {
        setError("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentEmail]);

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      if (!studentEmail) {
        setError("No user session found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${backendUrl}/api/attendance/${studentEmail}`,
          { withCredentials: true }
        );

        setRecords(response.data);
      } catch (err) {
        setError("Failed to fetch your attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAttendance();
  }, [studentEmail, filterDate]);

  const matchesDate = (recordDateStr, selectedDateStr) => {
    const recordDate = new Date(recordDateStr);
    const selectedDate = new Date(selectedDateStr);
    return (
      recordDate.getFullYear() === selectedDate.getFullYear() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getDate() === selectedDate.getDate()
    );
  };

  const filtered = records.filter((record) =>
    filterDate ? matchesDate(record.scannedAt, filterDate) : true
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addImage("/logo.png", "PNG", 10, 10, 30, 30);

    doc.setFontSize(22);
    doc.text("SafeTrack.lk", doc.internal.pageSize.width / 2, 22, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text("My Attendance Report", doc.internal.pageSize.width / 2, 32, {
      align: "center",
    });

    // Add generated date on the top-right
    const generatedDate = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(
      `Generated Date: ${generatedDate}`,
      doc.internal.pageSize.width - 10,
      40,
      {
        align: "right",
      }
    );

    autoTable(doc, {
      head: [["Date/Time", "Status", "Bus ID"]],
      body: filtered.map((r) => [
        new Date(r.scannedAt).toLocaleString(),
        r.status,
        r.busId,
      ]),
      startY: 48, // Make sure it starts after the date
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 102, 204] },
    });

    doc.save("my_attendance.pdf");
  };

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-gray-50 p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-700">
        My Attendance
      </h2>

      {loading && <p>Loading student details...</p>}
      {studentDetails && (
        <div className="mb-4">
          <h3 className="text-lg">Student Details</h3>
          <p>Bus ID: {studentDetails.busId}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          max={currentDate}
          className="p-2 border rounded"
        />
        <button
          onClick={generatePDF}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && filtered.length === 0 && <p>No records found.</p>}

      {!loading && filtered.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg mt-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-[#FFC512] text-black text-left">
              <tr>
                <th className="py-3 px-4 border-b">Date/Time</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Bus ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="py-3 px-4 border-b">
                    {new Date(r.scannedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b">{r.status}</td>
                  <td className="py-3 px-4 border-b">{r.busId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
