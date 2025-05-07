import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import backendUrl from "../../config/config";
import { EditIcon, DeleteIcon, PlusIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


// Register Chart.js components for bar chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MarkAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, recordId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = async () => {
    try {
      const sessionData = sessionStorage.getItem("user");
      if (!sessionData) throw new Error("No session data");

      const { username } = JSON.parse(sessionData);

      const response = await axios.get(`${backendUrl}/api/availability/student/${username}`);
      // Filter records for last 7 days and sort by date descending
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const filteredRecords = response.data
        .filter(record => new Date(record.date) >= oneWeekAgo)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAttendanceRecords(filteredRecords);
      setLoading(false);
    } catch (err) {
      setError("Failed to load attendance records");
      setLoading(false);
      console.error("Error loading attendance records:", err);
    }
  };

  const deleteAttendance = async (recordId) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${backendUrl}/api/availability/${recordId}`);
      toast.success("Attendance record deleted successfully!");
      loadAttendanceRecords();
    } catch (err) {
      toast.error("Failed to delete attendance record");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, recordId: null });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  const handleSubmitEdit = async (updatedData) => {
    try {
      // Check if another record exists for the same date
      const existingRecord = attendanceRecords.find(
        record => 
          new Date(record.date).toDateString() === new Date(updatedData.date).toDateString() &&
          record.id !== editingRecord.id
      );

      if (existingRecord) {
        toast.error("An attendance record already exists for this date");
        return;
      }

      await axios.put(`${backendUrl}/api/availability/${editingRecord.id}`, updatedData);
      toast.success("Attendance updated successfully!");
      loadAttendanceRecords();
      handleCancelEdit();
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  <div className="bg-white p-8 rounded-xl shadow-lg mt-6">
  <h3 className="text-xl font-bold text-yellow-500 mb-4">Attendance Calendar</h3>
  <Calendar
    tileContent={({ date, view }) => {
      if (view === "month") {
        const match = attendanceRecords.find(
          (record) => new Date(record.date).toDateString() === date.toDateString()
        );

        if (match) {
          return (
            <div className="text-xs text-center mt-1">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  match.coming ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
            </div>
          );
        } else {
          return (
            <div className="text-xs text-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          );
        }
      }
    }}
  />
</div>

  // Prepare data for the bar chart
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceByDay = daysOfWeek.map((_, index) => {
    const dayRecords = attendanceRecords.filter((record) => {
      const date = new Date(record.date);
      const dayOfWeek = (date.getDay() + 6) % 7;
      return dayOfWeek === index;
    });

    if (dayRecords.length === 0) return -1;

    const latestRecord = dayRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return latestRecord.coming ? 1 : 0;
  });

  const backgroundColors = attendanceByDay.map((status) => {
    if (status === 1) return "#34D399";
    if (status === 0) return "#F87171";
    return "#D1D5DB";
  });

  const comingCounts = Array(7).fill(0);
const notComingCounts = Array(7).fill(0);
const noDataCounts = Array(7).fill(1); // Assume 1 slot per day initially, subtract if data exists

attendanceRecords.forEach((record) => {
  const date = new Date(record.date);
  const dayOfWeek = (date.getDay() + 6) % 7;

  noDataCounts[dayOfWeek] = 0; // Data exists for this day

  if (record.coming) {
    comingCounts[dayOfWeek]++;
  } else {
    notComingCounts[dayOfWeek]++;
  }
});

// Set 1 for no data where both counts are zero
noDataCounts.forEach((_, i) => {
  if (comingCounts[i] === 0 && notComingCounts[i] === 0) {
    noDataCounts[i] = 1;
  }
});

const chartData = {
  labels: daysOfWeek,
  datasets: [
    {
      label: "Coming",
      data: comingCounts,
      backgroundColor: "#34D399", // green
    },
    {
      label: "Not Coming",
      data: notComingCounts,
      backgroundColor: "#F87171", // red
    },
    {
      label: "No Data",
      data: noDataCounts,
      backgroundColor: "#D1D5DB", // gray
    },
  ],
};


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          return `${context.dataset.label}: ${value}`;
        },
      },
    },
  },
};


  const isToday = (date) => {
    const today = new Date();
    const recordDate = new Date(date);
    return today.toDateString() === recordDate.toDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Expected Attendance History</h2>
      <div className="bg-yellow-500 text-white flex justify-between items-center px-6 py-4 rounded-xl shadow-lg mb-6">
  <div className="flex items-center space-x-3">
    <span className="text-2xl">🚌</span>
    <p className="font-bold text-lg">Don't miss the bus! Mark your attendance now</p>
  </div>
  <button
    onClick={() => navigate("/student/add-attendance")}
    className="flex items-center bg-white text-yellow-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition"
  >
    <PlusIcon className="h-5 w-5 mr-2" />
    Add Attendance
  </button>
</div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
            {attendanceRecords.length === 0 ? (
              <p className="text-gray-600">No records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-gray-700">Date</th>
                      <th className="py-3 px-4 text-gray-700">Status</th>
                      <th className="py-3 px-4 text-gray-700">Reason</th>
                      <th className="py-3 px-4 text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr 
                        key={record.id} 
                        className={`border-b hover:bg-gray-50 ${isToday(record.date) ? 'bg-yellow-100' : ''}`}
                      >
                        <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{record.coming ? "Coming" : "Not Coming"}</td>
                        <td className="py-3 px-4">{record.reason || "-"}</td>
                        <td className="py-3 px-4 flex space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, recordId: record.id })}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {attendanceRecords.length > 0 && (
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <h3 className="text-xl font-bold text-yellow-500 mb-4">Expected Attendance Overview</h3>
    <div className="w-full h-64">
      <Bar data={chartData} options={chartOptions} />
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        {daysOfWeek.map((day, index) => {
          const dayRecords = attendanceRecords.filter((record) => {
            const date = new Date(record.date);
            const dayOfWeek = (date.getDay() + 6) % 7;
            return dayOfWeek === index;
          });

          const latestDate = dayRecords.length > 0
            ? new Date(
                dayRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
              ).toLocaleDateString()
            : "—";

          return (
            <div key={index} className="flex-1 text-center">
              <div>{latestDate}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

        </>
      )}

      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSubmit={handleSubmitEdit}
        record={editingRecord}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, recordId: null })}
        onConfirm={() => deleteAttendance(deleteModal.recordId)}
        isDeleting={isDeleting}
      />
      <ToastContainer />
    </div>
  );
};

const EditModal = ({ isOpen, onClose, onSubmit, record }) => {
  const [formData, setFormData] = useState({
    email: "",
    studentName: "",
    busId: "",
    coming: true,
    reason: "",
    date: "",
    attendanceType: "Both",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && record) {
      setFormData({
        email: record.email || "",
        studentName: record.studentName || "",
        busId: record.busId || "",
        coming: record.coming !== undefined ? record.coming : true,
        reason: record.reason || "",
        date: record.date ? new Date(record.date).toISOString().split("T")[0] : "",
        attendanceType: record.attendanceType || "Both",
      });
      setErrors({});
    }
  }, [isOpen, record]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "studentName") {
      const allowed = /^[A-Za-z ]*$/;
      if (!allowed.test(value)) return;

      const trimmed = value.trim();
      const namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
      if (trimmed === "") {
        setErrors((prev) => ({ ...prev, studentName: "Student name is required" }));
      } else if (!namePattern.test(trimmed)) {
        setErrors((prev) => ({
          ...prev,
          studentName: "Name must have two words with only letters and one space (e.g., John Doe)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, studentName: undefined }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.studentName.trim();
    const namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
  
    if (!trimmedName) {
      newErrors.studentName = "Student name is required";
    } else if (!namePattern.test(trimmedName)) {
      newErrors.studentName = "Name must have two words with only letters and one space (e.g., John Doe)";
    }
  
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
      if (day === 0 || day === 6) {
        newErrors.date = "Attendance cannot be marked for Saturdays or Sundays.";
      }
    }
  
    if (formData.coming === false && !formData.attendanceType) {
      newErrors.attendanceType = "Attendance type is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    onSubmit(formData);
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split("T")[0];

  return (
    <div
      className={`fixed inset-0 bg-white flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-yellow-500 mb-6">Edit Attendance</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Student Full Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student full name"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.studentName ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.studentName && (
              <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled
            />
          </div>

          <input type="hidden" name="busId" value={formData.busId} />

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Coming?</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coming"
                  checked={formData.coming === true}
                  onChange={() => setFormData((prev) => ({ ...prev, coming: true }))}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="coming"
                  checked={formData.coming === false}
                  onChange={() => setFormData((prev) => ({ ...prev, coming: false }))}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {formData.coming === false && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Reason (optional)</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="E.g. Sick, Not available"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Attendance Type</label>
                <select
                  name="attendanceType"
                  value={formData.attendanceType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="Both">Both</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
                {errors.attendanceType && (
                  <p className="text-red-500 text-sm mt-1">{errors.attendanceType}</p>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={formatDate(today)}
              max={formatDate(maxDate)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Save
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};






const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <div
      className={`fixed inset-0 bg-white flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this attendance record?</p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default MarkAttendance;