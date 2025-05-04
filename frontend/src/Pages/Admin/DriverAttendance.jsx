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
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all"); // 'all', 'late', 'on-time'

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/shifts/getAll");
        const data = await response.json();
        setShifts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  // Format ISO time string to HH:mm:ss
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const date = new Date(`1970-01-01T${timeStr}Z`);
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  // Convert ISO 8601 duration to readable format
  const formatDuration = (durationStr) => {
    const match = durationStr.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/
    );
    if (!match) return "-";
    const [, h, m, s] = match.map((v) => parseFloat(v) || 0);
    return [h, m, s]
      .map((v) => String(Math.floor(v)).padStart(2, "0"))
      .join(":");
  };

  // Filter shifts based on current filter
  const filteredShifts = shifts.filter((shift) => {
    if (filter === "late") return shift.isLate;
    if (filter === "on-time") return !shift.isLate;
    return true;
  });

  // Calculate statistics
  const totalShifts = shifts.length;
  const lateShifts = shifts.filter((shift) => shift.isLate).length;
  const onTimeShifts = totalShifts - lateShifts;
  const avgDuration =
    shifts.reduce((acc, shift) => {
      const duration = formatDuration(shift.totalWorkedTime);
      const [h, m, s] = duration.split(":").map(Number);
      return acc + h * 3600 + m * 60 + s;
    }, 0) / totalShifts;

  const formattedAvgDuration = isNaN(avgDuration)
    ? "-"
    : new Date(avgDuration * 1000).toISOString().substr(11, 8);

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

    // Report title and date
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Driver Shift Report", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, {
      align: "center",
    });
    doc.text(`Date Range: ${formatDate(currentDate)}`, 105, 28, {
      align: "center",
    });

    // Summary metrics
    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 40);

    doc.setFontSize(12);
    doc.text(`Total Shifts: ${totalShifts}`, 14, 48);
    doc.text(
      `On Time Shifts: ${onTimeShifts} (${
        totalShifts > 0 ? Math.round((onTimeShifts / totalShifts) * 100) : 0
      }%)`,
      14,
      56
    );
    doc.text(
      `Late Shifts: ${lateShifts} (${
        totalShifts > 0 ? Math.round((lateShifts / totalShifts) * 100) : 0
      }%)`,
      14,
      64
    );
    doc.text(`Average Shift Duration: ${formattedAvgDuration}`, 14, 72);

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
      startY: 80,
      theme: "grid",
      headStyles: {
        fillColor: [245, 158, 11], // yellow-500
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // gray-50
      },
      margin: { top: 80 },
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
      `driver-shift-report-${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };
};
export default ShiftManagement;
