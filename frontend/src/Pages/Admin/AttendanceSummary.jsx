import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { FileTextIcon, FileDownIcon } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AttendanceSummary() {
  const [expected, setExpected] = useState([]);
  const [actual, setActual] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toISOString().split("T")[0];
  console.log(currentDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expectedRes, actualRes] = await Promise.all([
          axios.get("http://localhost:8080/api/availability/getAll"),
          axios.get("http://localhost:8080/api/attendance", { withCredentials: true })
        ]);
        console.log(actualRes.data)
        setExpected(expectedRes.data);
        setActual(actualRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter expected to only include students marked as "coming" for today
  const expectedToday = expected.filter(
    (s) => s.coming && s.date === currentDate
  );

  const actualToday = actual.filter((a) => {
    if (!["PRESENT", "On-Board"].includes(a.status)) return false;
  
    const scannedDate = new Date(a.scannedAt);
    const today = new Date();
  
    return (
      scannedDate.getFullYear() === today.getFullYear() &&
      scannedDate.getMonth() === today.getMonth() &&
      scannedDate.getDate() === today.getDate()
    );
  });
  
  

  const expectedEmails = expectedToday.map((e) => e.email);
  const actualEmails = actualToday.map((a) => a.email);

  const noShows = expectedToday.filter((e) => !actualEmails.includes(e.email));
  const unexpected = actualToday.filter((a) => !expectedEmails.includes(a.email));

  const totalExpected = expectedToday.length;
  const totalActual = actualToday.filter((a) =>
    expectedEmails.includes(a.email)
  ).length;
  const absentees = totalExpected - totalActual;
  const attendanceAccuracy = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

  const barData = {
    labels: ["Expected", "Actual", "Absent"],
    datasets: [
      {
        label: "Count",
        data: [totalExpected, totalActual, absentees],
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"]
      }
    ]
  };

  const pieData = {
    labels: [`Present (${totalActual})`, `Absent (${absentees})`],
    datasets: [
      {
        data: [totalActual, absentees],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }
    ]
  };

  // Define pieOptions above return
const pieOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 12,
        padding: 8,
      },
    },
  },
};

  

  return (
    <div className="container mx-auto p-4 space-y-6">
    {/* Navigation Tabs */}
    <div>
    <h1 className="text-2xl font-bold text-gray-800">Expected Student Management</h1>
    <p className="text-gray-600">Track student availability and pickup expectations

</p>
    </div>
    <div className="flex space-x-4 mb-4">
<button
  onClick={() => navigate("/admin/expectedStd")}
  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
>
  <span>👤</span> Expected Students
</button>

<button
  onClick={() => navigate("/admin/attendance-summary")}
  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
>
  Attendance Summary
</button>

</div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard label="Total Expected" value={totalExpected} color="text-blue-600" icon="👥" />
            <SummaryCard label="Total Actual" value={totalActual} color="text-green-600" icon="✅" />
            <SummaryCard label="Absentees" value={absentees} color="text-red-600" icon="❌" />
            <SummaryCard label="Attendance Accuracy" value={`${attendanceAccuracy}%`} color="text-purple-600" icon="📊" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  {/* Attendance Overview */}
  <div className="bg-gray-50 p-4 rounded shadow">
    <h3 className="font-semibold mb-2">Attendance Overview</h3>
    <Bar data={barData} />
  </div>

  {/* Attendance Distribution - styled and centered */}
  <div className="bg-gray-50 p-4 rounded shadow">
  <div className="flex items-center justify-center space-x-4">
    <div className="w-[260px] h-[260px] relative">
      <h3 className="font-semibold mb-2">
        Attendance Distribution
      </h3>
      <Pie data={pieData} options={pieOptions} />
    </div>
  </div>
  </div>
</div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded shadow">
              <h3 className="font-semibold text-yellow-800 mb-2">No-shows</h3>
              {noShows.length > 0 ? (
                <ul className="space-y-1">
                  {noShows.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {s.studentName || s.email} <span className="text-xs text-gray-500">{s.noPlate || "N/A"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">None</p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded shadow">
              <h3 className="font-semibold text-blue-800 mb-2">Unexpected Riders</h3>
              {unexpected.length > 0 ? (
                <ul className="space-y-1">
                  {unexpected.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {r.email} <span className="text-xs text-gray-500">{r.busId || "N/A"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">None</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow">
      <div>
        <h3 className="font-medium text-gray-500">{label}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}
