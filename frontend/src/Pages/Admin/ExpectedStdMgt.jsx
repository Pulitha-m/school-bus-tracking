import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchIcon, FileTextIcon, FileDownIcon, Bus, Users, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function ExpectedStdMgt() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNoPlate, setFilterNoPlate] = useState("");
  const [filterComing, setFilterComing] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "2025-05-06",
    end: "2025-05-20",
  });

  useEffect(() => {
    fetchExpectedStudents();
  }, []);

  const fetchExpectedStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/availability/getAll");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch expected students", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterNoPlate("");
    setFilterComing("");
    setDateRange({
      start: "2025-05-06",
      end: "2025-05-20",
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      (student.studentName && student.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDate =
      (!dateRange.start || student.date >= dateRange.start) &&
      (!dateRange.end || student.date <= dateRange.end);

    const matchesComing =
      !filterComing ||
      (filterComing === "Yes" && student.coming) ||
      (filterComing === "No" && !student.coming);

    const matchesNoPlate = !filterNoPlate || student.noPlate === filterNoPlate;

    return matchesSearch && matchesDate && matchesComing && matchesNoPlate;
  });

  const exportCSV = () => {
    const currentDate = new Date().toLocaleDateString();

    const titleRow = [`Expected Student Report for ${currentDate} - Bus: ${filterNoPlate || "All Buses"}`];
    const generatedRow = [`Generated on: ${currentDate}`];
    const emptyRow = [""];

    const headers = ["Name", "Email", "Date", "Coming", "Attendance Type", "Reason", "Number Plate"];
    const dataRows = filteredStudents.map((student) => [
      student.studentName || "N/A",
      student.email || "N/A",
      student.date ? new Date(student.date).toLocaleDateString() : "N/A",
      student.coming ? "Yes" : "No",
      student.attendanceType || "N/A",
      student.reason || "N/A",
      student.noPlate || "N/A",
    ]);

    const sheetData = [titleRow, emptyRow, generatedRow, emptyRow, headers, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpectedStudents");
    XLSX.writeFile(workbook, `Expected_Student_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);

    toast.success("CSV Report Downloaded!");
  };

  const exportPDF = async () => {
    const doc = new jsPDF("landscape");
    let currentY = 10;
    const currentDate = new Date().toLocaleDateString();

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
      console.warn("Logo could not be loaded:", error);
      currentY += 10;
    }

    const title = `Expected Student Report for ${currentDate} - Bus: ${filterNoPlate || "All Buses"}`;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, (pageWidth - titleWidth) / 2, currentY);
    currentY += 10;

    const generatedDate = `Generated on: ${currentDate}`;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateWidth = doc.getTextWidth(generatedDate);
    doc.text(generatedDate, (pageWidth - dateWidth) / 2, currentY);
    currentY += 15;

    autoTable(doc, {
      startY: currentY,
      head: [["Name", "Email", "Date", "Coming", "Attendance Type", "Reason", "Number Plate"]],
      body: filteredStudents.map((s) => [
        s.studentName || "N/A",
        s.email || "N/A",
        s.date ? new Date(s.date).toLocaleDateString() : "N/A",
        s.coming ? "Yes" : "No",
        s.attendanceType || "N/A",
        s.reason || "N/A",
        s.noPlate || "N/A",
      ]),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save(`Expected_Student_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const uniqueNoPlates = [...new Set(students.map((s) => s.noPlate).filter(Boolean))];

  const totalStudents = filteredStudents.length;
  const notComingCount = filteredStudents.filter((s) => !s.coming).length;
  const comingByPlate = filteredStudents.filter((s) => s.coming && s.noPlate).length;
  const uniquePlatesWithStudents = [...new Set(filteredStudents.filter((s) => s.coming && s.noPlate).map((s) => s.noPlate))];

  const initialTotalStudents = loading ? 0 : totalStudents;
  const initialNotComing = loading ? 0 : notComingCount;
  const initialComingByPlate = loading ? 0 : comingByPlate;
  const initialPlates = loading ? [] : uniquePlatesWithStudents;

  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Expected Student Management</h1>
        <p className="text-gray-600">Track student availability and pickup expectations</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => navigate("/expected-students")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
        >
          <span>👤</span> Expected Students
        </button>
        <button
          onClick={() => navigate("/admin/attendance-summary")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Attendance Summary
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>

          <select value={filterNoPlate} onChange={(e) => setFilterNoPlate(e.target.value)} className="border rounded-lg px-3 py-2 min-w-[180px]">
            <option value="">All Number Plates</option>
            {uniqueNoPlates.map((plate) => (
              <option key={plate} value={plate}>{plate}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 min-w-[250px]">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <span>-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <select value={filterComing} onChange={(e) => setFilterComing(e.target.value)} className="border rounded-lg px-3 py-2 min-w-[180px]">
            <option value="">All Availability</option>
            <option value="Yes">Coming</option>
            <option value="No">Not Coming</option>
          </select>

          <div className="flex items-center gap-4 ml-auto">
            <button onClick={clearFilters} className="text-gray-600 hover:text-gray-800 whitespace-nowrap">
              Clear Filters
            </button>
            <button onClick={exportPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FileTextIcon size={16} /> Export PDF
            </button>
            <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FileDownIcon size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-500">Total Expected Students</h3>
              <p className="text-3xl font-bold">{initialTotalStudents}</p>
            </div>
            <Users size={24} className="text-blue-500" />
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-500">Not Coming</h3>
              <p className="text-3xl font-bold">{initialNotComing}</p>
            </div>
            <UserX size={24} className="text-red-600" />
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-500">Coming by Number Plate</h3>
                <p className="text-3xl font-bold">{initialComingByPlate}</p>
              </div>
              <Bus size={24} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{initialPlates.length > 0 ? initialPlates.join(", ") : "No data"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found matching the current filters</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coming</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number Plate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((s, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.studentName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {s.date ? new Date(s.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {s.coming ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.attendanceType || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.reason || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.noPlate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
