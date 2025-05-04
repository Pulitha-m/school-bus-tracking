import React, { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../../config/config";
import { UsersIcon, Trash2Icon } from "lucide-react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/getAllStudents`, {
          withCredentials: true,
        });
        setStudents(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${backendUrl}/deleteStudent/${id}`, {
          withCredentials: true,
        });
        setStudents((prev) => prev.filter((student) => student.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete student.");
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const username = student.user?.username?.toLowerCase() || "";
    return (
      student.id.toString().includes(query) ||
      fullName.includes(query) ||
      username.includes(query)
    );
  });

  const closePopup = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Student Management
      </h2>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by Student ID, Name, or Username"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Record Count Card */}
      <div className="bg-white rounded-lg shadow-md p-5 max-w-sm mx-auto flex items-center justify-between border border-blue-200">
        <div>
          <p className="text-blue-600 font-medium">Total Students</p>
          <h3 className="text-3xl font-bold text-blue-700">
            {filteredStudents.length}
          </h3>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <UsersIcon className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      {/* Table Display */}
      {loading && (
        <p className="text-center text-gray-600">Loading students...</p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && students.length === 0 && (
        <p className="text-center text-gray-600">No students found.</p>
      )}

      {!loading && !error && filteredStudents.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="py-3 px-4 border-b">Student ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Username</th>
                <th className="py-3 px-4 border-b">DOB</th>
                <th className="py-3 px-4 border-b">Route ID</th>
                <th className="py-3 px-4 border-b">Bus ID</th>
                <th className="py-3 px-4 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 border-b">{student.id}</td>
                  <td className="py-3 px-4 border-b">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {student.user?.username || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">{student.dob || "N/A"}</td>
                  <td className="py-3 px-4 border-b">
                    {student.routeId || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {student.busId || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b text-right space-x-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-400 text-white text-sm rounded-md hover:bg-yellow-500 transition duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200"
                    >
                      <Trash2Icon size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Pop-up */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Student Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>ID:</strong> {selectedStudent.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedStudent.firstName}{" "}
                {selectedStudent.lastName}
              </p>
              <p>
                <strong>Username:</strong>{" "}
                {selectedStudent.user?.username || "N/A"}
              </p>
              <p>
                <strong>DOB:</strong> {selectedStudent.dob || "N/A"}
              </p>
              <p>
                <strong>Route ID:</strong> {selectedStudent.routeId || "N/A"}
              </p>
              <p>
                <strong>Bus ID:</strong> {selectedStudent.busId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
