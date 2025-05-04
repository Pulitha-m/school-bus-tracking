import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import backendUrl from "../../config/config";
import { EditIcon, DeleteIcon, PlusIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

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

  // Prepare data for the bar chart
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Attendance Status",
        data: attendanceByDay,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            if (value === 1) return "Coming";
            if (value === 0) return "Not Coming";
            return "";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            if (value === 1) return "Coming";
            if (value === 0) return "Not Coming";
            return "No Data";
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const isToday = (date) => {
    const today = new Date();
    const recordDate = new Date(date);
    return today.toDateString() === recordDate.toDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Attendance History</h2>
      <div className="mb-4">
        <button
          onClick={() => navigate("/student/add-attendance")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center"
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
      // Validate name: only letters and one space
      if (!/^[A-Za-z]+ [A-Za-z]+$/.test(value) && value !== "") {
        setErrors(prev => ({ ...prev, studentName: "Name must contain only letters with one space between first and last name" }));
      } else {
        setErrors(prev => ({ ...prev, studentName: undefined }));
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student name is required";
    } else if (!/^[A-Za-z]+ [A-Za-z]+$/.test(formData.studentName)) {
      newErrors.studentName = "Name must contain only letters with one space between first and last name";
    }
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.coming === false && !formData.attendanceType)
      newErrors.attendanceType = "Attendance type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
            {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Student's email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled
            />
          </div>

          <input
            type="hidden"
            name="busId"
            value={formData.busId}
          />

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
            {errors.coming && <p className="text-red-500 text-sm mt-1">{errors.coming}</p>}
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
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Save
            </button>
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
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
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