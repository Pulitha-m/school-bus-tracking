import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import backendUrl from "../../config/config";
import DatePicker from "react-multi-date-picker";

const AddAttendance = () => {
  const [formData, setFormData] = useState({
    email: "",
    studentName: "",
    busId: "",
    busRoute: "",
    noPlate: "",
    coming: true,
    reason: "",
    dates: [],
    attendanceType: "Both",
    existingRecords: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const sessionData = sessionStorage.getItem("user");
        if (!sessionData) throw new Error("No session data found");

        const { id, username } = JSON.parse(sessionData);

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

        const attendanceResponse = await axios.get(`${backendUrl}/api/availability/student/${username}`);
        const existingRecords = attendanceResponse.data;
        setFormData((prev) => ({ ...prev, existingRecords }));
      } catch (err) {
        toast.error("Failed to load student or bus data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "studentName") {
      const allowed = /^[A-Za-z ]*$/;
      if (!allowed.test(value)) return;

      setFormData((prev) => ({ ...prev, studentName: value }));

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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
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
  
    if (formData.coming === null) newErrors.coming = "Please select Coming status";
  
    if (!Array.isArray(formData.dates) || formData.dates.length === 0) {
      newErrors.dates = "Please select at least one date";
    } else {
      const weekendDates = formData.dates.filter((date) => {
        const day = date.toDate().getDay(); // 0 = Sunday, 6 = Saturday
        return day === 0 || day === 6;
      });
  
      if (weekendDates.length > 0) {
        const formattedWeekends = weekendDates
          .map((d) => d.toDate().toISOString().split("T")[0])
          .join(", ");
        newErrors.dates = `Weekends are not allowed: ${formattedWeekends}`;
      }
    }
  
    if (formData.coming === false && !formData.attendanceType)
      newErrors.attendanceType = "Attendance type is required";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const duplicateDates = [];

    // Check for duplicates only
    for (let selectedDate of formData.dates) {
      const formattedDate = selectedDate.toDate().toISOString().split("T")[0];
      const recordExists = formData.existingRecords.some(
        (record) => new Date(record.date).toDateString() === new Date(formattedDate).toDateString()
      );
      if (recordExists) duplicateDates.push(formattedDate);
    }

    if (duplicateDates.length > 0) {
      toast.error(`❌ Attendance already exists for: ${duplicateDates.join(", ")}`);
      return;
    }

    // ✅ All good, proceed to submit
    setIsSubmitting(true);
    try {
      for (let selectedDate of formData.dates) {
        const formattedDate = selectedDate.toDate().toISOString().split("T")[0];

        await axios.post(`${backendUrl}/api/availability`, {
          ...formData,
          date: formattedDate,
        });
      }

      toast.success("✅ Attendance submitted successfully!");
      navigate("/student/MarkAttendance");
    } catch (err) {
      toast.error("❌ Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  if (loading)
    return <div className="text-center py-8">Loading student data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Add Attendance</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
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
            name="email"
            value={formData.email}
            disabled
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <input type="hidden" name="busId" value={formData.busId} />
        <input type="hidden" name="noPlate" value={formData.noPlate} />

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
          <label className="block text-gray-700 font-medium mb-1">Select Dates (within 7 days)</label>
          <DatePicker
            multiple
            value={formData.dates}
            onChange={(dates) => setFormData((prev) => ({ ...prev, dates }))}
            minDate={today}
            maxDate={maxDate}
            format="YYYY-MM-DD"
            className="custom-datepicker"
            mapDays={({ date }) => {
              const day = date.weekDay.index; // 0 = Sunday, 6 = Saturday
              if (day === 0 || day === 6) {
                return {
                  disabled: true,
                  style: { color: "#ccc", textDecoration: "line-through" },
                };
              }
            }}
          />
          {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAttendance;
