import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../config/config";

const AddAttendance = () => {
  const [formData, setFormData] = useState({
    email: "",
    studentName: "",
    busId: "",
    busRoute: "",
    noPlate: "", // Added
    coming: true,
    reason: "",
    date: "",
    attendanceType: "Both",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const sessionData = sessionStorage.getItem("user");
        if (!sessionData) throw new Error("No session data found");

        const { id } = JSON.parse(sessionData);

        const response = await axios.get(`${backendUrl}/getStudentById/${id}`, {
          withCredentials: true,
        });
        const studentData = response.data;

        setFormData((prev) => ({
          ...prev,
          email: studentData.user.username,
          busId: studentData.busId,
        }));

        if (studentData.busId) {
          const busResponse = await axios.get(
            `${backendUrl}/getBusById/${studentData.busId}`,
            { withCredentials: true }
          );
          const busData = busResponse.data;

          setFormData((prev) => ({
            ...prev,
            busRoute: busData.routeId || "Not assigned",
            noPlate: busData.noPlate || "Unknown",
          }));
        }
      } catch (err) {
        toast.error("Failed to load student or bus data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = "Student name is required";
    if (formData.coming === null) newErrors.coming = "Please select Coming status";
    if (!formData.date) newErrors.date = "Date is required";
    if (formData.coming === false && !formData.attendanceType)
      newErrors.attendanceType = "Attendance type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post(`${backendUrl}/api/availability`, formData);
      toast.success("Attendance submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split("T")[0];

  if (loading)
    return <div className="text-center py-8">Loading student data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Add Attendance</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
        {/* Student Name */}
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

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Student's email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
            disabled
          />
        </div>

        {/* Number Plate */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Number Plate</label>
          <input
            name="noPlate"
            value={formData.noPlate}
            placeholder="Bus Number Plate"
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
            disabled
          />
        </div>

        {/* Coming? */}
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

        {/* Reason + Attendance Type if not coming */}
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

        {/* Date Picker */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAttendance;
